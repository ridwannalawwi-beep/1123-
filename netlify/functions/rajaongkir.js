var https = require('https');
var querystring = require('querystring');

var BASE_URL = 'rajaongkir.komerce.id';
var BASE_PATH = '/api/v1';

function apiGet(path, query, apiKey) {
  return new Promise(function(resolve, reject) {
    var qs = Object.keys(query).length ? '?' + querystring.stringify(query) : '';
    var opts = {
      hostname: BASE_URL,
      path: BASE_PATH + path + qs,
      method: 'GET',
      headers: { 'key': apiKey, 'Accept': 'application/json' },
      timeout: 10000
    };
    var req = https.request(opts, function(res) {
      var body = '';
      res.on('data', function(c) { body += c; });
      res.on('end', function() {
        try { resolve(JSON.parse(body)); }
        catch(e) { resolve({ meta: { status: 'error', message: 'Parse error' }, data: null }); }
      });
    });
    req.on('error', function(e) { reject(new Error(e.message)); });
    req.on('timeout', function() { req.destroy(); reject(new Error('timeout')); });
    req.end();
  });
}

function apiPost(path, data, apiKey) {
  return new Promise(function(resolve, reject) {
    var postData = querystring.stringify(data);
    var opts = {
      hostname: BASE_URL,
      path: BASE_PATH + path,
      method: 'POST',
      headers: {
        'key': apiKey,
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 10000
    };
    var req = https.request(opts, function(res) {
      var body = '';
      res.on('data', function(c) { body += c; });
      res.on('end', function() {
        try { resolve(JSON.parse(body)); }
        catch(e) { resolve({ meta: { status: 'error', message: 'Parse error' }, data: null }); }
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
  var action = params.action || '';
  var apiKey = process.env.RAJAONGKIR_API_KEY;

  if (!apiKey) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'API key not configured' }) };
  }

  try {
    // Province list
    if (action === 'provinces') {
      var res = await apiGet('/destination/province', {}, apiKey);
      if (res && res.meta && res.meta.status === 'success' && res.data) {
        return { statusCode: 200, headers, body: JSON.stringify({ success: true, data: res.data }) };
      }
      var isLimit = (res && res.meta && res.meta.message && res.meta.message.toLowerCase().indexOf('limit') !== -1);
      return { statusCode: 200, headers, body: JSON.stringify({ error: 'failed', limited: !!isLimit }) };
    }

    // City list for a province
    if (action === 'cities') {
      var provinceId = params.province_id;
      if (!provinceId) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'province_id required' }) };
      }
      var res = await apiGet('/destination/city/' + provinceId, {}, apiKey);
      if (res.meta && res.meta.status === 'success' && res.data) {
        return { statusCode: 200, headers, body: JSON.stringify({ success: true, data: res.data }) };
      }
      return { statusCode: 200, headers, body: JSON.stringify({ error: 'failed' }) };
    }

    // Default: calculate shipping cost
    var city = (params.city || '').trim();
    var weight = parseInt(params.weight) || 1;

    if (!city) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'city required' }) };
    }

    // Search origin (workshop: Bandung)
    var originSearch = await apiGet('/destination/domestic-destination', { search: 'bandung', limit: 1 }, apiKey);
    if (!originSearch || originSearch.meta.status !== 'success' || !originSearch.data || originSearch.data.length === 0) {
      return { statusCode: 200, headers, body: JSON.stringify({ error: 'origin_not_found' }) };
    }
    var originId = String(originSearch.data[0].id);

    // Search destination city
    var destSearch = await apiGet('/destination/domestic-destination', { search: city, limit: 5 }, apiKey);
    if (!destSearch || destSearch.meta.status !== 'success' || !destSearch.data || destSearch.data.length === 0) {
      return { statusCode: 200, headers, body: JSON.stringify({ error: 'city_not_found' }) };
    }

    var destId = String(destSearch.data[0].id);

    // Calculate costs for multiple couriers
    var couriers = ['jne', 'tiki', 'pos', 'sicepat', 'jnt'];
    var results = [];

    for (var i = 0; i < couriers.length; i++) {
      var calcResult = await apiPost('/calculate/domestic-cost', {
        origin: originId,
        destination: destId,
        weight: weight * 1000,
        courier: couriers[i],
        price: 'lowest'
      }, apiKey);

      if (calcResult && calcResult.meta.status === 'success' && calcResult.data) {
        calcResult.data.forEach(function(item) {
          results.push({
            courier: (item.code || '').toUpperCase(),
            name: item.name || '',
            service: item.service || '',
            cost: item.cost || 0,
            etd: (item.etd || '—').replace('day', 'hari').replace('days', 'hari')
          });
        });
      }
    }

    if (results.length === 0) {
      return { statusCode: 200, headers, body: JSON.stringify({ error: 'no_courier_available' }) };
    }

    results.sort(function(a, b) { return a.cost - b.cost; });
    return { statusCode: 200, headers, body: JSON.stringify({ success: true, results: results, city: city }) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
