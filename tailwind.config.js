import primeui from 'tailwindcss-primeui'

const defaultColors = require('tailwindcss/colors');
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  theme: {
    extend: {
      options: {
        // cssLayer: {
        //   name: 'primevue', //any name you want. will be referenced on app.css
        //   order: 'tailwind-base, primeui, tailwind-utilities'
        // }
      },
      colors: {
        // ...defaultColors,
        'dark-mode': '#0D0D0D',
        'light-mode': '#FFFFFF',
        'accent-one': '#00FF85',
        'accent-second': '#1E90FF',
        'accent-third': '#FF0099',
        // 'accent': {
        //   'one': '#00FF85',
        //   'second': '#1E90FF',
        //   'third': '#FF0099'
        // }

      },
    },
  },
  // darkMode: ['class', '.app-dark'],
  plugins: [primeui],
}

