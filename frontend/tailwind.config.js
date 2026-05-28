module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF5A36', // Curated appetizing warm coral-orange
          50: '#FFF0ED',
          100: '#FFDEC9',
          500: '#FF5A36',
          600: '#E04220'
        },
        slate: {
          // Premium Curated Slate Scale
          50: '#F8FAFC',    // Light background
          100: '#F1F5F9',   // Thin borders
          150: '#E2E8F0',   // Darker borders
          200: '#E2E8F0',
          300: '#CBD5E1',
          405: '#64748B',
          450: '#64748B',
          455: '#64748B',
          500: '#64748B',   // Paragraphs muted
          550: '#475569',   // Secondary text
          600: '#475569',
          700: '#334155',
          800: '#151D30',   // Premium Cosmic Dark card background
          850: '#0F172A',   // Headings light
          900: '#151D30',   // Slide drawers dark background
          950: '#0B0F19'    // Premium Cosmic deep dark background
        }
      }
    }
  },
  darkMode: 'class'
}