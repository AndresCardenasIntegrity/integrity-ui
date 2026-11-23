import { createRequire } from 'node:module'
import { integrityTailwindPreset } from '@andrescardenasintegrity/integrity-tokens/preset'

const require = createRequire(import.meta.url)

/** @type {import('tailwindcss').Config} */
export default {
  ...integrityTailwindPreset,
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
