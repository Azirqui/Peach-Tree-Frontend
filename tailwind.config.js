/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['Orbitron', 'sans-serif'], // Add the font family you chose
      },
      zIndex: {
        '100': '100',
      },
    },
  },
  plugins: [],
}