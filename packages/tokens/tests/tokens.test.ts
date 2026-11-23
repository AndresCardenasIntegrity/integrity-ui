import { describe, expect, it } from 'vitest'
import { integrityTokens } from '../index.js'
import { integrityTailwindPreset } from '../tailwind.preset.js'

describe('@andrescardenasintegrity/integrity-tokens', () => {
  it('exposes official Integrity brand accent tokens for light and dark modes', () => {
    expect(integrityTokens.accent.DEFAULT.toLowerCase()).toBe('#273679')
    expect(integrityTokens.accent.dark.toLowerCase()).toBe('#3d4f9c')
    expect(integrityTokens.brand['600'].toLowerCase()).toBe('#273679')
    expect(integrityTokens.brand['500'].toLowerCase()).toBe('#3d4f9c')
  })

  it('exposes semantic status colors and typography stacks', () => {
    expect(integrityTokens.status).toEqual({
      operational: '#10B981',
      degraded: '#F59E0B',
      down: '#EF4444',
      maintenance: '#6366F1',
    })
    expect(integrityTokens.typography.sans[0]).toBe('Inter')
    expect(integrityTokens.typography.mono[0]).toBe('JetBrains Mono')
  })

  it('provides a framework-agnostic Tailwind preset with class darkMode', () => {
    expect(integrityTailwindPreset.darkMode).toBe('class')
    expect(integrityTailwindPreset.theme.extend.colors.accent.DEFAULT).toBe('var(--color-accent)')
  })
})
