import type { IntegrityEmailListValidation } from '../types/ui'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function isValidEmail(raw: string): boolean {
  const value = raw.trim()
  if (!value || value.length > 254) return false
  return EMAIL_REGEX.test(value)
}

export function parseEmailList(raw: string): string[] {
  if (!raw) return []
  return raw
    .split(/[;,\s]+/)
    .map(token => token.trim())
    .filter(Boolean)
}

export function validateEmailList(entries: string[]): IntegrityEmailListValidation {
  const seen = new Set<string>()
  const valid: string[] = []
  const invalid: string[] = []
  const duplicates: string[] = []

  for (const rawEntry of entries) {
    const cleaned = rawEntry.trim()
    if (!cleaned) continue

    if (!isValidEmail(cleaned)) {
      invalid.push(cleaned)
      continue
    }

    const normalized = cleaned.toLowerCase()
    if (seen.has(normalized)) {
      duplicates.push(normalized)
      continue
    }

    seen.add(normalized)
    valid.push(normalized)
  }

  return { valid, invalid, duplicates }
}

export function formatEmailList(emails: string[], separator = '; '): string {
  const { valid } = validateEmailList(emails)
  return valid.join(separator)
}
