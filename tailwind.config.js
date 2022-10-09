/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      sm: '380px',
      md: '420px',
      lg: '600px',
      xl: '800px'
    },  
    extend: {
      fontFamily: {
        'sans': ['Poe Vetica New', 'Helvetica', 'Arial', 'sans-serif']
      }
    },
  },
  plugins: [],
}
