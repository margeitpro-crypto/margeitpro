// Test script to verify Google Apps Script connection
export const testGasConnection = async () => {
  const gasUrl = 'https://script.google.com/macros/s/AKfycbyjXDsJ5PL2N_91KIPNS2EUMIaoFiNxE5LV79RQN2emeyna5AaRriLzs29MZZjAEPXS/exec';
  
  try {
    console.log('Testing direct connection to Google Apps Script...');
    
    // Simple GET request to test connectivity
    const response = await fetch(gasUrl, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });
    
    console.log('Direct response status:', response.status);
    console.log('Direct response headers:', response.headers);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Success! Direct response data:', data);
      return { success: true, data };
    } else {
      console.error('Direct HTTP Error:', response.status, response.statusText);
      return { success: false, error: `Direct HTTP Error: ${response.status} ${response.statusText}` };
    }
  } catch (error) {
    console.error('Direct connection test failed:', error);
    return { success: false, error: error.message };
  }
};

// Test with CORS proxy
export const testGasConnectionWithProxy = async () => {
  const gasUrl = 'https://script.google.com/macros/s/AKfycbyjXDsJ5PL2N_91KIPNS2EUMIaoFiNxE5LV79RQN2emeyna5AaRriLzs29MZZjAEPXS/exec';
  const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(gasUrl)}`;
  
  try {
    console.log('Testing connection to Google Apps Script through CORS proxy...');
    
    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });
    
    console.log('Proxy response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Success through proxy! Response data:', data);
      return { success: true, data };
    } else {
      console.error('Proxy HTTP Error:', response.status, response.statusText);
      return { success: false, error: `Proxy HTTP Error: ${response.status} ${response.statusText}` };
    }
  } catch (error) {
    console.error('Proxy connection test failed:', error);
    return { success: false, error: error.message };
  }
};

// Test with multiple proxy services
export const testGasConnectionWithMultipleProxies = async () => {
  const gasUrl = 'https://script.google.com/macros/s/AKfycbyjXDsJ5PL2N_91KIPNS2EUMIaoFiNxE5LV79RQN2emeyna5AaRriLzs29MZZjAEPXS/exec';
  
  const proxyUrls = [
    '/.netlify/functions/gas-proxy',
    `https://api.allorigins.win/raw?url=${encodeURIComponent(gasUrl)}`,
    `https://corsproxy.io/?${encodeURIComponent(gasUrl)}`,
    `https://thingproxy.freeboard.io/fetch/${gasUrl}`,
    `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(gasUrl)}`
  ];
  
  for (const proxyUrl of proxyUrls) {
    try {
      console.log('Testing connection through proxy:', proxyUrl);
      
      const response = await fetch(proxyUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });
      
      console.log('Proxy response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Success through proxy! Response data:', data);
        return { success: true, data, proxy: proxyUrl };
      } else {
        console.error('Proxy HTTP Error:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Proxy connection test failed:', proxyUrl, error);
    }
  }
  
  return { success: false, error: 'All proxy services failed' };
};

// Test POST request with fallbacks
export const testGasConnectionPost = async (params: any = {}) => {
  const gasUrl = 'https://script.google.com/macros/s/AKfycbyjXDsJ5PL2N_91KIPNS2EUMIaoFiNxE5LV79RQN2emeyna5AaRriLzs29MZZjAEPXS/exec';
  
  // Test data
  const testData = {
    mode: 'docs',
    action: 'merge',
    ...params
  };
  
  try {
    console.log('Testing POST connection to Google Apps Script...');
    
    const response = await fetch(gasUrl, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      body: JSON.stringify(testData),
    });
    
    console.log('POST response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Success! POST response data:', data);
      return { success: true, data };
    } else {
      console.error('POST HTTP Error:', response.status, response.statusText);
      return { success: false, error: `POST HTTP Error: ${response.status} ${response.statusText}` };
    }
  } catch (error) {
    console.error('POST connection test failed:', error);
    return { success: false, error: error.message };
  }
};