# Integrity UI/UX — Component Reference (32 Components)

All components are auto-imported by Nuxt 4 when extending `@integritysoftwarela/integrity-ui-nuxt`. Import TypeScript interfaces from `@integritysoftwarela/integrity-ui-nuxt/app/types/ui`.

---

## Layout & Brand

### `IntegrityAppShell`
Main administrative layout combining `IntegritySidebar` and a responsive padded content area.
- **Props:** `brandName?: string`, `brandSubtitle?: string`, `navGroups: IntegrityNavGroup[]` (required), `showThemeToggle?: boolean` (`true`), `maxWidth?: '4xl' | '7xl' | 'full'` (`'7xl'`), `padded?: boolean` (`true`), `scrollable?: boolean` (`true`), `contentClass?: string`.
- **Slots:** `default`, `sidebar-header` (`{ collapsed }`), `sidebar-footer` (`{ collapsed }`), `mobile-actions`.

### `IntegritySidebar`
Collapsible sidebar (`16rem` expanded / `3.5rem` collapsed, `Ctrl+B` / `Cmd+B` shortcut, mobile drawer + top bar). Normally rendered by `IntegrityAppShell`.
- **Props:** `brandName?: string`, `brandSubtitle?: string`, `navGroups: IntegrityNavGroup[]`, `showThemeToggle?: boolean`.

### `IntegrityPageHeader`
Standard page title bar with eyebrow, title, subtitle, and right-aligned actions.
- **Props:** `title: string` (required), `subtitle?: string`, `eyebrow?: string`.
- **Slots:** `actions`.

### `IntegrityCard`
Surface container with optional header, actions, and footer.
- **Props:** `title?: string`, `subtitle?: string`, `padding?: 'none' | 'sm' | 'md' | 'lg'` (`'md'`), `hoverable?: boolean` (`false`).
- **Slots:** `default`, `header`, `actions`, `footer`.

### `IntegrityMark`
Geometric Integrity SVG isotipo inheriting `currentColor` (`class="h-6 w-6 text-accent"`).

### `IntegrityAgentIcon`
Official branded AI assistant emblem (`bg-accent` with `IntegrityMark`, optional `AI` watermark badge for floating action buttons, and emerald online pulse dot).
- **Props:** `variant?: 'fab' | 'avatar' | 'mark'` (`'mark'`), `size?: 'sm' | 'md' | 'lg' | 'xl'` (`'md'`), `pulse?: boolean` (`false` — automatically enabled for `'fab'`), `ariaLabel?: string` (`'Asistente IA Integrity'`).

