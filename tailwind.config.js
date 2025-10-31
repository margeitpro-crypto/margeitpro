/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light Mode Colors
        light: {
          background: '#f8fafc',
          surface: '#ffffff',
          text: {
            primary: '#0f172a',
            secondary: '#64748b',
          },
          border: '#e2e8f0',
          brand: '#2563eb',
          danger: '#dc2626',
        },
        // Dark Mode Colors
        dark: {
          background: '#020617',
          surface: '#0f172a',
          text: {
            primary: '#f1f5f9',
            secondary: '#94a3b8',
          },
          border: '#334155',
          brand: '#3b82f6',
          danger: '#ef4444',
          button: {
            primary: '#1e293b',
            secondary: '#334155',
            hover: '#475569',
          },
        },
      },
    },
  },
  plugins: [],
}
