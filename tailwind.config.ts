import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#16213A',
        inkmuted: '#666F80',
        paper: '#F7F7F4',
        paperline: '#E7E4DC',
        gold: '#C89B3C',
        money: '#1F7A5C',
        spend: '#B3463D',
        inkdark: '#0D1526',
        surfacedark: '#1B2740',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(22,33,58,0.04), 0 4px 16px rgba(22,33,58,0.06)',
      },
    },
  },
  plugins: [],
}
export default config
