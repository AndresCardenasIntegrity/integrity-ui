# Integrity UI/UX — Production Page Patterns

## 1. Standard Admin Layout (`app/layouts/default.vue`)

```vue
<script setup lang="ts">
import type { IntegrityNavGroup } from '@andrescardenasintegrity/integrity-ui-nuxt/app/types/ui'

const navGroups: IntegrityNavGroup[] = [
  {
    id: 'ops',
    label: 'Operación',
    items: [
      { label: 'Resumen', to: '/', icon: 'i-heroicons-squares-2x2', exact: true },
      { label: 'Solicitudes', to: '/requests', icon: 'i-heroicons-table-cells' },
      { label: 'Logs PM2', to: '/logs', icon: 'i-heroicons-command-line' },
    ],
  },
]
</script>

<template>
  <IntegrityAppShell
    brand-name="Portal Cliente"
    brand-subtitle="Operación"
    :nav-groups="navGroups"
    max-width="7xl"
  >
    <slot />
  </IntegrityAppShell>
</template>
```

## 2. CRUD & Paginated Data Page Pattern

```vue
<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue'
import type { IntegrityTableColumn } from '@andrescardenasintegrity/integrity-ui-nuxt/app/types/ui'

const { success } = useIntegrityToast()
const { confirm } = useIntegrityConfirm()

const search = shallowRef('')
const status = shallowRef('all')
const page = shallowRef(1)
const pageSize = shallowRef(10)
const drawerOpen = shallowRef(false)

watch([search, status], () => {
  page.value = 1
})

const columns: IntegrityTableColumn[] = [
  { key: 'folio', label: 'Folio', type: 'mono' },
  { key: 'client', label: 'Cliente' },
  { key: 'clabe', label: 'CLABE' },
  {
    key: 'status',
    label: 'Estatus',
    type: 'badge',
    map: { ok: 'Operacional', warn: 'Pendiente', err: 'Error' },
    tones: { ok: 'operational', warn: 'degraded', err: 'down' },
  },
  { key: 'amount', label: 'Monto', type: 'number', align: 'right' },
]

async function deleteItem(folio: string) {
  const ok = await confirm({
    type: 'danger',
    title: `Eliminar ${folio}`,
    message: 'Esta acción es irreversible.',
    confirmDelaySeconds: 3,
    confirmText: 'Sí, eliminar',
  })
  if (ok) success(`Registro ${folio} eliminado.`)
}
</script>

<template>
  <div class="space-y-6">
    <IntegrityPageHeader
      eyebrow="Operación"
      title="Solicitudes"
      subtitle="Gestión y trazabilidad en tiempo real."
    >
      <template #actions>
        <IntegrityButton icon="i-heroicons-plus" @click="drawerOpen = true">
          Nueva solicitud
        </IntegrityButton>
      </template>
    </IntegrityPageHeader>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <IntegrityStatCard label="Activas" :value="128" delta="+4.2%" delta-tone="operational" trend="up" icon="i-heroicons-bolt" />
      <IntegrityStatCard label="Pendientes" :value="9" delta="Revisar" delta-tone="degraded" icon="i-heroicons-clock" tone="degraded" />
      <IntegrityStatCard label="Errores" :value="1" delta="-50%" delta-tone="operational" trend="down" icon="i-heroicons-exclamation-triangle" tone="down" />
    </div>

    <IntegrityCard title="Listado" padding="none">
      <div class="p-4 border-b border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <IntegrityInput v-model="search" placeholder="Buscar por folio…" icon="i-heroicons-magnifying-glass" />
        <IntegritySelect
          v-model="status"
          :options="[
            { value: 'all', label: 'Todos los estatus' },
            { value: 'ok', label: 'Operacional' },
            { value: 'warn', label: 'Pendiente' },
            { value: 'err', label: 'Error' },
          ]"
        />
      </div>

      <IntegrityDataTable :columns="columns" :rows="rows">
        <template #cell-clabe="{ row }">
          <IntegritySensitiveCell :value="String(row.clabe)" :reveal-key="`req-${row.id}`" label="CLABE" require-confirm />
        </template>
      </IntegrityDataTable>

      <template #footer>
        <IntegrityPagination v-model:page="page" v-model:page-size="pageSize" :total="total" item-label="solicitudes" />
      </template>
    </IntegrityCard>
  </div>
</template>
```

## 3. Ops Diagnostics Page (PM2 Logs + Markdown Report + JSON Payload)

