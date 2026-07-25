/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#F8FAFC',
          surface: '#FFFFFF',
          card: '#FFFFFF',
          border: '#E2E8F0',
          orange: '#F97316',
          orangeGlow: 'rgba(249, 115, 22, 0.08)',
          muted: '#475569',
          dark: '#0F172A'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'IBM Plex Sans Thai', 'sans-serif'],
        heading: ['Outfit', 'IBM Plex Sans Thai', 'sans-serif'],
        mono: ['Fira Code', 'monospace']
      }
    },
  },
  plugins: [],
}
