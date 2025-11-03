// Simple CORS proxy server for Google Apps Script
// This can be deployed to a service like Vercel, Netlify Functions, or Render

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Google Apps Script URL
const GAS_URL = 'https://script.google.com/macros/s/AKfycbyjXDsJ5PL2N_91KIPNS2EUMIaoFiNxE5LV79RQN2emeyna5AaRriLzs29MZZjAEPXS/exec';

// Proxy endpoint
app.all('/gas-proxy', async (req, res) => {
  try {
    console.log(`Proxying ${req.method} request to Google Apps Script`);
    
    // Forward the request to Google Apps Script
    const response = await fetch(GAS_URL, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        ...req.headers
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined
    });

    // Get response data
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Set CORS headers
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, User-Agent');
    
    // Send response
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Proxy request failed', message: error.message });
  }
});

// Handle preflight requests
app.options('/gas-proxy', cors(), (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, User-Agent');
  res.sendStatus(200);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Proxy server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`CORS proxy server running on port ${PORT}`);
});

module.exports = app;