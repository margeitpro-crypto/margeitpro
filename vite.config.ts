import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: '/margeitpro/',
      server: {
        port: 3002,
        host: '0.0.0.0',
        strictPort: false,
        proxy: {
          '/gas': {
            target: 'https://script.google.com',
            changeOrigin: true,
            secure: true,
            rewrite: (path) => path.replace(/^\/gas/, '/macros/s/AKfycbyjXDsJ5PL2N_91KIPNS2EUMIaoFiNxE5LV79RQN2emeyna5AaRriLzs29MZZjAEPXS/exec'),
            configure: (proxy, options) => {
              proxy.on('error', (err, req, res) => {
                console.log('proxy error', err);
              });
              proxy.on('proxyReq', (proxyReq, req, res) => {
                console.log('Sending Request to the Target:', req.method, req.url);
                // Add headers to handle CORS
                proxyReq.setHeader('Origin', 'https://margeitpro.netlify.app');
              });
              proxy.on('proxyRes', (proxyRes, req, res) => {
                console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
                // Add comprehensive CORS headers for local development
                proxyRes.headers['access-control-allow-origin'] = '*';
                proxyRes.headers['access-control-allow-methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
                proxyRes.headers['access-control-allow-headers'] = 'Content-Type, Authorization, X-Requested-With, User-Agent';
                proxyRes.headers['access-control-allow-credentials'] = 'true';
                proxyRes.headers['access-control-max-age'] = '86400';
                proxyRes.headers['access-control-expose-headers'] = '*';
              });
            },
          },
          '/gas-proxy': {
            target: 'http://localhost:3001',
            changeOrigin: true,
            secure: false,
            configure: (proxy, options) => {
              proxy.on('error', (err, req, res) => {
                console.log('proxy error', err);
              });
              proxy.on('proxyReq', (proxyReq, req, res) => {
                console.log('Sending Request to the Proxy Server:', req.method, req.url);
              });
              proxy.on('proxyRes', (proxyRes, req, res) => {
                console.log('Received Response from the Proxy Server:', proxyRes.statusCode, req.url);
                // Add comprehensive CORS headers
                proxyRes.headers['access-control-allow-origin'] = '*';
                proxyRes.headers['access-control-allow-methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
                proxyRes.headers['access-control-allow-headers'] = 'Content-Type, Authorization, X-Requested-With, User-Agent';
                proxyRes.headers['access-control-allow-credentials'] = 'true';
                proxyRes.headers['access-control-max-age'] = '86400';
                proxyRes.headers['access-control-expose-headers'] = '*';
              });
            },
          }
        },
      },
      preview: {
        port: 4173,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        visualizer({
          filename: 'dist/stats.html',
          open: true,
          gzipSize: true,
          brotliSize: true,
        }),
      ],
      build: {
        rollupOptions: {
          output: {
            manualChunks: {
              vendor: ['react', 'react-dom'],
              firebase: ['firebase/app', 'firebase/firestore'],
              ui: ['@floating-ui/react', 'chart.js', 'react-chartjs-2'],
            },
          },
        },
        cssCodeSplit: true,
      },
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});