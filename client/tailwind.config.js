/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#172233',
        mist: '#f4f7fb',
        cobalt: '#315cf6',
        aqua: '#52d6c6',
        lilac: '#8d87ee',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 18px 55px rgba(48, 74, 113, 0.08)',
        card: '0 8px 25px rgba(52, 75, 106, 0.08)',
      },
      animation: {
        'float-slow': 'float 7s ease-in-out infinite',
        'float-delayed': 'float 7s 1.8s ease-in-out infinite',
        'fade-up': 'fade-up .7s cubic-bezier(.22,1,.36,1) both',
        'shimmer': 'shimmer 2.8s linear infinite',
        'pulse-soft': 'pulse-soft 2.8s ease-in-out infinite',
        'drift': 'drift 12s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(18px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-120%)' },
          '100%': { transform: 'translateX(120%)' },
        },
        'pulse-soft': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(49, 92, 246, 0.14)' },
          '50%': { boxShadow: '0 0 0 10px rgba(49, 92, 246, 0)' },
        },
        drift: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) rotate(0deg)' },
          '50%': { transform: 'translate3d(18px, -14px, 0) rotate(4deg)' },
        },
      },
    },
  },
  plugins: [],
};
