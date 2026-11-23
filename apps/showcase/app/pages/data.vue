<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import type { IntegrityTableColumn, IntegrityTimelineEvent } from '@andrescardenasintegrity/integrity-ui-nuxt/app/types/ui'

const search = shallowRef('')
const statusFilter = shallowRef('all')
const loadingDemo = shallowRef(false)

const columns: IntegrityTableColumn[] = [
  { key: 'folio', label: 'Folio', type: 'mono' },
  { key: 'cliente', label: 'Cliente' },
  { key: 'clabe', label: 'CLABE (Sensible)' },
  {
    key: 'estatus',
    label: 'Estatus',
    type: 'badge',
    map: { ok: 'Operacional', warn: 'Pendiente', err: 'Rechazado' },
    tones: { ok: 'operational', warn: 'degraded', err: 'down' },
  },
  { key: 'monto', label: 'Monto (MXN)', type: 'number', align: 'right' },
  { key: 'actualizado', label: 'Actualizado', type: 'date' },
]

const allRows = [
  { id: 1, folio: 'SOL-2026-0142', cliente: 'Seguros Horizonte S.A.', clabe: '012180015928374612', estatus: 'ok', monto: 48500, actualizado: '2026-11-23T13:20:00Z' },
  { id: 2, folio: 'SOL-2026-0143', cliente: 'Grupo Industrial Norte', clabe: '002180700481920345', estatus: 'warn', monto: 129300, actualizado: '2026-11-23T12:45:00Z' },
  { id: 3, folio: 'SOL-2026-0144', cliente: 'Logística Pacífico', clabe: '072180009182736451', estatus: 'err', monto: 17420, actualizado: '2026-11-23T11:10:00Z' },
  { id: 4, folio: 'SOL-2026-0145', cliente: 'Servicios Médicos Sur', clabe: '014180655019283746', estatus: 'ok', monto: 92150, actualizado: '2026-11-23T10:05:00Z' },
]

const filteredRows = computed(() => {
  const q = search.value.trim().toLowerCase()
  return allRows.filter((row) => {
    const matchStatus = statusFilter.value === 'all' || row.estatus === statusFilter.value
    const matchQuery = !q || row.folio.toLowerCase().includes(q) || row.cliente.toLowerCase().includes(q)
    return matchStatus && matchQuery
  })
})

const events: IntegrityTimelineEvent[] = [
  {
    at: '2026-11-23T10:05:12Z',
    kind: 'created',
    title: 'Solicitud registrada en plataforma',
    detail: 'Validación inicial de estructura y beneficiario completada.',
    source: 'api/solicitudes.post.ts',
  },
  {
    at: '2026-11-23T10:12:40Z',
    kind: 'api',
    title: 'Envío a procesador financiero',
    detail: 'Lote #408 aceptado sin observaciones.',
    http: 200,
    source: 'worker/dispatch.ts',
  },
  {
    at: '2026-11-23T10:14:03Z',
    kind: 'email',
    title: 'Notificación enviada al responsable',
    detail: 'Confirmación entregada a operaciones@cliente.com.',
    source: 'mailer/notify.ts',
  },
  {
    at: '2026-11-23T10:18:22Z',
    kind: 'status',
    title: 'Estado actualizado a Operacional',
    source: 'audit/state-machine.ts',
  },
]
</script>

<template>
  <div class="space-y-8">
    <IntegrityPageHeader
      eyebrow="Datos y Trazabilidad"
      title="Tablas, Datos Sensibles y Timeline"
      subtitle="Patrones estandarizados para módulos operativos, registros y auditoría."
    />

    <IntegrityCard
      title="IntegrityDataTable + IntegritySensitiveCell"
      subtitle="Haz clic en una CLABE enmascarada para revelarla con confirmación."
      padding="none"
    >
      <template #actions>
        <IntegrityButton
          size="sm"
          variant="outline"
          @click="loadingDemo = !loadingDemo"
        >
          {{ loadingDemo ? 'Detener carga' : 'Simular carga' }}
        </IntegrityButton>
      </template>

      <div class="p-4 border-b border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <IntegrityInput
          v-model="search"
          placeholder="Buscar por folio o cliente…"
          icon="i-heroicons-magnifying-glass"
        />
        <IntegritySelect
          v-model="statusFilter"
          :options="[
            { label: 'Todos los estatus', value: 'all' },
            { label: 'Operacional', value: 'ok' },
            { label: 'Pendiente', value: 'warn' },
            { label: 'Rechazado', value: 'err' },
          ]"
        />
        <div class="flex items-center sm:justify-end">
          <IntegrityButton
            size="sm"
            variant="ghost"
            @click="search = ''; statusFilter = 'all'"
          >
            Limpiar filtros
          </IntegrityButton>
        </div>
      </div>

      <IntegrityDataTable
        :columns="columns"
        :rows="filteredRows"
        :loading="loadingDemo"
      >
        <template #cell-clabe="{ row }">
          <IntegritySensitiveCell
            :value="String(row.clabe)"
            :reveal-key="`demo-clabe-${row.id}`"
            label="número CLABE"
            require-confirm
          />
        </template>
      </IntegrityDataTable>
    </IntegrityCard>

    <IntegrityCard
      title="IntegrityTimeline"
      subtitle="Línea de tiempo vertical para trazabilidad de procesos, APIs y auditoría."
    >
      <IntegrityTimeline :events="events" />
    </IntegrityCard>
  </div>
</template>
