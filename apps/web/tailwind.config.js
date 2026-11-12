/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: '#176B45',
        'primary-dark': '#104D35',
        'primary-light': '#A7F3D0',
        background: '#FAF8F0',
        surface: '#FFFFFF',
        'text-primary': '#17231C',
        'text-secondary': '#66736A',
      },
    },
  },
  plugins: [],
};
