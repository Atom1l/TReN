/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          800: '#1E3A8A', // สีน้ำเงินที่คุณชอบใช้ใน UI
        }
      }
    },
  },
  plugins: [],
}