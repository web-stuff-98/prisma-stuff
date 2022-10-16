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
      md: "680px",
      lg: "860px",
    },
    extend: {
      fontFamily: {
        Archivo: ["Archivo", ...defaultTheme.fontFamily.sans],
        ArchivoBlack: ["Archivo Black", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        darkBackground: "rgb(23,23,26)",
      },
      height: {
        postHeight: "13.666em",
      },
      minWidth: {
        postWidth: "15em",
      },
      maxWidth: {
        postWidth: "15em",
      }
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
