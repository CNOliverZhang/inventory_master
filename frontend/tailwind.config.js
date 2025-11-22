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
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, #06b6d4, #3b82f6)',
        'gradient-secondary': 'linear-gradient(to right, #22d3ee, #3b82f6)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
