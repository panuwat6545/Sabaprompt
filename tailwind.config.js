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
          bg: '#09090B',
          surface: '#18181B',
          border: '#27272A',
          orange: '#F97316',
          orangeGlow: 'rgba(249, 115, 22, 0.05)',
          muted: '#A1A1AA'
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'Noto Sans Thai', 'sans-serif'],
        heading: ['Outfit', 'Inter', 'Noto Sans Thai', 'sans-serif']
      }
    },
  },
  plugins: [],
}
