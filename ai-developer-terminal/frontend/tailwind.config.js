/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        blob: "blob 5s linear infinite",
      },
      keyframes: {
        blob: {
          "0%": { transform: "translate(-100%, -100%)" },
          "25%": { transform: "translate(0%, -100%)" },
          "50%": { transform: "translate(0%, 0%)" },
          "75%": { transform: "translate(-100%, 0%)" },
          "100%": { transform: "translate(-100%, -100%)" },
        },
      },
    },
  },
  plugins: [],
};

