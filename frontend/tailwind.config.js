/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#FFFDF4',
        surface: '#FFFFFF',
        cherry: '#E94B4B',
        butter: '#FFE59A',
        peach: '#FFB86B',
        darkInk: '#30252A',
        text: '#242024',
        muted: '#756D70',
        border: '#E9E2D4',
        mint: '#79C99A',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      }
    },
  },
  plugins: [],
}
