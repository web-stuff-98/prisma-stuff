/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      sm: '180px',
      md: '220px',
      lg: '300px',
      xl: '400px'
    },  
    extend: {
      fontFamily: {
        'sans': ['Poe Vetica New', 'Helvetica', 'Arial', 'sans-serif']
      }
    },
  },
  plugins: [],
}
