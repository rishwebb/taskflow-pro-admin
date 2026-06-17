/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#dcecff',
          500: '#2563eb',
          600: '#1d4ed8',
          700: '#1e40af',
          900: '#102a56'
        },
        ink: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          500: '#64748b',
          700: '#334155',
          900: '#0f172a'
        },
        mint: {
          500: '#14b8a6',
          600: '#0d9488'
        },
        amberline: {
          500: '#f59e0b'
        },
        rosebar: {
          500: '#f43f5e'
        }
      },
      boxShadow: {
        panel: '0 18px 45px rgba(15, 23, 42, 0.08)'
      }
    }
  },
  plugins: []
};
