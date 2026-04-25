/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        fadeSlideIn: {
          "0%": { opacity: 0, transform: "translateX(-40px)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
        fadeSlideUp: {
          "0%": { opacity: 0, transform: "translateY(40px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        fadeSlideIn: "fadeSlideIn 0.8s ease-out forwards",
        fadeSlideUp: "fadeSlideUp 0.8s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
