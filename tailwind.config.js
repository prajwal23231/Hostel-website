/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        poshtel: {
          bg: '#F8F5EE',
          surface: '#FFFFFF',
          card: '#F2ECE1',
          sand: '#E7D4B3',
          sandDark: '#D4BF9A',
          teal: '#16373F',
          tealDark: '#0D242A',
          tealLight: '#23535E',
          green: '#2A5542',
          coral: '#D96B50',
          muted: '#63787D',
        }
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        sans: ['Inter', 'sans-serif']
      },
      boxShadow: {
        'soft': '0 8px 30px rgba(22, 55, 63, 0.06)',
        'elevated': '0 16px 40px rgba(22, 55, 63, 0.12)',
        'glow': '0 0 25px rgba(231, 212, 179, 0.4)',
      }
    },
  },
  plugins: [],
};
