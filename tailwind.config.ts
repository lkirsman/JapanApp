import type { Config } from 'tailwindcss'

// Japanese-inspired modern palette (research R6): warm paper, sumi ink,
// vermillion (shu-iro) accent, quiet sand rules, muted fog text.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#f8f4ed',
        sumi: '#201d1a',
        shu: '#c5442d',
        sand: '#e8e0d2',
        fog: '#6f6a62',
        moss: '#5c6b52',
      },
      fontFamily: {
        body: ['"Zen Kaku Gothic New"', 'system-ui', 'sans-serif'],
        display: ['"Shippori Mincho"', 'Georgia', 'serif'],
      },
      maxWidth: {
        app: '28rem',
      },
    },
  },
  plugins: [],
} satisfies Config
