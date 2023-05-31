/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/react-tailwindcss-select/dist/index.esm.js',
  ],
  plugins: [require('daisyui'), require('@headlessui/react'), require('tailwind-scrollbar')],
  daisyui: {
    themes: ['light', 'dark', 'lofi', 'cupcake', 'retro', 'cyberpunk', 'aqua', 'luxury', 'dracula'],
  },
};
