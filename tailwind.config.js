/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        // Facebook-inspired color scheme
        'fb-primary': '#1877F2',
        'fb-blue-dark': '#4267B2',
        // Light Mode UI Colors (Facebook-style)
        'fb-text': '#050505',
        'fb-secondary': '#606770',
        'fb-border': '#ccd0d5',
        'fb-surface': '#F0F2F5',
        'fb-light': '#F0F2F5',
        'fb-hover': '#f7f8fa',
        // Dark Mode UI Colors (Facebook-style)
        'fb-dark-bg': '#18191a',
        'fb-dark-surface': '#242526',
        'fb-text-dark': '#e4e6eb',
        'fb-secondary-dark': '#b0b3b8',
        'fb-border-dark': '#3e4042',
        'fb-hover-dark': '#3a3b3c',
        // Standard Success Color
        'fb-success': '#36a420',
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
