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
          600: '#27AE60',
          700: '#006D37',
        },
        warning: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          500: '#F59E0B',
          600: '#D97706',
        },
        background: '#F9F9FC',
        foreground: '#1A1C1E',
        muted: '#3D4A3F',
        border: '#BCCABC',
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
