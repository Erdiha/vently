/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out both',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      colors: {
        primary: {
          DEFAULT: '#2563eb', // indigo-600
          dark: '#4338CA', // indigo-700
        },
        accent: {
          DEFAULT: '#7DD3FC', // sky-300
          light: '#E0F2FE', // sky-100
        },
        calm: {
          DEFAULT: '#71C0BB', // soft teal
        },
        warm: {
          DEFAULT: '#FDE68A', // yellow-200
        },
        support: {
          success: '#34D399', // emerald-400
          soft: '#FBCFE8', // rose-200
        },
        secure: {
          DEFAULT: '#334155', // slate-700 for secrecy/safety
          dark: '#1E293B', // slate-800 for hover/deep elements
        },
        button: {
          DEFAULT: '#F59E0B', // amber-500 for button background
          hover: '#FCD34D', // amber-400 for hover state
        },
      },
    },
  },
  plugins: [],
}
