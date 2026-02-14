/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1f2937', // dark theme primary backgrounds
          light: '#374151',
          dark: '#111827'
        },
        accent: {
          DEFAULT: '#10b981', // green accent color
          light: '#6ee7b7',
          dark: '#047857'
        }
      }
    },
  },
  plugins: [],
};