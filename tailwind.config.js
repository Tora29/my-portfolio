/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-primary': 'rgb(12, 13, 21)',
        'dark-secondary': 'rgb(23, 24, 32)',
        'dark-accent': 'rgb(108, 95, 62)',
        'dark-natural': 'rgb(199, 195, 187)',
      },
      fontFamily: {
        'rubik': ['Rubik', 'sans-serif'],
        'squada': ['Squada One', 'cursive'],
      },
    },
  },
  plugins: [],
}