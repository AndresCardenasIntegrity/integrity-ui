import { computed, readonly } from 'vue'

export type IntegrityThemeMode = 'light' | 'dark'

const STORAGE_KEY = 'integrity-ui:theme'

export function useIntegrityTheme() {
  const mode = useState<IntegrityThemeMode>('integrity-ui-theme', () => 'light')
  const hydrated = useState<boolean>('integrity-ui-theme-hydrated', () => false)

  function applyDom(next: IntegrityThemeMode) {
    if (!import.meta.client) return
    const root = document.documentElement
    root.classList.toggle('dark', next === 'dark')
    root.style.colorScheme = next
  }

  function initTheme() {
    if (!import.meta.client || hydrated.value) return
    hydrated.value = true
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY)
      if (saved === 'light' || saved === 'dark') {
        mode.value = saved
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        mode.value = 'dark'
      }
    } catch {
      // ignore storage access issues
    }
    applyDom(mode.value)
  }

  function setTheme(next: IntegrityThemeMode) {
    mode.value = next
    applyDom(next)
    if (import.meta.client) {
      try {
        window.localStorage.setItem(STORAGE_KEY, next)
      } catch {
        // ignore storage write issues
      }
    }
  }

  function toggleTheme() {
    setTheme(mode.value === 'dark' ? 'light' : 'dark')
  }

  const isDark = computed(() => mode.value === 'dark')

  return {
    mode: readonly(mode),
    isDark,
    initTheme,
    setTheme,
    toggleTheme,
  }
}
