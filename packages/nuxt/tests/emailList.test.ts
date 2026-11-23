import { describe, expect, it } from 'vitest'
import {
  formatEmailList,
  isValidEmail,
  parseEmailList,
  validateEmailList,
} from '../app/utils/emailList'

describe('emailList utilities', () => {
  it('validates standard email addresses and rejects malformed inputs', () => {
    expect(isValidEmail('andres.cardenas@integrity-la.com')).toBe(true)
    expect(isValidEmail('  ops+alerts@sub.domain.mx  ')).toBe(true)
    expect(isValidEmail('')).toBe(false)
    expect(isValidEmail('sin-arroba.com')).toBe(false)
    expect(isValidEmail('user@domain')).toBe(false)
    expect(isValidEmail('bad space@integrity-la.com')).toBe(false)
  })

  it('parses semicolon, comma, space and newline delimited strings', () => {
    const raw = 'uno@integrity-la.com; dos@integrity-la.com,\ntres@integrity-la.com   cuatro@integrity-la.com'
    expect(parseEmailList(raw)).toEqual([
      'uno@integrity-la.com',
      'dos@integrity-la.com',
      'tres@integrity-la.com',
      'cuatro@integrity-la.com',
    ])
    expect(parseEmailList('')).toEqual([])
  })

  it('separates valid, duplicate (case-insensitive) and invalid emails', () => {
    const result = validateEmailList([
      'Ops@Integrity-LA.com',
      'ops@integrity-la.com',
      'dev@integrity-la.com',
      'invalido',
      '',
    ])
    expect(result).toEqual({
      valid: ['ops@integrity-la.com', 'dev@integrity-la.com'],
      invalid: ['invalido'],
      duplicates: ['ops@integrity-la.com'],
    })
  })

  it('formats unique valid emails using semicolon separator by default', () => {
    expect(formatEmailList(['A@test.com', 'a@test.com', 'b@test.com', 'bad'])).toBe(
      'a@test.com; b@test.com',
    )
    expect(formatEmailList(['a@test.com', 'b@test.com'], ', ')).toBe('a@test.com, b@test.com')
  })
})
