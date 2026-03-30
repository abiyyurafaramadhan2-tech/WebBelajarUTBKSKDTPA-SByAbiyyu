import type { Config } from "tailwindcss";

const config: Config = {
  // Bagian ini yang paling krusial!
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // Ini akan men-scan SEMUA file di dalam folder src
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // Jaga-jaga kalau kamu pakai struktur tanpa src
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Biarkan kosong dulu biar gak ada yang bentrok
    },
  },
  plugins: [],
};
export default config;
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #461A42 0%, #1A142E 50%, #0D0A1A 100%)',
        'gradient-neon':  'linear-gradient(135deg, #C77DFF 0%, #48CAE4 100%)',
        'gradient-card':  'linear-gradient(145deg, rgba(155,77,255,0.1), rgba(72,202,228,0.05))',
        'grid-pattern':   "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236B2D66' fill-opacity='0.08'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
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
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 50%, 90%': { transform: 'translateX(-8px)' },
          '30%, 70%': { transform: 'translateX(8px)' },
        },
        'neon-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(199,125,255,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(199,125,255,0.8), 0 0 80px rgba(199,125,255,0.4)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'glow-rotate': {
          '0%': { filter: 'hue-rotate(0deg)' },
          '100%': { filter: 'hue-rotate(360deg)' },
        },
      },
      animation: {
        'shake':        'shake 0.5s cubic-bezier(.36,.07,.19,.97)',
        'neon-pulse':   'neon-pulse 2s ease-in-out infinite',
        'float':        'float 3s ease-in-out infinite',
        'scale-in':     'scale-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'slide-up':     'slide-up 0.4s ease-out',
        'glow-rotate':  'glow-rotate 4s linear infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
