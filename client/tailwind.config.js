/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'primary' : '#34623F',
        'dark' : '#1E2F23',
        'lighter' : '#607744',
        'light' : '#768948',
      }
    },
  },
  plugins: [],
}

