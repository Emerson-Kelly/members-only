/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './views/**/*.ejs',
    './public/**/*.js',
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: true, // enables all DaisyUI themes
  }
}
