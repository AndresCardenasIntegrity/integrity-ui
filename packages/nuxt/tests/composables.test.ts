import { beforeEach, describe, expect, it } from 'vitest'
import { installNuxtTestGlobals, resetNuxtState } from './setup'
import { useIntegrityConfirm } from '../app/composables/useIntegrityConfirm'
import { maskSensitiveValue, useIntegritySensitive } from '../app/composables/useIntegritySensitive'
import { useIntegritySidebar } from '../app/composables/useIntegritySidebar'
import { useIntegrityTheme } from '../app/composables/useIntegrityTheme'
import { useIntegrityToast } from '../app/composables/useIntegrityToast'

installNuxtTestGlobals()

describe('Integrity UI composables', () => {
  beforeEach(() => {
    resetNuxtState()
  })

  describe('useIntegrityToast', () => {
    it('adds, dismisses and clears toast notifications with expected defaults', () => {
      const toast = useIntegrityToast()
      const id1 = toast.success('Guardado', 'OK')
      const id2 = toast.error('Falló la conexión')

      expect(toast.toasts.value).toHaveLength(2)
      expect(toast.toasts.value[0]).toMatchObject({
        id: id1,
        type: 'success',
        title: 'OK',
        message: 'Guardado',
        duration: 4500,
      })
      expect(toast.toasts.value[1]).toMatchObject({
        id: id2,
        type: 'error',
        duration: 6000,
      })

      toast.dismiss(id1)
      expect(toast.toasts.value).toHaveLength(1)

      toast.clear()
      expect(toast.toasts.value).toHaveLength(0)
    })
  })

  describe('useIntegrityConfirm', () => {
    it('resolves true on confirm and false on cancel', async () => {
      const dialog = useIntegrityConfirm()

      const p1 = dialog.confirm({ title: 'Confirmar', message: '¿Continuar?' })
      expect(dialog.state.value.isOpen).toBe(true)
      dialog.handleConfirm()
      await expect(p1).resolves.toBe(true)
      expect(dialog.state.value.isOpen).toBe(false)

      const p2 = dialog.confirm({
        type: 'danger',
        title: 'Eliminar',
        message: 'Acción irreversible',
        confirmDelaySeconds: 3,
      })
      expect(dialog.state.value.confirmDelaySeconds).toBe(3)
      dialog.handleCancel()
      await expect(p2).resolves.toBe(false)
    })

    it('cancels a previous pending confirmation when another opens', async () => {
      const dialog = useIntegrityConfirm()
      const first = dialog.confirm({ title: 'Primero', message: 'M1' })
      const second = dialog.confirm({ title: 'Segundo', message: 'M2' })

      await expect(first).resolves.toBe(false)
      expect(dialog.state.value.title).toBe('Segundo')

      dialog.handleConfirm()
      await expect(second).resolves.toBe(true)
    })
  })

  describe('useIntegritySensitive & maskSensitiveValue', () => {
    it('masks sensitive strings keeping visible tail', () => {
      expect(maskSensitiveValue('012180015928374612', 4)).toBe('••••••••4612')
      expect(maskSensitiveValue('1234', 4)).toBe('••••')
      expect(maskSensitiveValue(null)).toBe('—')
      expect(maskSensitiveValue('')).toBe('—')
    })

    it('toggles revealed state directly and via confirmation gate', async () => {
      const sensitive = useIntegritySensitive()
      const confirmDialog = useIntegrityConfirm()

      expect(sensitive.display('clabe-1', '012180015928374612')).toBe('••••••••4612')

      await sensitive.toggleReveal('clabe-1')
      expect(sensitive.isRevealed('clabe-1')).toBe(true)
      expect(sensitive.display('clabe-1', '012180015928374612')).toBe('012180015928374612')

      // Toggle back to masked
      await sensitive.toggleReveal('clabe-1')
      expect(sensitive.isRevealed('clabe-1')).toBe(false)

      // Require confirmation -> cancelled
      const deniedPromise = sensitive.toggleReveal('clabe-2', { requireConfirm: true, label: 'CLABE' })
      confirmDialog.handleCancel()
      await expect(deniedPromise).resolves.toBe(false)
      expect(sensitive.isRevealed('clabe-2')).toBe(false)

      // Require confirmation -> accepted
      const approvedPromise = sensitive.toggleReveal('clabe-2', { requireConfirm: true, label: 'CLABE' })
      confirmDialog.handleConfirm()
      await expect(approvedPromise).resolves.toBe(true)
      expect(sensitive.isRevealed('clabe-2')).toBe(true)

      sensitive.clearRevealed()
      expect(sensitive.isRevealed('clabe-2')).toBe(false)
    })
  })

  describe('useIntegrityTheme', () => {
    it('toggles between light and dark modes', () => {
      const theme = useIntegrityTheme()
      expect(theme.mode.value).toBe('light')
      expect(theme.isDark.value).toBe(false)

      theme.toggleTheme()
      expect(theme.mode.value).toBe('dark')
      expect(theme.isDark.value).toBe(true)

      theme.setTheme('light')
      expect(theme.isDark.value).toBe(false)
    })
  })

  describe('useIntegritySidebar', () => {
    it('tracks desktop collapsed state and mobile drawer visibility', () => {
      const sidebar = useIntegritySidebar()
      expect(sidebar.state.value).toBe('expanded')
      expect(sidebar.mobileOpen.value).toBe(false)

      sidebar.toggleDesktop()
      expect(sidebar.desktopCollapsed.value).toBe(true)
      expect(sidebar.state.value).toBe('collapsed')

      sidebar.setMobileOpen(true)
      expect(sidebar.mobileOpen.value).toBe(true)
      sidebar.toggleMobile()
      expect(sidebar.mobileOpen.value).toBe(false)
    })
  })
})
