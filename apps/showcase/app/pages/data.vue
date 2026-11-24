<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue'
import type { IntegrityTableColumn, IntegrityTimelineEvent } from '@integritysoftwarela/integrity-ui-nuxt/app/types/ui'

const search = shallowRef('')
const statusFilter = shallowRef('all')
const loadingDemo = shallowRef(false)
const statsLoading = shallowRef(false)
const page = shallowRef(1)
const pageSize = shallowRef(4)

watch([search, statusFilter], () => {
  page.value = 1
})

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
  { id: 5, folio: 'SOL-2026-0146', cliente: 'Energía Central MX', clabe: '044180221908374622', estatus: 'ok', monto: 63800, actualizado: '2026-11-23T09:42:00Z' },
  { id: 6, folio: 'SOL-2026-0147', cliente: 'Comercializadora Andina', clabe: '021180998172635401', estatus: 'warn', monto: 31200, actualizado: '2026-11-23T09:15:00Z' },
  { id: 7, folio: 'SOL-2026-0148', cliente: 'Constructora del Valle', clabe: '012180771625344510', estatus: 'ok', monto: 215000, actualizado: '2026-11-23T08:50:00Z' },
  { id: 8, folio: 'SOL-2026-0149', cliente: 'Fintech Enlace Digital', clabe: '072180550192837465', estatus: 'ok', monto: 84900, actualizado: '2026-11-23T08:12:00Z' },
]

const filteredRows = computed(() => {
  const q = search.value.trim().toLowerCase()
  return allRows.filter((row) => {
    const matchStatus = statusFilter.value === 'all' || row.estatus === statusFilter.value
    const matchQuery = !q || row.folio.toLowerCase().includes(q) || row.cliente.toLowerCase().includes(q)
    return matchStatus && matchQuery
  })
})

const paginatedRows = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filteredRows.value.slice(start, start + pageSize.value)
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
      title="KPIs, Tablas, Paginación y Timeline"
      subtitle="Patrones estandarizados para módulos operativos, registros y auditoría."
    >
      <template #actions>
        <IntegrityButton size="sm" variant="outline" @click="statsLoading = !statsLoading">
          {{ statsLoading ? 'Mostrar KPIs' : 'Simular Skeleton KPIs' }}
        </IntegrityButton>
      </template>
    </IntegrityPageHeader>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <IntegrityStatCard
        label="Solicitudes procesadas"
        :value="1482"
        delta="+12.4%"
        delta-tone="operational"
        trend="up"
        icon="i-heroicons-document-check"
        tone="brand"
        hint="vs mes anterior"
        :loading="statsLoading"
      />
      <IntegrityStatCard
        label="Disponibilidad API"
        value="99.96%"
        delta="Operacional"
        delta-tone="operational"
        trend="flat"
        icon="i-heroicons-signal"
        tone="operational"
        :loading="statsLoading"
      />
      <IntegrityStatCard
        label="Pendientes de revisión"
        :value="14"
        delta="+3 hoy"
        delta-tone="degraded"
        trend="up"
        icon="i-heroicons-clock"
        tone="degraded"
        :loading="statsLoading"
      />
      <IntegrityStatCard
        label="Rechazos críticos"
        :value="2"
        delta="-50%"
        delta-tone="operational"
        trend="down"
        icon="i-heroicons-exclamation-triangle"
        tone="down"
        :loading="statsLoading"
      />
    </div>

    <IntegrityCard
      title="IntegrityDataTable + IntegritySensitiveCell + IntegrityPagination"
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
        :rows="paginatedRows"
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

      <template #footer>
        <IntegrityPagination
          v-model:page="page"
          v-model:page-size="pageSize"
          :total="filteredRows.length"
          :page-size-options="[4, 8, 20]"
          item-label="solicitudes"
        />
      </template>
    </IntegrityCard>

    <IntegrityCard
      title="IntegrityTimeline"
      subtitle="Línea de tiempo vertical para trazabilidad de procesos, APIs y auditoría."
    >
      <IntegrityTimeline :events="events" />
    </IntegrityCard>
  </div>
</template>
