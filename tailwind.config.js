/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      sm: '200px',
      md: '500px',
      lg: '650px',
      xl: '860px'
    },  
    extend: {
      fontFamily: {
        'sans': ['Poe Vetica New', 'Helvetica', 'Arial', 'sans-serif']
      }
    },
  },
  plugins: [],
}
