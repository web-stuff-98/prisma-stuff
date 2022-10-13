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
      sm: '400px',
      md: '550px',
      lg: '650px',
      xl: '860px'
    },  
    extend: {
      fontFamily: {
        Inter: ["Inter Tight", ...defaultTheme.fontFamily.sans],
        Kanit: ["Kanit", ...defaultTheme.fontFamily.sans]
      },
      colors: {
        background: "rgb(21,21,24)"
      }
    },
  },
  plugins: [],
}
