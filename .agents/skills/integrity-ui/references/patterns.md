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

## 4. React + Tailwind Consumer Pattern

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
