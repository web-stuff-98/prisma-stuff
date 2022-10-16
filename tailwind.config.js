/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  darkMode: "class",
  purge: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      sm: "1px",
      md: "700px",
      lg: "780px",
      xl: "900px",
    },
    extend: {
      fontFamily: {
        Archivo: ["Archivo", ...defaultTheme.fontFamily.sans],
        ArchivoBlack: ["Archivo Black", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        darkBackground: "rgb(21,21,24)",
      },
      height: {
        postHeight: "13.666em",
      },
      minWidth: {
        postWidth: "16em",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
