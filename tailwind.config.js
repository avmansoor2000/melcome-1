/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'emerald-royal': '#061812',
        'obsidian': '#0B0F0D',
        'parchment': '#FAF7EE',
        'gold-primary': '#D4AF37',
        'gold-accent': '#E8C868',
        'ruby-seal': '#841414',
      },
      fontFamily: {
        cinzel: ['"Cinzel Decorative"', 'serif'],
        amiri: ['"Amiri"', 'serif'],
        cormorant: ['"Cormorant Garamond"', 'serif'],
        montserrat: ['"Montserrat"', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 35px rgba(212, 175, 55, 0.25)',
        'gold-glow-lg': '0 0 60px rgba(212, 175, 55, 0.45)',
        'ruby-glow': '0 0 35px rgba(132, 20, 20, 0.65), 0 0 15px rgba(212, 175, 55, 0.35)',
      },
    },
  },
  plugins: [],
}

