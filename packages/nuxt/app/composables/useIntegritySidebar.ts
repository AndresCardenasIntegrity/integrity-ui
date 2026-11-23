import { computed, readonly } from 'vue'

const STORAGE_KEY = 'integrity-ui:sidebar-collapsed'
let shortcutBound = false

export function useIntegritySidebar() {
  const desktopCollapsed = useState<boolean>('integrity-ui-sidebar-collapsed', () => false)
  const mobileOpen = useState<boolean>('integrity-ui-sidebar-mobile-open', () => false)
  const hydrated = useState<boolean>('integrity-ui-sidebar-hydrated', () => false)

  const state = computed<'expanded' | 'collapsed'>(() =>
    desktopCollapsed.value ? 'collapsed' : 'expanded',
  )

  function persist(value: boolean) {
    if (!import.meta.client) return
    try {
      window.localStorage.setItem(STORAGE_KEY, value ? '1' : '0')
    } catch {
      // ignore storage failures
    }
  }

  function ensureHydrated() {
    if (!import.meta.client || hydrated.value) return
    hydrated.value = true
    try {
      desktopCollapsed.value = window.localStorage.getItem(STORAGE_KEY) === '1'
    } catch {
      desktopCollapsed.value = false
    }
  }

  function toggleDesktop() {
    desktopCollapsed.value = !desktopCollapsed.value
    persist(desktopCollapsed.value)
  }

  function toggleMobile() {
    mobileOpen.value = !mobileOpen.value
  }

  function setMobileOpen(open: boolean) {
    mobileOpen.value = open
  }

  function ensureKeyboardShortcut() {
    if (!import.meta.client || shortcutBound) return
    shortcutBound = true
    window.addEventListener('keydown', (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'b') {
        const tag = (event.target as HTMLElement | null)?.tagName
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
        event.preventDefault()
        if (window.innerWidth >= 1024) {
          toggleDesktop()
        } else {
          toggleMobile()
        }
      }
    })
  }

  return {
    desktopCollapsed: readonly(desktopCollapsed),
    mobileOpen: readonly(mobileOpen),
    state,
    toggleDesktop,
    toggleMobile,
    setMobileOpen,
    ensureHydrated,
    ensureKeyboardShortcut,
  }
}
