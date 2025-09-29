import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          light: 'rgb(199, 195, 187)',
          DEFAULT: 'rgb(199, 195, 187)',
        },
        secondary: {
          light: 'rgb(108, 95, 62)',
          DEFAULT: 'rgb(108, 95, 62)',
          dark: 'rgb(108, 95, 62)',
        },
        accent: {
          purple: 'rgb(125, 29, 191)',
          blue: 'rgb(106, 115, 232)',
          teal: 'rgb(175, 255, 213)',
          orange: 'rgb(232, 163, 106)',
          yellow: 'rgb(232, 213, 106)',
        },
        background: {
          primary: 'rgb(12, 13, 21)',
          card: 'rgba(11, 11, 11, 0.2)',
          overlay: 'rgba(0, 0, 0, 0.5)',
        },
        text: {
          primary: 'rgb(199, 195, 187)',
          secondary: 'rgb(119, 116, 108)',
          muted: 'rgb(119, 116, 108)',
          accent: 'rgb(175, 255, 213)',
        },
      },
      fontFamily: {
        'rubik': ['Rubik', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

export default config