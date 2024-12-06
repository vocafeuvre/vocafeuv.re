/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#ffd9fa',
          100: '#ffccf9',
          200: '#ffbff7',
          300: '#ff99f3',
          400: '#ff4de9',
          500: '#FF00E0',
          600: '#e600ca',
          700: '#bf00a8',
          800: '#990086',
          900: '#7d006e',
        },
        secondary: {
          50: '#d9fffb',
          100: '#ccfffa',
          200: '#bffff8',
          300: '#99fff4',
          400: '#4dffec',
          500: '#00FFE4',
          600: '#00e6cd',
          700: '#00bfab',
          800: '#009989',
          900: '#007d70',
        },
        tertiary: {
          50: '#ffe9d9',
          100: '#ffe2cc',
          200: '#ffdabf',
          300: '#ffc499',
          400: '#ff984d',
          500: '#FF6C00',
          600: '#e66100',
          700: '#bf5100',
          800: '#994100',
          900: '#7d3500',
        },
        success: {
          50: '#edf7dc',
          100: '#e6f5d0',
          200: '#e0f2c5',
          300: '#ceeba2',
          400: '#a9db5c',
          500: '#84cc16',
          600: '#77b814',
          700: '#639911',
          800: '#4f7a0d',
          900: '#41640b',
        },
        warning: {
          50: '#fffad9',
          100: '#fff8cc',
          200: '#fff6bf',
          300: '#fff199',
          400: '#ffe64d',
          500: '#FFDB00',
          600: '#e6c500',
          700: '#bfa400',
          800: '#998300',
          900: '#7d6b00',
        },
        error: {
          50: '#f9ddea',
          100: '#f6d1e4',
          200: '#f4c6dd',
          300: '#eea3c8',
          400: '#e15e9f',
          500: '#D41976',
          600: '#bf176a',
          700: '#9f1359',
          800: '#7f0f47',
          900: '#680c3a',
        },
        surface: {
          50: '#e4e6ee',
          100: '#dbdee9',
          200: '#d2d6e3',
          300: '#b6bdd2',
          400: '#808cb1',
          500: '#495a8f',
          600: '#425181',
          700: '#37446b',
          800: '#2c3656',
          900: '#242c46',
        },
      },
      fontFamily: {
        'sans': ['Open Sans', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        'courier': ['Courier Prime', 'ui-monospace', 'monospace'],
        'doto': ['Doto', 'sans-serif'],
        'play': ['Play', 'sans-serif'],
        'rubik': ['Rubik', 'sans-serif'],
      },
      height: {
        '25': '6.25rem',
        '26': '6.5rem',
        '27': '6.75rem',
      },
      minHeight: {
        '25': '6.25rem',
        '26': '6.5rem',
        '27': '6.75rem',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.fire-gradient-text': {
          'box-decoration-clone': 'clone',
          'background-clip': 'text',
          '-webkit-background-clip': 'text',
          'color': 'transparent',
          'background-image': 'linear-gradient(to right, #ff00e0, #FF6C00)',
        },
        '.ocean-gradient-text': {
          'box-decoration-clone': 'clone',
          'background-clip': 'text',
          '-webkit-background-clip': 'text',
          'color': 'transparent',
          'background-image': 'linear-gradient(to right, #ff00e0, #00ffe4)',
        },
      })
    },
  ],
  darkMode: ['class', '.darkmode'],
}
