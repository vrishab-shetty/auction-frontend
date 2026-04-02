/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          white: "#f4f9fa",      // Catskill White
          primary: "#092a4b",    // Downriver
          secondary: "#c2a452",  // Roti
          neutral: "#7c745a",    // Crocodile
        }
      }
    },
  },
  plugins: [],
}
