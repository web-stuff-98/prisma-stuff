/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  purge: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      sm: '2px',
      md: '700px',
      lg: '780px',
      xl: '1024px'
    },  
    extend: {
      fontFamily: {
        Archivo: ["Archivo", ...defaultTheme.fontFamily.sans],
        ArchivoBlack: ["Archivo Black", ...defaultTheme.fontFamily.sans]
      },
      colors: {
        darkBackground: "rgb(21,21,24)"
      },
      height: {
        postHeight: "13.666em"
      },
      minWidth: {
        postWidth: "16em"
      }
    },
  },
  plugins: [],
}
