<script setup lang="ts">
import { shallowRef } from 'vue'
import type { IntegrityTableColumn } from '@andrescardenasintegrity/integrity-ui-nuxt/app/types/ui'

const { success } = useIntegrityToast()
const { confirm } = useIntegrityConfirm()

const page = shallowRef(1)
const pageSize = shallowRef(10)

const columns: IntegrityTableColumn[] = [
  { key: 'code', label: 'Folio', type: 'mono' },
  { key: 'name', label: 'Descripción' },
  {
    key: 'status',
    label: 'Estado',
    type: 'badge',
    map: { ok: 'Operacional', warn: 'Pendiente' },
    tones: { ok: 'operational', warn: 'degraded' },
  },
  { key: 'updatedAt', label: 'Actualizado', type: 'date' },
]

const rows = [
  { id: 1, code: 'REG-001', name: 'Integración inicial completada', status: 'ok', updatedAt: '2026-11-23T15:00:00Z' },
  { id: 2, code: 'REG-002', name: 'Configuración de alertas', status: 'warn', updatedAt: '2026-11-23T15:30:00Z' },
]

async function handleAction() {
  const accepted = await confirm({
    type: 'info',
    title: 'Confirmar prueba',
    message: 'Esta plantilla ya incluye toasts, confirmaciones, fuentes Inter/JetBrains Mono y modo Light/Dark.',
    confirmText: 'Entendido',
  })
  if (accepted) {
    success('Integrity UI/UX funcionando correctamente.')
  }
}
</script>

<template>
  <div class="space-y-6">
    <IntegrityPageHeader
      eyebrow="Integrity UI/UX Starter"
      title="Panel Principal"
      subtitle="Plantilla mínima Nuxt 4 conectada a @andrescardenasintegrity/integrity-ui-nuxt."
    >
      <template #actions>
        <IntegrityButton icon="i-heroicons-sparkles" @click="handleAction">
          Probar confirmación
        </IntegrityButton>
      </template>
    </IntegrityPageHeader>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <IntegrityStatCard
        label="Servicios activos"
        :value="12"
        delta="100% online"
        delta-tone="operational"
        trend="up"
        icon="i-heroicons-server-stack"
        tone="brand"
      />
      <IntegrityStatCard
        label="Eventos hoy"
        :value="348"
        delta="+6.2%"
        delta-tone="operational"
        trend="up"
        icon="i-heroicons-bolt"
        tone="info"
      />
      <IntegrityStatCard
        label="Pendientes"
        :value="1"
        delta="En revisión"
        delta-tone="degraded"
        icon="i-heroicons-clock"
        tone="degraded"
      />
    </div>

    <IntegrityCard title="Registros de ejemplo" padding="none">
      <IntegrityDataTable :columns="columns" :rows="rows" />
      <template #footer>
        <IntegrityPagination
          v-model:page="page"
          v-model:page-size="pageSize"
          :total="rows.length"
          item-label="registros"
        />
      </template>
    </IntegrityCard>
  </div>
</template>
