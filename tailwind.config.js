/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        gradient: {
          start: '#22c55e',
          end: '#16a34a',
        }
      },
      backgroundImage: {
        'gradient-green': 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
        'gradient-green-light': 'linear-gradient(135deg, #86efac 0%, #4ade80 100%)',
      },
      keyframes: {
        fadeSlideIn: {
          "0%": { opacity: 0, transform: "translateX(-40px)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
        fadeSlideUp: {
          "0%": { opacity: 0, transform: "translateY(40px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: 0 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
      },
      animation: {
        fadeSlideIn: "fadeSlideIn 0.8s ease-out forwards",
        fadeSlideUp: "fadeSlideUp 0.8s ease-out forwards",
        fadeIn: "fadeIn 0.6s ease-out forwards",
        scaleIn: "scaleIn 0.5s ease-out forwards",
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'medium': '0 8px 30px rgba(0, 0, 0, 0.12)',
        'large': '0 12px 40px rgba(0, 0, 0, 0.15)',
        'green': '0 4px 20px rgba(34, 197, 94, 0.25)',
      },
      transitionDuration: {
        '400': '400ms',
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
