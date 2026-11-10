/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#176B45',
          dark: '#104D35',
          light: '#238a5a',
        },
        leaf: {
          DEFAULT: '#5BA66B',
          light: '#7fc48e',
          dark: '#458553',
        },
        lightGreen: {
          DEFAULT: '#F0F7F0',
          50: '#F7FCF7',
          100: '#F0F7F0',
          200: '#DCECDC',
        },
        warmCream: {
          DEFAULT: '#FAF8F0',
          50: '#FDFCF7',
          100: '#FAF8F0',
          200: '#F3EEDC',
        },
        darkText: '#17231C',
        secondaryText: '#66736A',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Outfit"', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(16, 77, 53, 0.05), 0 1px 2px -1px rgba(16, 77, 53, 0.05)',
        'card': '0 4px 20px -2px rgba(16, 77, 53, 0.07), 0 2px 6px -2px rgba(16, 77, 53, 0.04)',
        'premium': '0 10px 30px -4px rgba(23, 107, 69, 0.12), 0 4px 10px -2px rgba(23, 107, 69, 0.06)',
      },
      borderRadius: {
        'xl': '0.875rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      }
    },
  },
  plugins: [],
}
