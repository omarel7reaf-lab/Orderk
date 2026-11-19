/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#060814',
          900: '#0b0e22',
          850: '#0f142e',
          800: '#141a3d',
          750: '#19214d',
          700: '#1f2960',
          600: '#2c3982',
        },
        coral: {
          400: '#ff988c',
          500: '#ff7e70',
          600: '#f86555',
          bg: '#ff7e70',
        },
        kds: {
          green: '#10b981',
          blue: '#3b82f6',
          purple: '#8b5cf6',
          orange: '#f97316',
          red: '#ef4444',
          yellow: '#eab308'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      }
    },
  },
  plugins: [],
}

