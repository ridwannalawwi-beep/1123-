var https = require('https');

var RAJAONGRIR_URL = 'rajaongkir.komerce.id';
var ORIGIN_ID = null;

function apiGet(path, apiKey) {
  return new Promise(function(resolve, reject) {
    var opts = {
      hostname: RAJAONGRIR_URL,
      path: '/api/v1' + path,
      method: 'GET',
      headers: { 'x-api-key': apiKey },
      timeout: 10000
    };
    var req = https.request(opts, function(res) {
      var body = '';
      res.on('data', function(c) { body += c; });
      res.on('end', function() {
        try { resolve(JSON.parse(body)); }
        catch(e) { resolve({ error: true, message: 'Parse error' }); }
      });
    });
    req.on('error', function(e) { reject(new Error(e.message)); });
    req.on('timeout', function() { req.destroy(); reject(new Error('timeout')); });
    req.end();
  });
}

function apiPost(path, data, apiKey) {
  return new Promise(function(resolve, reject) {
    var postData = JSON.stringify(data);
    var opts = {
      hostname: RAJAONGRIR_URL,
      path: '/api/v1' + path,
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 10000
    };
    var req = https.request(opts, function(res) {
      var body = '';
      res.on('data', function(c) { body += c; });
      res.on('end', function() {
        try { resolve(JSON.parse(body)); }
        catch(e) { resolve({ error: true, message: 'Parse error: ' + body.substring(0,200) }); }
      });
    });
    req.on('error', function(e) { reject(new Error(e.message)); });
    req.on('timeout', function() { req.destroy(); reject(new Error('timeout')); });
    req.write(postData);
    req.end();
  });
}

exports.handler = async function(event) {
  var headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  var params = event.queryStringParameters || {};
  var city = (params.city || '').trim();
  var weight = parseInt(params.weight) || 1;
  var apiKey = process.env.RAJAONGKIR_API_KEY;

  if (!apiKey) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'API key not configured' }) };
  }

  if (!city) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'city required' }) };
  }

  try {
    // 1. Search origin (Jakarta) — cache ORIGIN_ID
    if (!ORIGIN_ID) {
      var originSearch = await apiGet('/destination/domestic-destination?q=jakarta', apiKey);
      if (originSearch && originSearch.data && originSearch.data.length > 0) {
        ORIGIN_ID = originSearch.data[0].id;
      }
    }

    // 2. Search destination city
    var destSearch = await apiGet('/destination/domestic-destination?q=' + encodeURIComponent(city), apiKey);
    if (!destSearch || !destSearch.data || destSearch.data.length === 0) {
      return { statusCode: 200, headers, body: JSON.stringify({ error: 'city_not_found' }) };
    }

    var dest = destSearch.data[0];

    // 3. Calculate cost
    var calcResult = await apiPost('/calculate/domestic-cost', {
      origin_id: parseInt(ORIGIN_ID),
      destination_id: parseInt(dest.id),
      weight: weight,
      courier: 'jne,tiki,pos'
    }, apiKey);

    if (!calcResult || calcResult.error) {
      return { statusCode: 200, headers, body: JSON.stringify({ error: calcResult ? calcResult.message : 'API error' }) };
    }

    var results = [];
    if (calcResult.data) {
      calcResult.data.forEach(function(item) {
        if (item.costs) {
          item.costs.forEach(function(c) {
            var costVal = c.cost ? (c.cost[0] ? c.cost[0].value : c.value) : c.total_fee || 0;
            results.push({
              courier: (item.code || item.name || '').toUpperCase(),
              service: c.service || c.name || '',
              cost: costVal,
              etd: c.etd || c.estimation || c.duration || '—'
            });
          });
        }
      });
    }

    results.sort(function(a, b) { return a.cost - b.cost; });
    return { statusCode: 200, headers, body: JSON.stringify({ success: true, results: results, city: city }) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
