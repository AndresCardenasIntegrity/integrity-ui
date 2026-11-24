<script setup lang="ts">
import { computed, ref, shallowRef } from 'vue'
import type { IntegrityTableColumn } from '@integritysoftwarela/integrity-ui-nuxt/app/types/ui'

definePageMeta({
  layout: 'admin',
})

const { success } = useIntegrityToast()
const { confirm } = useIntegrityConfirm()

const search = shallowRef('')
const createOpen = shallowRef(false)
const newServiceName = shallowRef('')
const newServiceRegion = shallowRef('mx')

const kpis = [
  { label: 'Servicios activos', value: '24', delta: '100% online', tone: 'operational' as const },
  { label: 'Alertas abiertas', value: '2', delta: '1 degradado', tone: 'degraded' as const },
  { label: 'Solicitudes hoy', value: '1,482', delta: '+8.4% vs ayer', tone: 'brand' as const },
  { label: 'Tiempo promedio', value: '142 ms', delta: 'Dentro de SLA', tone: 'info' as const },
]

const columns: IntegrityTableColumn[] = [
  { key: 'code', label: 'Código', type: 'mono' },
  { key: 'name', label: 'Servicio' },
  {
    key: 'status',
    label: 'Estado',
    type: 'badge',
    map: { operational: 'Operacional', degraded: 'Degradado', maintenance: 'Mantenimiento' },
    tones: { operational: 'operational', degraded: 'degraded', maintenance: 'maintenance' },
  },
  { key: 'latency', label: 'Latencia (ms)', type: 'number', align: 'right' },
  { key: 'actions', label: 'Acciones', align: 'right' },
]

const rows = ref([
  { id: 1, code: 'SVC-AUTH', name: 'Autenticación Central', status: 'operational', latency: 84 },
  { id: 2, code: 'SVC-PAY', name: 'Pasarela de Pagos', status: 'operational', latency: 132 },
  { id: 3, code: 'SVC-SYNC', name: 'Sincronizador ERP', status: 'degraded', latency: 418 },
  { id: 4, code: 'SVC-MAIL', name: 'Despacho de Correos', status: 'maintenance', latency: 165 },
])

const visibleRows = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return rows.value
  return rows.value.filter(r => r.name.toLowerCase().includes(q) || r.code.toLowerCase().includes(q))
})

function addService() {
  if (!newServiceName.value.trim()) return
  rows.value = [
    {
      id: Date.now(),
      code: `SVC-${newServiceRegion.value.toUpperCase()}-${rows.value.length + 1}`,
      name: newServiceName.value.trim(),
      status: 'operational',
      latency: 110,
    },
    ...rows.value,
  ]
  newServiceName.value = ''
  createOpen.value = false
  success('Servicio agregado al catálogo.')
}

async function removeService(id: number, name: string) {
  const ok = await confirm({
    type: 'danger',
    title: 'Eliminar servicio',
    message: `¿Seguro que deseas retirar "${name}" del monitoreo?`,
    confirmText: 'Retirar',
  })
  if (!ok) return
  rows.value = rows.value.filter(r => r.id !== id)
  success('Servicio retirado.')
}
</script>

<template>
  <div class="space-y-6">
    <IntegrityPageHeader
      eyebrow="Template · Dashboard Administrativo"
      title="Consola de Servicios"
      subtitle="Ejemplo de página estándar combinando KPIs, búsqueda, tabla, modal de alta y confirmación destructiva."
    >
      <template #actions>
        <IntegrityButton icon="i-heroicons-plus" @click="createOpen = true">
          Nuevo servicio
        </IntegrityButton>
      </template>
    </IntegrityPageHeader>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <IntegrityCard v-for="kpi in kpis" :key="kpi.label" padding="sm">
        <p class="text-xs font-medium text-slate-500 dark:text-slate-400">{{ kpi.label }}</p>
        <p class="text-2xl font-semibold tabular-nums text-slate-900 dark:text-slate-50 mt-1">
          {{ kpi.value }}
        </p>
        <div class="mt-2">
          <IntegrityBadge :tone="kpi.tone" dot>{{ kpi.delta }}</IntegrityBadge>
        </div>
      </IntegrityCard>
    </div>

    <IntegrityCard title="Servicios Monitoreados" padding="none">
      <template #actions>
        <div class="w-full sm:w-64">
          <IntegrityInput
            v-model="search"
            placeholder="Filtrar servicio…"
            icon="i-heroicons-magnifying-glass"
          />
        </div>
      </template>

      <IntegrityDataTable :columns="columns" :rows="visibleRows">
        <template #cell-actions="{ row }">
          <IntegrityButton
            size="sm"
            variant="ghost"
            icon="i-heroicons-trash"
            @click="removeService(Number(row.id), String(row.name))"
          >
            Retirar
          </IntegrityButton>
        </template>
      </IntegrityDataTable>
    </IntegrityCard>

    <IntegrityModal
      v-model:open="createOpen"
      title="Registrar servicio"
      subtitle="Se añadirá inmediatamente a la tabla de monitoreo."
    >
      <div class="space-y-4">
        <IntegrityInput
          v-model="newServiceName"
          label="Nombre del servicio"
          placeholder="Ej. API de Facturación"
          required
        />
        <IntegritySelect
          v-model="newServiceRegion"
          label="Región"
          :options="[
            { label: 'México (MX)', value: 'mx' },
            { label: 'Colombia (CO)', value: 'co' },
            { label: 'Brasil (BR)', value: 'br' },
          ]"
        />
      </div>
      <template #footer="{ close }">
        <IntegrityButton variant="ghost" @click="close">Cancelar</IntegrityButton>
        <IntegrityButton :disabled="!newServiceName.trim()" @click="addService">
          Registrar
        </IntegrityButton>
      </template>
    </IntegrityModal>
  </div>
</template>
