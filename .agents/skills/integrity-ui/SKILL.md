---
name: integrity-ui
description: >-
  Official design system and UI engineering skill for Integrity web applications
  built with @andrescardenasintegrity/integrity-ui-nuxt (Nuxt 4 Layer, 28 Vue 3
  components, 5 composables, 5 utilities) and @andrescardenasintegrity/integrity-tokens
  (framework-agnostic CSS variables and Tailwind preset for Nuxt, Vue, and React).
  Use this skill whenever creating, updating, or reviewing Integrity web interfaces,
  dashboards, forms, comboboxes, tables, pagination, modals, drawers, JSON/code
  viewers, Markdown renderers, PM2 terminal log viewers, or styling with Integrity
  brand tokens and Light/Dark mode.
---

# Integrity UI/UX — Agent Skill

Use this skill to build consistent, production-grade web interfaces aligned with **Integrity's official visual standard** using `@andrescardenasintegrity/integrity-ui-nuxt` and `@andrescardenasintegrity/integrity-tokens`.

## 1. Mandatory Visual & UX Rules

1. **100% Integrity Identity:** Primary brand accent is `#273679` (light) / `#3D4F9C` (dark) via `bg-accent`, `text-accent`, `border-accent`, `brand-*`. Never invent arbitrary screen-specific accent colors.
2. **Light & Dark First-Class:** Every view must look clean in both themes using `dark:` utilities and `@andrescardenasintegrity/integrity-tokens/css` variables.
3. **Typography:** `Inter` for UI (`font-sans`), `JetBrains Mono` (`font-mono`) for IDs, folios, CLABEs, HTTP status codes, JSON, and logs, and `tabular-nums` for numeric columns/KPIs/pagination.
4. **Icons (Heroicons Only):** Use `<Icon name="i-heroicons-*" />` exclusively via `@nuxt/icon`. Never mix icon families.
5. **Standard Admin Shell & Header:** Administrative screens mount inside `<IntegrityAppShell>` and start each page with `<IntegrityPageHeader>`.
6. **No Native Browser Dialogs:** Never use `window.alert()`, `window.confirm()`, or native `<select>` dropdowns. Always use `useIntegrityToast()`, `useIntegrityConfirm()`, and `<IntegritySelect>` / `<IntegrityMultiSelect>`.
7. **Destructive Actions:** Always gate irreversible actions with `useIntegrityConfirm()` using `type: 'danger'` (and `confirmDelaySeconds: 3` for critical deletions).
8. **Code, Markdown & PM2 Logs:** Always render JSON payloads/code snippets with `<IntegrityCodeBlock>`, Markdown (including embedded JSON/tables) with `<IntegrityMarkdown>`, and PM2/console output with `<IntegrityTerminalLog>`.

## 2. Project Setup (Nuxt 4 Consumer)

1. Configure `.npmrc` in the client project root (export `NODE_AUTH_TOKEN` with a GitHub PAT having `read:packages`):

```ini
shamefully-hoist=true
@andrescardenasintegrity:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

2. Install the Nuxt 4 Layer:

```bash
pnpm add @andrescardenasintegrity/integrity-ui-nuxt
```

3. Extend the layer in `nuxt.config.ts` (**do not** manually set `tailwindcss.configPath` — the layer's `tailwind.config.cjs` is auto-discovered):

```ts
export default defineNuxtConfig({
  extends: ['@andrescardenasintegrity/integrity-ui-nuxt'],
})
```

4. Mount the global overlay containers once in `app/app.vue`:

```vue
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <IntegrityToastContainer />
  <IntegrityConfirmDialog />
</template>
```

For **React + Tailwind** projects, install `@andrescardenasintegrity/integrity-tokens`, import `@andrescardenasintegrity/integrity-tokens/css`, and register `@andrescardenasintegrity/integrity-tokens/preset` in `tailwind.config.js`.

## 3. Quick Component Inventory (28 Components)

All components are auto-imported in Nuxt 4 when extending `@andrescardenasintegrity/integrity-ui-nuxt`.

| Category | Components |
|---|---|
| **Layout & Brand** | `IntegrityAppShell`, `IntegritySidebar`, `IntegrityPageHeader`, `IntegrityCard`, `IntegrityMark` |
| **Primitives & Feedback** | `IntegrityButton`, `IntegrityBadge`, `IntegrityAlert`, `IntegrityTabs`, `IntegrityEmptyState`, `IntegrityLogoLoader`, `IntegritySkeleton` |
| **Forms & Inputs** | `IntegrityInput`, `IntegritySelect` (custom shadcn-style combobox), `IntegrityMultiSelect`, `IntegrityEmailListInput` |
| **Overlays & Global** | `IntegrityModal`, `IntegrityDrawer`, `IntegrityConfirmDialog`, `IntegrityToastContainer` |
| **Data & Audit** | `IntegrityStatCard`, `IntegrityDataTable`, `IntegrityPagination`, `IntegritySensitiveCell`, `IntegrityTimeline` |
| **Code, Markdown & Logs** | `IntegrityCodeBlock`, `IntegrityMarkdown`, `IntegrityTerminalLog` |

**5 Composables (auto-imported):** `useIntegrityTheme`, `useIntegritySidebar`, `useIntegrityToast`, `useIntegrityConfirm`, `useIntegritySensitive`.

**5 Utilities (auto-imported):** `emailList` (`isValidEmail`, `parseEmailList`, `validateEmailList`, `formatEmailList`), `pagination` (`getPaginationBounds`, `computePaginationRange`), `codeHighlight` (`highlightCode`, `normalizeCodeContent`, `escapeHtml`), `markdown` (`parseMarkdownBlocks`, `renderInlineMarkdown`), `terminalLog` (`parseTerminalLogs`, `ansiToHtml`, `stripAnsi`, `detectLogLevel`).

## 4. Detailed References (Load On Demand)

Read the relevant reference file before writing complex views so every prop, slot, and TypeScript type is exact:

- **Props, `v-model`, slots, and usage examples for all 28 components:** [references/components.md](./references/components.md)
- **Composables, utilities, TypeScript types, and CSS/Tailwind tokens:** [references/composables-and-tokens.md](./references/composables-and-tokens.md)
- **Complete page templates & patterns (Admin CRUD, Public Status Board / Tablero de Estados, Ops/PM2 Log & JSON Inspector, Login, React tokens):** [references/patterns.md](./references/patterns.md)

## 5. Verification Checklist

Before finishing any UI task using Integrity UI/UX:
1. Run `pnpm typecheck` and `pnpm build` in the target project.
2. Verify both **Light** and **Dark** modes (no hardcoded `bg-white` without `dark:bg-*`, no unreadable contrast).
3. Confirm `<IntegrityToastContainer />` and `<IntegrityConfirmDialog />` exist in `app/app.vue` if using toasts, confirmations, or `IntegritySensitiveCell` with `require-confirm`.
4. Confirm TypeScript types are imported from `@andrescardenasintegrity/integrity-ui-nuxt/app/types/ui`.
