/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // 明法众联 2.0：克制、可信的公共服务 / 政企产品色系
        brand: {
          deep: '#741313',
          DEFAULT: '#9B1C1C',
          accent: '#B42323',
        },
        gold: {
          DEFAULT: '#EEF0F3',
          deep: '#6B7280',
        },
        cream: {
          DEFAULT: '#F3F5F7',
          soft: '#F8F9FA',
        },
        ink: {
          DEFAULT: '#172033',
          soft: '#667085',
        },
        line: '#DCE1E7',
        success: '#16815D',
        warning: '#B26A00',
      },
      fontFamily: {
        serif: ['"Noto Sans SC"', '"Microsoft YaHei"', '"PingFang SC"', 'system-ui', 'sans-serif'],
        sans: [
          '"Noto Sans SC"',
          '"Source Han Sans SC"',
          '"Microsoft YaHei"',
          '"PingFang SC"',
          'system-ui',
          'sans-serif',
        ],
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,24,40,0.04), 0 4px 14px -8px rgba(16,24,40,0.18)',
        panel: '0 12px 32px -18px rgba(16,24,40,0.28)',
      },
      borderRadius: {
        xl2: '0.5rem',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.9)', opacity: '0.7' },
          '70%': { transform: 'scale(1.35)', opacity: '0' },
          '100%': { transform: 'scale(1.35)', opacity: '0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.45s ease-out both',
        'fade-in': 'fade-in 0.3s ease-out both',
        'pulse-ring': 'pulse-ring 1.4s ease-out infinite',
      },
    },
  },
  plugins: [],
}
