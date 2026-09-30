/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // === YENİ TASARIM SİSTEMİ ===
        // Ana arka plan — sıcak krem (Sui Overflow ref'inden)
        paper:   '#F5F0E8',
        'paper-2': '#EDE7DA',
        // Yüzeyler
        surface: '#FFFFFF',
        // Ana metin
        ink:     '#111111',
        'ink-2': '#444444',
        mist:    '#888888',
        // Marka rengi — cesur elektrik moru
        brand:        '#5B4FE9',
        'brand-dark': '#3D34C7',
        'brand-light':'#EAE8FF',
        // Aksanlar (kasıtlı, minimum 5 renk)
        accent: {
          orange: '#FF5733',
          amber:  '#FFB800',
          mint:   '#00C896',
          coral:  '#FF3864',
          blue:   '#3B82F6',
        },
        // Kategori renkleri (oyun listesi için)
        cat: {
          memory:   '#5B4FE9',
          speed:    '#FF5733',
          attention:'#00C896',
          problem:  '#FFB800',
          language: '#FF3864',
          flex:     '#1A1A1A',
        },
        // Oyun içi kullanım (eski neo renkler — oyunlar için tutuldu)
        'neo-green':  '#4ade80',
        'neo-yellow': '#facc15',
        'neo-red':    '#f87171',
        'neo-blue':   '#93c5fd',
        'neo-purple': '#c4b5fd',
        'neo-orange': '#fdba74',
        'neo-pink':   '#f9a8d4',
        'neo-bg':     '#F5F0E8',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        // Yeni temiz gölgeler (daha ince, daha rafine)
        'card':   '0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)',
        'card-hover': '0 4px 24px rgba(0,0,0,0.12)',
        'button': '0 2px 8px rgba(0,0,0,0.15)',
        // Oyun içi brutal gölgeler (tutuldu)
        'brutal-sm': '2px 2px 0px 0px #000000',
        'brutal':    '4px 4px 0px 0px #000000',
        'brutal-lg': '6px 6px 0px 0px #000000',
        'brutal-xl': '8px 8px 0px 0px #000000',
      },
      backgroundImage: {
        // Dot grid desen (Sui Overflow referansı)
        'dot-grid': 'radial-gradient(circle, #C5BDB0 1px, transparent 1px)',
      },
      backgroundSize: {
        'dot-grid': '28px 28px',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease forwards',
        'scale-in': 'scaleIn 0.3s ease forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(16px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: 0, transform: 'scale(0.95)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
