import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['var(--font-fredoka)', ...fontFamily.sans],
        fredoka: ['var(--font-fredoka)', ...fontFamily.sans],
      },
      colors: {
        brand: {
          purple:        '#461A42',
          'purple-mid':  '#6B2D66',
          'purple-light':'#9D4EDD',
          neon:          '#C77DFF',
          'neon-blue':   '#48CAE4',
          'neon-green':  '#39FF14',
          'neon-pink':   '#FF006E',
          'neon-yellow': '#FFD60A',
          'neon-orange': '#FF6B35',
        },
        surface: {
          900: '#0D0A1A',
          800: '#130F24',
          700: '#1A142E',
          600: '#231A3E',
          500: '#2D2250',
        },
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #461A42 0%, #1A142E 50%, #0D0A1A 100%)',
        'gradient-neon':  'linear-gradient(135deg, #C77DFF 0%, #48CAE4 100%)',
        'gradient-card':  'linear-gradient(145deg, rgba(155,77,255,0.1), rgba(72,202,228,0.05))',
      },
      boxShadow: {
        'neon-purple': '0 0 20px rgba(199,125,255,0.5), 0 0 40px rgba(199,125,255,0.2)',
        'neon-blue':   '0 0 20px rgba(72,202,228,0.5), 0 0 40px rgba(72,202,228,0.2)',
        'neon-green':  '0 0 20px rgba(57,255,20,0.5), 0 0 40px rgba(57,255,20,0.2)',
        'neon-pink':   '0 0 20px rgba(255,0,110,0.5), 0 0 40px rgba(255,0,110,0.2)',
        'card':        '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
      },
      keyframes: {
        shake: {
          '0%, 100%':       { transform: 'translateX(0)' },
          '10%, 50%, 90%':  { transform: 'translateX(-8px)' },
          '30%, 70%':       { transform: 'translateX(8px)' },
        },
        'neon-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(199,125,255,0.3)' },
          '50%':      { boxShadow: '0 0 40px rgba(199,125,255,0.8), 0 0 80px rgba(199,125,255,0.4)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        'scale-in': {
          '0%':   { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)',   opacity: '1' },
        },
        'slide-up': {
          '0%':   { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
      },
      animation: {
        'shake':      'shake 0.5s cubic-bezier(.36,.07,.19,.97)',
        'neon-pulse': 'neon-pulse 2s ease-in-out infinite',
        'float':      'float 3s ease-in-out infinite',
        'scale-in':   'scale-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'slide-up':   'slide-up 0.4s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