```vue
<template>
  <div class="space-y-6">
    <IntegrityPageHeader
      eyebrow="Infraestructura"
      title="Diagnóstico del Servicio"
      subtitle="Logs PM2 en vivo, payload JSON y notas de incidente."
    />

    <IntegrityTerminalLog
      title="pm2 logs integrity-api --lines 200"
      status="online"
      :logs="pm2Logs"
    />

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      <IntegrityCodeBlock title="last-webhook.json" language="json" :code="webhookPayload" />
      <IntegrityCard title="Resumen del incidente">
        <IntegrityMarkdown :content="incidentMarkdown" />
      </IntegrityCard>
    </div>
  </div>
</template>
```

## 4. Public Service Status Board Pattern (Tablero de Estados)

Use this standard layout whenever building a public or multi-environment **Tablero de Estado de Servicios** (inspired by Integrity's operational status boards):

### Required Structure
1. **Top Header (no sidebar):** `<IntegrityMark />` inside `bg-accent text-white rounded-xl`, service/client title + `"Tablero de Estado de Servicios"`, `<IntegritySelect>` environment switcher (`PROD` / `QA` / `ALL`), manual refresh `<IntegrityButton>`, and Light/Dark toggle (`useIntegrityTheme()`).
2. **View Switcher + Legend:** `<IntegrityTabs variant="pills">` toggling between **Estado actual** and **Historial (30 días)** alongside the 4 semantic color swatches (`operational` `#10B981`, `degraded` `#F59E0B`, `down` `#EF4444`, `maintenance` `#6366F1`).
3. **Environment Section:** Eyebrow `ENTORNO`, environment heading, overall status dot + service count, and an **Overall Status Banner** summarizing system health (plus amber/red empty states if an environment is unconfigured or unreachable).
4. **Active Incidents & Scheduled Maintenance:** Left-bordered cards (`border-l-4` in red/amber/indigo) showing severity `<IntegrityBadge>`, `Service › Component`, title, description, status pill, and start/window timestamps in `font-mono`.
5. **Expandable Services + 60-Day Uptime Capsules:**
   - Accordion service rows expanding to child components.
   - Each row displays a 60-column CSS grid (`grid-template-columns: repeat(60, minmax(0, 1fr))`) of clickable day capsules (`2px` gap, `28px` height on services / `22px` on components).
   - Clicking any capsule opens an `<IntegrityModal size="sm">` (or anchored popover) showing the exact date, `<IntegrityBadge>`, duration, and day summary (`"Operacional durante las 24 horas..."` or incident details).
6. **30-Day Incident History:** Incidents grouped by date with a top status stripe (`h-1 rounded-full`), severity badge, `font-mono` start/resolved timestamps, and total duration. **Security rule:** never expose internal `rootCause` notes on unauthenticated public status views; gate root-cause details strictly to authenticated admin sessions.

```vue
<!-- Minimal Status Row + 60-Day Uptime Track -->
<div class="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-4 flex flex-col gap-4 lg:flex-row lg:items-center">
  <div class="flex items-center gap-3 lg:w-80 shrink-0">
    <p class="text-sm font-semibold text-slate-950 dark:text-white truncate flex-1">{{ service.name }}</p>
    <IntegrityBadge :tone="service.status" dot size="sm">{{ statusLabel(service.status) }}</IntegrityBadge>
  </div>
  <div class="flex-1 min-w-0">
    <div class="grid gap-[2px] h-7" style="grid-template-columns: repeat(60, minmax(0, 1fr));">
      <button
        v-for="day in service.history"
        :key="day.date"
        type="button"
        :class="['h-full w-full rounded-[2px] transition-transform hover:scale-y-110', capsuleColor(day.status)]"
        :title="`${day.dateLabel}: ${statusLabel(day.status)}`"
        @click="openDayDetail(service, day)"
      />
    </div>
    <div class="mt-1 flex justify-between text-[11px] text-slate-400 tabular-nums">
      <span>Hace 60 días</span>
      <span class="font-mono">{{ service.uptimePct }}</span>
      <span>Hoy</span>
    </div>
  </div>
</div>
```

*(Full interactive reference implementation in `apps/showcase/app/pages/templates/status.vue`.)*

## 5. Customizing 404 & Error Pages (`app/error.vue`)

The layer automatically provides `app/error.vue` rendering `<IntegrityErrorPage :error="error" />`. Only create a local `app/error.vue` when customizing redirect paths or extra recovery actions — never expose stack traces or raw backend error messages in production:

```vue
<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{
  error: NuxtError
}>()
</script>

<template>
  <IntegrityErrorPage
    :error="error"
    home-path="/dashboard"
    home-label="Ir al panel principal"
  />
</template>
```

## 6. React + Tailwind Consumer Pattern

```js
// tailwind.config.js
import integrityPreset from '@andrescardenasintegrity/integrity-tokens/preset'

export default {
  presets: [integrityPreset],
  content: ['./src/**/*.{ts,tsx}'],
}
```

```ts
// src/main.tsx
import '@andrescardenasintegrity/integrity-tokens/css'
```
