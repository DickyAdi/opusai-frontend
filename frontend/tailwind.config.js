/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        dark: {
          bg: '#1E1E2E',
          sidebar: '#2D2D3A',
          border: '#3A3A4A',
        }
      },
    },
  },
  plugins: [],
}