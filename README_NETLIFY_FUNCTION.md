# Netlify Function for Google Apps Script CORS Proxy

This project includes a Netlify Function that acts as a CORS proxy for Google Apps Script requests. This solves the CORS issues that occur when making requests to Google Apps Script from a browser.

## How it works

The Netlify Function (`netlify/functions/gas-proxy.js`) receives requests from the frontend and forwards them to the Google Apps Script endpoint. Since server-to-server requests don't have CORS restrictions, this bypasses the browser's CORS policy.

## Deployment

When you deploy your site to Netlify, the function will be automatically deployed as well. No additional configuration is needed.

## Usage

The function is automatically used as a fallback in the `gasClient.ts` file when direct requests to Google Apps Script fail due to CORS issues.

## Testing

You can test the function by visiting `/test-netlify-function.html` on your deployed site and clicking the "Test Netlify Function" button.

## Local Development

For local development, the Vite proxy configuration in `vite.config.ts` routes requests to `/gas-proxy` to a local proxy server. To use this:

1. Run the proxy server: `npm run proxy-server`
2. Start the development server: `npm run dev`

The proxy server will be available at `http://localhost:3001` and will be accessible through the Vite proxy at `/gas-proxy`.