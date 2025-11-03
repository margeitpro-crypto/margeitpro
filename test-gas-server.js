// Simple Node.js script to test Google Apps Script connection
// This can be run from the command line: node test-gas-server.js

const fetch = require('node-fetch');

const gasUrl = 'https://script.google.com/macros/s/AKfycbyjXDsJ5PL2N_91KIPNS2EUMIaoFiNxE5LV79RQN2emeyna5AaRriLzs29MZZjAEPXS/exec';

// Test direct connection
async function testDirectConnection() {
  console.log('Testing direct connection to Google Apps Script...');
  
  try {
    const response = await fetch(gasUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    console.log('Direct response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Success! Direct response data:', JSON.stringify(data, null, 2));
      return { success: true, data };
    } else {
      console.error('Direct HTTP Error:', response.status, response.statusText);
      return { success: false, error: `Direct HTTP Error: ${response.status} ${response.statusText}` };
    }
  } catch (error) {
    console.error('Direct connection test failed:', error);
    return { success: false, error: error.message };
  }
}

// Test with proxy
async function testProxyConnection() {
  console.log('Testing connection to Google Apps Script through CORS proxy...');
  
  const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(gasUrl)}`;
  
  try {
    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    console.log('Proxy response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Success through proxy! Response data:', JSON.stringify(data, null, 2));
      return { success: true, data };
    } else {
      console.error('Proxy HTTP Error:', response.status, response.statusText);
      return { success: false, error: `Proxy HTTP Error: ${response.status} ${response.statusText}` };
    }
  } catch (error) {
    console.error('Proxy connection test failed:', error);
    return { success: false, error: error.message };
  }
}

// Test POST request
async function testPostRequest() {
  console.log('Testing POST connection to Google Apps Script...');
  
  const testData = {
    mode: 'docs',
    action: 'merge',
    test: true
  };
  
  try {
    const response = await fetch(gasUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      body: JSON.stringify(testData)
    });
    
    console.log('POST response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Success! POST response data:', JSON.stringify(data, null, 2));
      return { success: true, data };
    } else {
      console.error('POST HTTP Error:', response.status, response.statusText);
      return { success: false, error: `POST HTTP Error: ${response.status} ${response.statusText}` };
    }
  } catch (error) {
    console.error('POST connection test failed:', error);
    return { success: false, error: error.message };
  }
}

// Run all tests
async function runAllTests() {
  console.log('Running all Google Apps Script connection tests...\n');
  
  const directResult = await testDirectConnection();
  console.log('\n--- Direct Connection Test Result ---');
  console.log(JSON.stringify(directResult, null, 2));
  
  const proxyResult = await testProxyConnection();
  console.log('\n--- Proxy Connection Test Result ---');
  console.log(JSON.stringify(proxyResult, null, 2));
  
  const postResult = await testPostRequest();
  console.log('\n--- POST Request Test Result ---');
  console.log(JSON.stringify(postResult, null, 2));
  
  console.log('\nAll tests completed.');
}

// Run the tests
runAllTests().catch(console.error);