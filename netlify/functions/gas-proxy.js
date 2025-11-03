exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Parse the request body to get the target URL and request details
    const requestBody = JSON.parse(event.body);
    const { url, method = 'GET', headers: requestHeaders = {}, body } = requestBody;

    // Validate that the URL is the expected GAS URL
    const expectedUrl = 'https://script.google.com/macros/s/AKfycbzhOblUM7ebUqq8MidSmXZGVGG__-GHM5WGlGp6mdnq8MLZQkbJSPPvrFjJHZnSMO6B/exec';
    if (url !== expectedUrl) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid target URL' }),
      };
    }

    // Prepare the request to the GAS URL
    const fetchOptions = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...requestHeaders,
      },
    };

    if (body && method === 'POST') {
      fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    // Make the request to GAS
    const response = await fetch(url, fetchOptions);

    // Get the response data
    const responseText = await response.text();
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      responseData = responseText;
    }

    // Return the response with CORS headers
    return {
      statusCode: response.status,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(responseData),
    };
  } catch (error) {
    console.error('Proxy error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
