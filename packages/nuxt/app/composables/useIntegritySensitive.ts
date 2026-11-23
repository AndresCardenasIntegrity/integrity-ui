export function maskSensitiveValue(value: string | number | null | undefined, visibleTail = 4): string {
  if (value == null || value === '') return '—'
  const raw = String(value)
  if (raw.length <= visibleTail) return '•'.repeat(Math.max(4, raw.length))
  return `${'•'.repeat(Math.min(8, raw.length - visibleTail))}${raw.slice(-visibleTail)}`
}

export function useIntegritySensitive() {
  const revealedKeys = useState<Record<string, boolean>>('integrity-ui-sensitive-keys', () => ({}))
  const { confirm } = useIntegrityConfirm()

  function isRevealed(key: string): boolean {
    return Boolean(revealedKeys.value[key])
  }

  function display(key: string, value: string | number | null | undefined, visibleTail = 4): string {
    if (value == null || value === '') return '—'
    return isRevealed(key) ? String(value) : maskSensitiveValue(value, visibleTail)
  }

  async function toggleReveal(
    key: string,
    options?: { label?: string; requireConfirm?: boolean; title?: string; message?: string },
  ) {
    if (isRevealed(key)) {
      const next = { ...revealedKeys.value }
      delete next[key]
      revealedKeys.value = next
      return false
    }

    if (options?.requireConfirm) {
      const ok = await confirm({
        type: 'warning',
        title: options.title ?? 'Revelar dato sensible',
        message: options.message ?? `¿Deseas mostrar temporalmente este ${options.label ?? 'dato sensible'}?`,
        confirmText: 'Revelar',
      })
      if (!ok) return false
    }

    revealedKeys.value = { ...revealedKeys.value, [key]: true }
    return true
  }

  function clearRevealed() {
    revealedKeys.value = {}
  }

  return {
    isRevealed,
    display,
    toggleReveal,
    clearRevealed,
  }
}
