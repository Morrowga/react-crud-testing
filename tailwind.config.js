/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-react': '#5fd4f6'
      }
    },
  },
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
  ]
}