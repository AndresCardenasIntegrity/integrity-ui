export type IntegrityButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
export type IntegrityButtonSize = 'sm' | 'md' | 'lg'

export type IntegrityBadgeTone =
  | 'brand'
  | 'operational'
  | 'degraded'
  | 'down'
  | 'maintenance'
  | 'neutral'
  | 'info'

export type IntegrityAlertTone = 'info' | 'success' | 'warning' | 'danger'

export type IntegrityToastType = 'success' | 'error' | 'warning' | 'info'

export interface IntegrityToastItem {
  id: string
  type: IntegrityToastType
  title?: string
  message: string
  duration: number
}

export interface IntegrityToastInput {
  type?: IntegrityToastType
  title?: string
  message: string
  duration?: number
}

export type IntegrityConfirmType = 'info' | 'warning' | 'danger'

export interface IntegrityConfirmOptions {
  title: string
  message: string
  type?: IntegrityConfirmType
  confirmText?: string
  cancelText?: string
  dangerNote?: string
  confirmDelaySeconds?: number
}

export interface IntegrityConfirmState {
  isOpen: boolean
  type: IntegrityConfirmType
  title: string
  message: string
  confirmText: string
  cancelText: string
  dangerNote: string
  confirmDelaySeconds: number
}

export interface IntegrityNavItem {
  label: string
  to: string
  icon: string
  badge?: string
  exact?: boolean
}

export interface IntegrityNavGroup {
  id: string
  label: string
  defaultOpen?: boolean
  items: IntegrityNavItem[]
}

export interface IntegrityTableColumn {
  key: string
  label: string
  type?: 'text' | 'badge' | 'boolean' | 'date' | 'number' | 'mono'
  align?: 'left' | 'center' | 'right'
  map?: Record<string, string>
  tones?: Record<string, IntegrityBadgeTone>
}

export interface IntegrityTimelineEvent {
  at?: string | null
  kind: 'created' | 'modified' | 'email' | 'api' | 'status' | 'warning' | 'error' | string
  title: string
  detail?: string
  source?: string
  http?: number | null
}

export interface IntegritySelectOption {
  label: string
  value: string
  disabled?: boolean
}

export interface IntegrityTabItem {
  value: string
  label: string
  icon?: string
  badge?: string | number
  disabled?: boolean
}

export interface IntegrityMultiSelectOption {
  value: string
  label: string
  description?: string
  meta?: string
  disabled?: boolean
}

export interface IntegrityEmailListValidation {
  valid: string[]
  invalid: string[]
  duplicates: string[]
}
