/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 玻璃态渐变主题色 - 青蓝色系
        primary: {
          50: '#e0f7fa',
          100: '#b2ebf2',
          200: '#80deea',
          300: '#4dd0e1',
          400: '#26c6da',
          500: '#00bcd4',
          600: '#00acc1',
          700: '#0097a7',
          800: '#00838f',
          900: '#006064',
        },
        gradient: {
          start: '#0cb9c1',
          middle: '#00a8e8',
          end: '#00aeff',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #0cb9c1 0%, #00aeff 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #00d4ff 0%, #0098ff 100%)',
        'gradient-cyan': 'linear-gradient(135deg, #0cb9c1 0%, #00a8e8 50%, #00aeff 100%)',
        'glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-lg': '0 12px 48px 0 rgba(31, 38, 135, 0.45)',
        'glow': '0 0 20px rgba(0, 188, 212, 0.4)',
        'glow-lg': '0 0 30px rgba(0, 188, 212, 0.5)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
