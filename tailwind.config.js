const deafaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'near-blue': '#554BF9',
        'near-purple': '#8F00FF',
        'near-darkpurple': '#99428E',
        'near-red': '#E03C37',
      },
      fontFamily: {
        sans: ['Avenir Next', ...deafaultTheme.fontFamily.sans],
        raleway: ['Raleway', 'sans-serif'],
      },
      backgroundImage: {
        'main-image': "url('/images/bg-img.svg')",
      },
    },
  },
  plugins: [],
};
