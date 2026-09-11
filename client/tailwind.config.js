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
        navora: {
          bg:       '#0B1120',
          deep:     '#0F172A',
          card:     '#151D30',
          surface:  '#1E293B',
          border:   '#2E3E5B',
          muted:    '#64748B',
          cyan:     '#38BDF8',
          blue:     '#3B82F6',
          violet:   '#818CF8',
          purple:   '#A855F7',
          pink:     '#EC4899',
          amber:    '#F59E0B',
          emerald:  '#10B981',
          slate:    '#94A3B8',
        }
      },
      fontFamily: {
        unbounded: ['"Unbounded"', 'sans-serif'],
        clash:     ['"Clash Display"', '"Outfit"', 'sans-serif'],
        spaceMono: ['"Space Mono"', '"JetBrains Mono"', 'monospace'],
        display:   ['"Clash Display"', '"Outfit"', '"Plus Jakarta Sans"', 'sans-serif'],
        outfit:    ['"Outfit"', 'sans-serif'],
        space:     ['"Space Grotesk"', 'sans-serif'],
        urbanist:  ['"Urbanist"', 'sans-serif'],
        sans:      ['"Space Grotesk"', '"Poppins"', '"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono:      ['"Space Mono"', '"JetBrains Mono"', 'Menlo', 'monospace'],
        poppins:   ['"Poppins"', 'sans-serif'],
      },
      fontSize: {
        'hero':  ['clamp(3.5rem, 9vw, 8rem)', { lineHeight: '0.92', letterSpacing: '-0.02em' }],
        'title': ['clamp(2rem, 5vw, 4rem)', { lineHeight: '1', letterSpacing: '-0.01em' }],
      },
      boxShadow: {
        'glow-cyan':    '0 0 40px -8px rgba(34, 211, 238, 0.5)',
        'glow-violet':  '0 0 40px -8px rgba(124, 58, 237, 0.5)',
        'glow-emerald': '0 0 30px -8px rgba(16, 185, 129, 0.4)',
        'glow-sm':      '0 0 16px -4px rgba(34, 211, 238, 0.4)',
        'card':         '0 1px 0 rgba(255,255,255,0.05), 0 20px 40px -15px rgba(0,0,0,0.7)',
        'card-hover':   '0 1px 0 rgba(255,255,255,0.08), 0 30px 60px -15px rgba(0,0,0,0.8), 0 0 30px -10px rgba(34,211,238,0.15)',
        'inset-top':    'inset 0 1px 0 rgba(255,255,255,0.07)',
      },
      animation: {
        'float':        'float 6s ease-in-out infinite',
        'float-slow':   'float 9s ease-in-out infinite',
        'shimmer':      'shimmer 3s linear infinite',
        'aurora':       'aurora 16s ease-in-out infinite alternate',
        'fade-up':      'fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in':      'fadeIn 0.5s ease forwards',
        'spin-slow':    'spin 20s linear infinite',
        'pulse-glow':   'pulseGlow 3s ease-in-out infinite',
        'slide-right':  'slideRight 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'border-flow':  'borderFlow 4s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-400% 0' },
          '100%': { backgroundPosition: '400% 0' },
        },
        aurora: {
          '0%':   { transform: 'translate(0%,  0%)  scale(1)',    filter: 'blur(80px)' },
          '33%':  { transform: 'translate(8%, -5%)  scale(1.1)',  filter: 'blur(100px)' },
          '66%':  { transform: 'translate(-5%, 8%)  scale(0.95)', filter: 'blur(90px)' },
          '100%': { transform: 'translate(4%, -3%)  scale(1.05)', filter: 'blur(80px)' },
        },
        fadeUp: {
          '0%':   { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: 0 },
          '100%': { opacity: 1 },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 0.7 },
          '50%':      { opacity: 1 },
        },
        slideRight: {
          '0%':   { opacity: 0, transform: 'translateX(-10px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        borderFlow: {
          '0%':   { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
      },
      backgroundImage: {
        'grid-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.025'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}
