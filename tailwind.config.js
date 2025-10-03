/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        'open-sans': ['Open Sans', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
        body: ['Open Sans', 'sans-serif'],
      },
      colors: {
        // Màu xanh lá cây đậm làm màu chính
        primary: {
          50: '#f0fff4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#006400', // Màu xanh lá cây đậm chính
          700: '#005200',
          800: '#004000',
          900: '#003000',
        },
        // Màu đen và xám
        dark: {
          primary: '#111111',  // Màu đen cho tiêu đề chính
          secondary: '#374151', // Xám đậm
        },
        gray: {
          light: '#6B7280',    // Xám nhạt cho mô tả
          medium: '#9CA3AF',
          border: '#E5E7EB',
        },
        // Giữ lại một số màu phụ cần thiết
        secondary: '#f7f7f7',
        accent: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #006400 0%, #005200 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #22c55e 0%, #006400 50%, #005200 100%)',
        'gradient-hero': 'linear-gradient(135deg, #f0fff4 0%, #dcfce7 50%, #bbf7d0 100%)',
        'gradient-card': 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-out': 'slideOut 0.3s ease-in',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(-8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(0)' },
        },
        slideOut: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-100%)' },
        },
      },
    },
  },
  plugins: [],
}