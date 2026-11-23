import { ref, type Ref } from 'vue'
import { useIntegrityConfirm } from '../app/composables/useIntegrityConfirm'

const store = new Map<string, Ref<unknown>>()

export function resetNuxtState() {
  store.clear()
}

export function installNuxtTestGlobals() {
  ;(globalThis as Record<string, unknown>).useState = <T>(key: string, init?: () => T): Ref<T> => {
    if (!store.has(key)) {
      store.set(key, ref(init ? init() : undefined))
    }
    return store.get(key) as Ref<T>
  }
  ;(globalThis as Record<string, unknown>).useIntegrityConfirm = useIntegrityConfirm
}
