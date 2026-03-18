/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sui: {
          blue: '#4DA2FF',
          aqua: '#6FE3FF',
          navy: '#0B1C2C',
          deep: '#0F172A',
          light: '#7DD3FC',
          white: '#F8FAFC',
        },
        rugred: '#FF4444',
        darkcard: '#0D1F2D',
        darkmuted: '#112233',
      },
      fontFamily: {
        sans: ['Inter', 'Space Grotesk', 'sans-serif'],
      },
      backgroundImage: {
        'sui-gradient': 'linear-gradient(135deg, #4DA2FF, #6FE3FF)',
        'sui-dark': 'linear-gradient(135deg, #0B1C2C, #4DA2FF)',
        'card-glass': 'linear-gradient(135deg, rgba(13,31,45,0.8), rgba(77,162,255,0.05))',
      },
      boxShadow: {
        'sui-glow': '0 0 30px rgba(77,162,255,0.2)',
        'sui-glow-lg': '0 0 60px rgba(77,162,255,0.3)',
        'aqua-glow': '0 0 30px rgba(111,227,255,0.2)',
        'rug-glow': '0 0 30px rgba(255,68,68,0.2)',
      },
      animation: {
        'flow': 'flow 8s ease-in-out infinite',
        'ripple': 'ripple 3s ease-in-out infinite',
        'scan': 'scan 3s linear infinite',
      },
      keyframes: {
        flow: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        ripple: {
          '0%': { transform: 'scale(1)', opacity: '0.4' },
          '100%': { transform: 'scale(2.5)', opacity: '0' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      },
    },
  },
  plugins: [],
}