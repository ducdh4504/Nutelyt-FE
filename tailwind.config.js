/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './constants/**/*.{js,jsx,ts,tsx}',
    './hooks/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#ECFDF3',
          100: '#D1FADF',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
        },
        warning: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          500: '#F59E0B',
          600: '#D97706',
        },
        background: '#F7FAF7',
        foreground: '#102118',
        muted: '#667085',
        border: '#D8E3DC',
        card: '#FFFFFF',
      },
      borderRadius: {
        card: '8px',
      },
      spacing: {
        screen: '20px',
      },
    },
  },
  plugins: [],
};
