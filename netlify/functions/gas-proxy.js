// Netlify Function for Google Apps Script CORS proxy
// This function will be deployed automatically with Netlify

import fetch from 'node-fetch';

exports.handler = async (event, context) => {
  try {
    console.log(`Proxying request through Netlify function`);
    
    // Parse the request body to get the actual target URL and options
    let requestBody;
    try {
      requestBody = JSON.parse(event.body);
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      requestBody = {};
    }
    
    // Extract target URL and options
    const targetUrl = requestBody.url || 'https://script.google.com/macros/s/AKfycbyjXDsJ5PL2N_91KIPNS2EUMIaoFiNxE5LV79RQN2emeyna5AaRriLzs29MZZjAEPXS/exec';
    const method = requestBody.method || 'GET';
    const headers = requestBody.headers || {};
    const body = requestBody.body;
    
    console.log(`Proxying ${method} request to: ${targetUrl}`);
    
    // Forward the request to the target URL
    const response = await fetch(targetUrl, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        ...headers
      },
      body: method !== 'GET' && method !== 'HEAD' ? body : undefined
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