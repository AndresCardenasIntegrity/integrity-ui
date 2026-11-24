# Integrity UI/UX — Composables, Utilities, Types & Tokens

## 1. Composables (Auto-imported in Nuxt 4)

### `useIntegrityToast()`
```ts
const { toasts, show, success, error, warning, info, dismiss, clear } = useIntegrityToast()
success('Cambios guardados.', 'Éxito')
error('No se pudo conectar al servidor.', 'Error', 6000)
```

### `useIntegrityConfirm()`
```ts
const { state, confirm, handleConfirm, handleCancel } = useIntegrityConfirm()

const accepted = await confirm({
  type: 'danger', // 'info' | 'warning' | 'danger'
  title: 'Eliminar lote',
  message: 'Esta acción no se puede deshacer.',
  dangerNote: 'Espera el contador de seguridad.',
  confirmDelaySeconds: 3,
  confirmText: 'Sí, eliminar',
  cancelText: 'Cancelar',
})
```

### `useIntegrityTheme()`
Persists light/dark mode in `localStorage` (`integrity-ui:theme`) and toggles `.dark` on `<html>`.
```ts
const { mode, isDark, initTheme, setTheme, toggleTheme } = useIntegrityTheme()
```

### `useIntegritySidebar()`
Manages desktop collapse state (`integrity-ui:sidebar-collapsed`), mobile drawer open state, and the `Ctrl+B` / `Cmd+B` shortcut.
```ts
const { desktopCollapsed, mobileOpen, state, toggleDesktop, toggleMobile, setMobileOpen, ensureHydrated, ensureKeyboardShortcut } = useIntegritySidebar()
```

### `useIntegritySensitive()`
Tracks revealed keys in app state and optionally gates reveal behind `useIntegrityConfirm()`.
```ts
const { isRevealed, display, toggleReveal, clearRevealed } = useIntegritySensitive()
// Also exports standalone helper:
import { maskSensitiveValue } from '@integritysoftwarela/integrity-ui-nuxt/app/composables/useIntegritySensitive'
```

---

## 2. Utilities (Auto-imported in Nuxt 4)

| Module | Exported Functions | Purpose |
|---|---|---|
| `emailList` | `isValidEmail`, `parseEmailList`, `validateEmailList`, `formatEmailList` | Parse/validate/deduplicate `;`/`,`/newline email lists and format back to `; `. |
| `pagination` | `getPaginationBounds`, `computePaginationRange` | Clamp page bounds (`from`, `to`, `totalPages`) and compute ellipsis page ranges. |
| `codeHighlight` | `escapeHtml`, `normalizeCodeContent`, `highlightCode` | Safe HTML escaping, JSON pretty-printing, and syntax highlighting. |
| `markdown` | `parseMarkdownBlocks`, `renderInlineMarkdown` | Split Markdown into sanitized HTML blocks + fenced code blocks for `IntegrityCodeBlock`. |
| `terminalLog` | `stripAnsi`, `ansiToHtml`, `detectLogLevel`, `parseTerminalLogs` | Parse ANSI colors, PM2 process prefixes, timestamps, HTTP statuses, and log severity. |

---

## 3. Shared TypeScript Types

Import from `@integritysoftwarela/integrity-ui-nuxt/app/types/ui`:
- `IntegrityButtonVariant`, `IntegrityButtonSize`
- `IntegrityBadgeTone`, `IntegrityAlertTone`
- `IntegrityToastType`, `IntegrityToastItem`, `IntegrityToastInput`
- `IntegrityConfirmType`, `IntegrityConfirmOptions`, `IntegrityConfirmState`
- `IntegrityNavItem`, `IntegrityNavGroup`
- `IntegrityTableColumn`, `IntegrityTimelineEvent`
- `IntegritySelectOption`, `IntegrityTabItem`, `IntegrityMultiSelectOption`
- `IntegrityEmailListValidation`

---

## 4. Official Tokens (`@integritysoftwarela/integrity-tokens`)

### Exports
- `@integritysoftwarela/integrity-tokens` — `integrityTokens` JS object (dual ESM + CJS) + `.d.ts` types.
- `@integritysoftwarela/integrity-tokens/css` — Tailwind layers, CSS custom properties, scrollbars, and helper classes (`.page-header`, `.page-title`, `.page-subtitle`, `.page-actions`, `.data-table-wrap`, `.form-grid-2`, `.mobile-card`, `.page-size-select`, `.scrollbar-thin`, `.scrollbar-hidden`, `.shadow-subtle`, `.shadow-card`).
- `@integritysoftwarela/integrity-tokens/preset` — Zero-dependency Tailwind CSS preset (dual ESM + CJS).
- `@integritysoftwarela/integrity-tokens/brand/integrity-mark.svg` — Official SVG mark.

### Official Palette
| Token | Light | Dark | Usage |
|---|---|---|---|
| `--color-accent` / `bg-accent` | `#273679` | `#3D4F9C` | Primary actions, active sidebar item, focus ring |
| `--color-accent-hover` | `#1E2B61` | `#4F63B5` | Primary hover state |
| `--color-accent-light` | `#EEF1FA` | `#17214C` | Subtle brand highlight / badges |
| `--color-bg-primary` | `#FFFFFF` | `#0A0A0A` | Cards, modals, drawers |
| `--color-bg-secondary` | `#FAFAFA` | `#141414` | App canvas background |
| `--color-border` | `#E2E8F0` | `#27272A` | Hairline borders (`1px`) |
| `operational` | `#10B981` | `#10B981` | Healthy / success |
| `degraded` | `#F59E0B` | `#F59E0B` | Warning / degraded |
| `down` | `#EF4444` | `#EF4444` | Error / destructive |
| `maintenance` | `#6366F1` | `#6366F1` | Maintenance / in progress |
