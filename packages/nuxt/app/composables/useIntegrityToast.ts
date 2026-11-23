import { readonly } from 'vue'
import type { IntegrityToastInput, IntegrityToastItem } from '../types/ui'

let seq = 0

export function useIntegrityToast() {
  const toasts = useState<IntegrityToastItem[]>('integrity-ui-toasts', () => [])

  function dismiss(id: string) {
    toasts.value = toasts.value.filter(item => item.id !== id)
  }

  function show(input: IntegrityToastInput): string {
    const id = `toast-${Date.now()}-${++seq}`
    const duration = input.duration ?? 4500
    const item: IntegrityToastItem = {
      id,
      type: input.type ?? 'info',
      title: input.title,
      message: input.message,
      duration,
    }
    toasts.value = [...toasts.value, item]

    if (import.meta.client && duration > 0) {
      window.setTimeout(() => dismiss(id), duration)
    }
    return id
  }

  function success(message: string, title?: string, duration?: number) {
    return show({ type: 'success', title, message, duration })
  }

  function error(message: string, title?: string, duration?: number) {
    return show({ type: 'error', title, message, duration: duration ?? 6000 })
  }

  function warning(message: string, title?: string, duration?: number) {
    return show({ type: 'warning', title, message, duration })
  }

  function info(message: string, title?: string, duration?: number) {
    return show({ type: 'info', title, message, duration })
  }

  function clear() {
    toasts.value = []
  }

  return {
    toasts: readonly(toasts),
    show,
    success,
    error,
    warning,
    info,
    dismiss,
    clear,
  }
}
