// Netlify Function for Google Apps Script CORS proxy
// This function will be deployed automatically with Netlify

const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, User-Agent',
        'Access-Control-Max-Age': '86400'
      },
      body: ''
    };
  }
  
  try {
    console.log(`Proxying request through Netlify function`);
    
    // For simplicity, forward the request directly to GAS
    // This assumes the client is sending the correct data format
    const targetUrl = 'https://script.google.com/macros/s/AKfycbzhOblUM7ebUqq8MidSmXZGVGG__-GHM5WGlGp6mdnq8MLZQkbJSPPvrFjJHZnSMO6B/exec';
    
    // Forward the request to the target URL
    const response = await fetch(targetUrl, {
      method: event.httpMethod || 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        ...event.headers
      },
      body: event.body
    });

    // Get response data
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Send response with CORS headers
    return {
      statusCode: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, User-Agent',
        'Content-Type': contentType || 'application/json'
      },
      body: typeof data === 'string' ? data : JSON.stringify(data)
    };
  } catch (error) {
    console.error('Proxy error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, User-Agent'
      },
      body: JSON.stringify({ error: 'Proxy request failed', message: error.message })
    };
  }
};