/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        patternBlue: '#0055B8',
        patternWhite: '#FFFFFF',
        patternBrown: '#7B3F00',
        patternBrownDark: '#522900',
      },
      fontFamily: {
        sans: ['Outfit', 'Noto Sans Ethiopic', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
