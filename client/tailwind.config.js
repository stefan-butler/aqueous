/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'primary' : '#2e4058',
        'dark' : '#1f2937',
        'lighter' : '#93acce',
        'light' : '#93acce',
        
      }
    },
  },
  plugins: [],
}

