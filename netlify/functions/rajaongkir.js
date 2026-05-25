var CITY_IDS = {
  'jakarta': 151, 'jakarta pusat': 151, 'jakpus': 151, 'jakarta utara': 152, 'jakut': 152,
  'jakarta barat': 153, 'jakbar': 153, 'jakarta selatan': 154, 'jaksel': 154, 'jakarta timur': 155, 'jaktim': 155,
  'bekasi': 158, 'depok': 163, 'tangerang': 160, 'tangerang selatan': 159, 'tangsel': 159, 'bogor': 156,
  'bandung': 23, 'cimahi': 28, 'garut': 56, 'tasikmalaya': 394, 'cirebon': 42, 'purwakarta': 324, 'sukabumi': 385,
  'semarang': 326, 'salatiga': 337, 'surakarta': 383, 'solo': 383, 'magelang': 214,
  'yogyakarta': 417, 'bantul': 24, 'sleman': 365,
  'surabaya': 384, 'malang': 215, 'pasuruan': 291, 'probolinggo': 323, 'kediri': 145, 'blitar': 53, 'madiun': 209,
  'mojokerto': 224, 'sidoarjo': 357, 'gresik': 66, 'batu': 30,
  'medan': 237, 'padang': 277, 'palembang': 282, 'pekanbaru': 300, 'bandar lampung': 22, 'lampung': 22,
  'pontianak': 316, 'samarinda': 338, 'balikpapan': 21, 'banjarmasin': 25,
  'makassar': 212, 'manado': 218, 'palu': 283, 'kendari': 147,
  'denpasar': 32, 'mataram': 221, 'kupang': 189,
  'ambon': 19, 'jayapura': 139
};

var originId = 151;

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
  var city = (params.city || '').trim().toLowerCase();
  var weight = parseInt(params.weight) || 1;

  if (!city) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'city required' }) };
  }

  var destId = CITY_IDS[city];
  if (!destId) {
    var partial = Object.keys(CITY_IDS).filter(function(k) { return city.includes(k) || k.includes(city); });
    destId = partial.length > 0 ? CITY_IDS[partial[0]] : null;
  }

  if (!destId) {
    return { statusCode: 200, headers, body: JSON.stringify({ error: 'city_not_found', message: 'City not found in database' }) };
  }

  var apiKey = process.env.RAJAONGKIR_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'API key not configured' }) };
  }

  var body = new URLSearchParams();
  body.append('origin', originId.toString());
  body.append('destination', destId.toString());
  body.append('weight', weight.toString());
  body.append('courier', 'jne:tiki:pos');

  try {
    var response = await fetch('https://api.rajaongkir.com/starter/cost', {
      method: 'POST',
      headers: {
        'key': apiKey,
        'content-type': 'application/x-www-form-urlencoded'
      },
      body: body.toString()
    });

    var data = await response.json();

    if (data.rajaongkir && data.rajaongkir.status && data.rajaongkir.status.code !== 200) {
      return { statusCode: 200, headers, body: JSON.stringify({ error: data.rajaongkir.status.description }) };
    }

    var results = [];
    if (data.rajaongkir && data.rajaongkir.results) {
      data.rajaongkir.results.forEach(function(courier) {
        if (courier.costs) {
          courier.costs.forEach(function(cost) {
            results.push({
              courier: courier.name.toUpperCase(),
              service: cost.service,
              description: cost.description,
              cost: cost.cost[0].value,
              etd: cost.cost[0].etd
            });
          });
        }
      });
    }

    results.sort(function(a, b) { return a.cost - b.cost; });

    return { statusCode: 200, headers, body: JSON.stringify({ success: true, results: results, city: city, destId: destId }) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
