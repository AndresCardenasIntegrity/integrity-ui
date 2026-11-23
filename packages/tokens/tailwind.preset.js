import { integrityTokens } from './index.js'

/** @type {import('tailwindcss').Config} */
export const integrityTailwindPreset = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: integrityTokens.brand,
        operational: integrityTokens.status.operational,
        degraded: integrityTokens.status.degraded,
        down: integrityTokens.status.down,
        maintenance: integrityTokens.status.maintenance,
        accent: {
          DEFAULT: 'var(--color-accent)',
          hover: 'var(--color-accent-hover)',
          light: 'var(--color-accent-light)',
        },
      },
      fontFamily: {
        sans: integrityTokens.typography.sans,
        mono: integrityTokens.typography.mono,
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.02em' }],
        sm: ['0.875rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
        base: ['1rem', { lineHeight: '1.5' }],
        lg: ['1.125rem', { lineHeight: '1.5' }],
        xl: ['1.25rem', { lineHeight: '1.4' }],
        '2xl': ['1.5rem', { lineHeight: '1.3' }],
        '3xl': ['1.875rem', { lineHeight: '1.2' }],
        '4xl': ['2.25rem', { lineHeight: '1.1' }],
      },
      spacing: {
        18: '4.5rem',
        112: '28rem',
        128: '32rem',
      },
      borderRadius: {
        sm: integrityTokens.radii.sm,
        DEFAULT: integrityTokens.radii.DEFAULT,
        lg: integrityTokens.radii.lg,
        xl: integrityTokens.radii.xl,
      },
      boxShadow: {
        subtle: 'var(--shadow-sm)',
        card: 'var(--shadow-md)',
        elevated: 'var(--shadow-lg)',
      },
    },
  },
}

export default integrityTailwindPreset
