const integrityTailwindPreset = require('@andrescardenasintegrity/integrity-tokens/preset')

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...integrityTailwindPreset,
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
