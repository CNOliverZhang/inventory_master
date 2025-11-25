/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // 启用 class 模式的深色模式
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #60a5fa 0%, #8b5cf6 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #38bdf8 0%, #6366f1 100%)',
        'gradient-card': 'linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.5) 100%)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
