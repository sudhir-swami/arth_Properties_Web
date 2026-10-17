/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#1e3a5f',
          900: '#0a192f',
          950: '#060d1a',
        },
        gold: {
          50: '#fdfbf4',
          100: '#faf4df',
          200: '#f3e5b8',
          300: '#ebd18a',
          400: '#dfb755',
          500: '#c59b27', // Signature Warm Gold
          600: '#a87e1a',
          700: '#855f13',
          800: '#644512',
          900: '#473110',
        },
        charcoal: {
          50: '#f8fafc',
          100: '#f1f5f9',
          500: '#64748b',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(10, 25, 47, 0.08), 0 2px 6px -1px rgba(10, 25, 47, 0.04)',
        'card-hover': '0 16px 32px -4px rgba(10, 25, 47, 0.12), 0 6px 12px -2px rgba(10, 25, 47, 0.06)',
        'gold-glow': '0 0 20px rgba(197, 155, 39, 0.35)',
      }
    },
  },
  plugins: [],
}
