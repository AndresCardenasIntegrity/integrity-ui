import { readonly } from 'vue'
import type { IntegrityConfirmOptions, IntegrityConfirmState } from '../types/ui'

let pendingResolve: ((value: boolean) => void) | null = null

export function useIntegrityConfirm() {
  const state = useState<IntegrityConfirmState>('integrity-ui-confirm', () => ({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    dangerNote: '',
    confirmDelaySeconds: 0,
  }))

  function confirm(options: IntegrityConfirmOptions): Promise<boolean> {
    if (pendingResolve) {
      pendingResolve(false)
      pendingResolve = null
    }

    state.value = {
      isOpen: true,
      type: options.type ?? 'info',
      title: options.title,
      message: options.message,
      confirmText: options.confirmText ?? 'Confirmar',
      cancelText: options.cancelText ?? 'Cancelar',
      dangerNote: options.dangerNote ?? '',
      confirmDelaySeconds: options.confirmDelaySeconds ?? 0,
    }

    return new Promise<boolean>((resolve) => {
      pendingResolve = resolve
    })
  }

  function finish(accepted: boolean) {
    state.value = { ...state.value, isOpen: false }
    if (pendingResolve) {
      const resolve = pendingResolve
      pendingResolve = null
      resolve(accepted)
    }
  }

  return {
    state: readonly(state),
    confirm,
    handleConfirm: () => finish(true),
    handleCancel: () => finish(false),
  }
}
