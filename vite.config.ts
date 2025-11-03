import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3002,
        host: '0.0.0.0',
        strictPort: false,
        proxy: {
          '/gas': {
            target: 'https://script.google.com',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/gas/, '/macros/s/AKfycbyXA_pyLsqLDqF6m0vO7qmLugk4p0wWpQlRtIlJB_59BTMLU4BGRaknwhsYQZ4xm9Xx/exec'),
            configure: (proxy, options) => {
              proxy.on('error', (err, req, res) => {
                console.log('proxy error', err);
              });
              proxy.on('proxyReq', (proxyReq, req, res) => {
                console.log('Sending Request to the Target:', req.method, req.url);
              });
              proxy.on('proxyRes', (proxyRes, req, res) => {
                console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
              });
            },
          },
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
