import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx,js,jsx,html}', './index.html'],
  theme: {
    extend: {
      colors: {
        'bg':              '#0A0F1A',
        'bg-dark':         '#060B14',
        'bg2':             '#111827',
        'brand-primary':   '#00D4FF',
        'brand-secondary': '#00FF87',
        'accent':          '#00D4FF',
        'ink':             '#E8EAED',
        'muted':           '#6B7280',
        'warning':         '#F59E0B',
        'danger':          '#EF4444',
        zinc: {
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        sans:    ['DM Sans', 'sans-serif'],
      },
      boxShadow: {
        'glow':        '0 0 30px rgba(0,212,255,0.3)',
        'glow-strong': '0 0 60px rgba(0,212,255,0.5), 0 0 120px rgba(0,212,255,0.15)',
        'glass':       '0 8px 32px rgba(0,0,0,0.5)',
      },
      animation: {
        marquee: 'marquee 25s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%':   { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
