/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['light', 'dark', 'lofi', 'cupcake', 'retro', 'cyberpunk', 'aqua', 'luxury', 'dracula'],
  },
};