### `IntegrityErrorPage`
Standard branded error & 404 page (automatically wired via the layer's `app/error.vue`). Handles `404`, `403`, `401`, and `500` with Spanish copy, monospace HTTP status badge, missing route pill, Light/Dark toggle, and `clearError({ redirect })` recovery.
- **Props:** `error?: { statusCode?: number; statusMessage?: string; message?: string; url?: string } | null`, `statusCode?: number`, `title?: string`, `description?: string`, `homePath?: string` (`'/'`), `homeLabel?: string` (`'Volver al inicio'`), `showBack?: boolean` (`true`), `showDetails?: boolean` (`false` — keep `false` in production).
- **Slots:** `actions`.

---

## Primitives & Feedback

### `IntegrityButton`
- **Props:** `variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'` (`'primary'`), `size?: 'sm' | 'md' | 'lg'` (`'md'`), `type?: 'button' | 'submit' | 'reset'` (`'button'`), `disabled?: boolean`, `loading?: boolean`, `block?: boolean`, `icon?: string` (`i-heroicons-*`), `iconRight?: string`.

### `IntegrityBadge`
- **Props:** `tone?: 'brand' | 'operational' | 'degraded' | 'down' | 'maintenance' | 'neutral' | 'info'` (`'neutral'`), `size?: 'sm' | 'md'` (`'sm'`), `dot?: boolean` (`false`), `pill?: boolean` (`true`).

### `IntegrityAlert`
- **Props:** `tone?: 'info' | 'success' | 'warning' | 'danger'` (`'info'`), `title?: string`, `dismissible?: boolean` (`false`).
- **Emits:** `dismiss`.

### `IntegrityTabs`
Accessible WAI-ARIA tab bar with Left/Right/Home/End keyboard support.
- **Model:** `v-model` (`string`).
- **Props:** `items: IntegrityTabItem[]` (required: `{ value, label, icon?, badge?, disabled? }`), `variant?: 'underline' | 'pills'` (`'underline'`), `size?: 'sm' | 'md'` (`'md'`), `fullWidth?: boolean`, `ariaLabel?: string`.
- **Slots:** `#panel-<value>` (`{ active }`) or default slot (`{ active }`).

### `IntegrityEmptyState`
- **Props:** `icon?: string` (`'i-heroicons-inbox'`), `title?: string`, `description?: string`.
- **Slots:** `actions`.

### `IntegrityLogoLoader`
- **Props:** `label?: string` (`'Cargando…'`), `size?: 'sm' | 'md' | 'lg'` (`'md'`).

### `IntegritySkeleton`
- **Props:** `variant?: 'text' | 'rect' | 'circle' | 'card' | 'table'` (`'text'`), `lines?: number` (`3`), `rows?: number` (`4`), `width?: string`, `height?: string`, `rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full'` (`'md'`), `label?: string`.

---

## Forms & Inputs

Use `.form-grid-2` CSS utility for responsive 2-column forms.

### `IntegrityInput`
- **Model:** `v-model` (`string`).
- **Props:** `label?: string`, `placeholder?: string`, `type?: string` (`'text'`), `hint?: string`, `error?: string`, `icon?: string`, `disabled?: boolean`, `required?: boolean`, `id?: string`.

### `IntegritySelect`
Custom shadcn-style accessible combobox/select (never renders a vanilla OS dropdown). Supports keyboard navigation, checkmark indicator, optional descriptions/meta badges, and built-in search.
- **Model:** `v-model` (`string`).
- **Props:** `options: IntegritySelectOption[]` (`{ value, label, description?, meta?, disabled? }`), `label?: string`, `placeholder?: string`, `searchPlaceholder?: string`, `searchable?: boolean` (auto-enabled when `options.length > 8`), `hint?: string`, `error?: string`, `disabled?: boolean`, `required?: boolean`, `emptyText?: string`, `id?: string`.

```vue
<IntegritySelect
  v-model="env"
  label="Entorno"
  searchable
  :options="[
    { value: 'qa', label: 'Calidad (QA)', description: 'Pruebas UAT', meta: 'QA' },
    { value: 'prod', label: 'Producción', description: 'Cluster 24/7', meta: 'PROD' },
  ]"
/>
```

### `IntegrityMultiSelect`
Searchable multi-select with removable chips, descriptions, meta tags, and optional max limit.
- **Model:** `v-model` (`string[]`).
- **Props:** `options: IntegrityMultiSelectOption[]` (`{ value, label, description?, meta?, disabled? }`), `label?: string`, `placeholder?: string`, `searchPlaceholder?: string`, `hint?: string`, `error?: string`, `disabled?: boolean`, `required?: boolean`, `maxSelections?: number`, `emptyText?: string`, `loading?: boolean`, `id?: string`.
- **Emits:** `search(query: string)` (for optional async/server filtering).

### `IntegrityEmailListInput`
Chip-based email list editor supporting paste/entry delimited by `;`, `,`, spaces, or newlines, with live validation, deduplication, and `; `-formatted preview.
- **Model:** `v-model` (`string[]`).
- **Props:** `label?: string`, `placeholder?: string`, `hint?: string`, `error?: string`, `disabled?: boolean`, `required?: boolean`, `maxItems?: number`, `id?: string`.
- **Emits:** `invalid(entries: string[])`.

---

## Overlays & Global Containers

### `IntegrityModal`
Teleported modal dialog with backdrop blur and Escape dismissal.
- **Model:** `v-model:open` (`boolean`).
- **Props:** `title?: string`, `subtitle?: string`, `size?: 'sm' | 'md' | 'lg' | 'xl'` (`'md'`), `closeOnBackdrop?: boolean` (`true`).
- **Slots:** `header`, `default`, `footer` (`{ close }`).
- **Emits:** `close`.

### `IntegrityDrawer`
Teleported slide-over side panel for contextual editing or detail inspection.
- **Model:** `v-model:open` (`boolean`).
- **Props:** `title?: string`, `subtitle?: string`, `side?: 'right' | 'left'` (`'right'`), `size?: 'sm' | 'md' | 'lg' | 'xl'` (`'md'`), `closeOnBackdrop?: boolean` (`true`).
- **Slots:** `header`, `default`, `footer` (`{ close }`).
- **Emits:** `close`.

### `IntegrityConfirmDialog` & `IntegrityToastContainer`
Mount once in `app/app.vue`. Controlled programmatically via `useIntegrityConfirm()` and `useIntegrityToast()`.

### `IntegrityWelcomeOverlay`
Full-screen login welcome animation (`Teleport to="body"`, `z-[20000]`). Sequentially stroke-draws the three squares of the Integrity isotipo with a radial `var(--color-accent)` glow, uppercase letter-spaced greeting, optional subtitle, Light/Dark background, and `prefers-reduced-motion` support.
- **Props:** `show?: boolean` (`false`), `label?: string` (`'Bienvenido'`), `subtitle?: string`.

### `IntegrityEnvironmentOverlay`
Full-screen frosted-glass (`backdrop-blur-md`) loading overlay (`Teleport to="body"`, `z-[20000]`) for switching environments (`PROD` / `QA` / `DEV`) or reloading workspace context. Loops the Integrity isotipo stroke-draw + subtle fill animation with an optional environment `<IntegrityBadge>` and bouncing dots, respecting `prefers-reduced-motion`.
- **Props:** `show?: boolean` (`false`), `label?: string` (`'Cambiando de entorno…'`), `environment?: string`, `size?: 'md' | 'lg'` (`'lg'`).

---

## Data & Audit

### `IntegrityStatCard`
Enterprise KPI card with `tabular-nums`, semantic icon badge, trend indicator, and built-in skeleton loading state.
- **Props:** `label: string` (required), `value: string | number` (required), `delta?: string`, `deltaTone?: IntegrityBadgeTone` (`'neutral'`), `trend?: 'up' | 'down' | 'flat'`, `icon?: string`, `tone?: IntegrityBadgeTone` (`'brand'`), `hint?: string`, `loading?: boolean` (`false`).
- **Slots:** `footer`.

### `IntegrityDataTable`
Typed operational table with built-in formatting (`text`, `badge`, `boolean`, `date`, `number`, `mono`), loading state, and empty state.
- **Props:** `columns: IntegrityTableColumn[]` (required), `rows: Record<string, unknown>[]` (required), `loading?: boolean`, `rowKey?: string` (`'id'`), `emptyTitle?: string`, `emptyDescription?: string`, `hoverable?: boolean` (`true`).
- **Slots:** `#cell-<columnKey>` (`{ row, value, column }`), `#empty`.

### `IntegrityPagination`
Compact pagination bar with summary (`Mostrando 1–10 de 142`), custom shadcn-style page-size dropdown, and ellipsis ranges.
- **Models:** `v-model:page` (`number`), `v-model:page-size` (`number`).
- **Props:** `total: number` (required), `pageSizeOptions?: number[]` (`[10, 20, 50, 100]`), `showPageSize?: boolean` (`true`), `showSummary?: boolean` (`true`), `itemLabel?: string` (`'registros'`), `siblingCount?: number` (`1`), `disabled?: boolean`.

### `IntegritySensitiveCell`
Masks sensitive data (CLABE, RFC, tokens, phone numbers) with optional confirmation dialog before reveal.
- **Props:** `value: string | number | null | undefined`, `revealKey: string` (unique per row/field), `label?: string` (`'dato sensible'`), `requireConfirm?: boolean` (`false`), `visibleTail?: number` (`4`).

### `IntegrityTimeline`
Vertical audit timeline with event kind badges, timestamps, source paths, and HTTP status badges.
- **Props:** `events: IntegrityTimelineEvent[]` (`{ at?, kind, title, detail?, source?, http? }`), `emptyLabel?: string`.

---

## Code, Markdown & Terminal Logs

### `IntegrityCodeBlock`
Zero-dependency, XSS-safe syntax-highlighted code/JSON viewer with auto JSON pretty-printing, line numbers, wrap toggle, and copy button.
- **Props:** `code: string | Record<string, unknown> | unknown[]` (required), `language?: 'json' | 'ts' | 'js' | 'vue' | 'html' | 'bash' | 'sql' | 'css' | 'text' | string` (`'json'`), `title?: string`, `showLineNumbers?: boolean` (`true`), `copyable?: boolean` (`true`), `wrap?: boolean` (`false`), `prettyJson?: boolean` (`true`), `maxHeight?: string` (`'26rem'`).

```vue
<IntegrityCodeBlock title="payload.json" language="json" :code="apiResponse" />
```

### `IntegrityMarkdown`
XSS-safe Markdown renderer styled for Light & Dark mode. Supports headings, paragraphs, bold/italic/strikethrough, inline code, sanitized links, blockquotes, lists, GFM tables, and renders every fenced code block (e.g. ```` ```json ````) using `<IntegrityCodeBlock>`.
- **Props:** `content: string` (required), `showCodeLineNumbers?: boolean` (`false`).

```vue
<IntegrityMarkdown :content="incidentReportMarkdown" />
```

### `IntegrityTerminalLog`
Dark terminal viewer designed for PM2, Docker, and Node/API logs. Parses ANSI color codes, PM2 process prefixes (`0|api-prod |`), timestamps, HTTP statuses, and log severities with real-time search, level filters (`Todos`, `Error`, `Warn`, `Info`), row highlighting, wrap toggle, and plain-text copy.
- **Props:** `logs: string | string[]` (required), `title?: string` (`'pm2 logs'`), `status?: 'online' | 'degraded' | 'error' | 'idle'` (`'online'`), `searchable?: boolean` (`true`), `filterable?: boolean` (`true`), `showLineNumbers?: boolean` (`true`), `wrap?: boolean` (`false`), `maxHeight?: string` (`'24rem'`).

```vue
<IntegrityTerminalLog
  title="pm2 logs integrity-api --lines 100"
  status="online"
  :logs="pm2OutputLines"
/>
```
