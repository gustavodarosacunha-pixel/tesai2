/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f4f9ff',
          100: '#e6f0ff',
          200: '#c4dcff',
          300: '#94c0ff',
          400: '#5f9aff',
          500: '#3876f6',
          600: '#2358d9',
          700: '#1b44ab',
          800: '#1c3c84',
          900: '#1c3468',
        },
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(15, 23, 42, 0.25)',
      },
    },
  },
  plugins: [],
}

