<script setup lang="ts">
import type { IntegrityBadgeTone, IntegrityTableColumn } from '../types/ui'

const props = withDefaults(defineProps<{
  columns: IntegrityTableColumn[]
  rows: Record<string, unknown>[]
  loading?: boolean
  rowKey?: string
  emptyTitle?: string
  emptyDescription?: string
  hoverable?: boolean
}>(), {
  loading: false,
  rowKey: 'id',
  emptyTitle: 'Sin registros',
  emptyDescription: 'Ajusta los filtros para ver resultados.',
  hoverable: true,
})

function resolveKey(row: Record<string, unknown>, index: number): string | number {
  const val = row[props.rowKey]
  if (typeof val === 'string' || typeof val === 'number') return val
  return index
}

function resolveTone(col: IntegrityTableColumn, value: unknown): IntegrityBadgeTone {
  const key = String(value ?? '')
  return col.tones?.[key] ?? 'neutral'
}

function alignClass(align?: 'left' | 'center' | 'right'): string {
  if (align === 'right') return 'text-right'
  if (align === 'center') return 'text-center'
  return 'text-left'
}

function formatDate(value: unknown): string {
  if (!value) return '—'
  try {
    return new Date(String(value)).toLocaleString('es-MX', {
      dateStyle: 'short',
      timeStyle: 'short',
    })
  } catch {
    return String(value)
  }
}

function formatNumber(value: unknown): string {
  if (value == null || value === '') return '—'
  const num = Number(value)
  return Number.isNaN(num) ? String(value) : num.toLocaleString('es-MX')
}
</script>

<template>
  <div class="overflow-x-auto scrollbar-thin">
    <div v-if="loading" class="py-12 flex justify-center">
      <IntegrityLogoLoader size="sm" label="Cargando registros…" />
    </div>

    <IntegrityEmptyState
      v-else-if="!rows.length"
      icon="i-heroicons-table-cells"
      :title="emptyTitle"
      :description="emptyDescription"
    >
      <template v-if="$slots.empty" #actions>
        <slot name="empty" />
      </template>
    </IntegrityEmptyState>

    <table v-else class="w-full border-collapse text-sm">
      <thead>
        <tr class="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <th
            v-for="col in columns"
            :key="col.key"
            class="px-4 py-3 whitespace-nowrap"
            :class="alignClass(col.align)"
          >
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-100 dark:divide-slate-800/80">
        <tr
          v-for="(row, idx) in rows"
          :key="resolveKey(row, idx)"
          :class="hoverable ? 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors' : ''"
        >
          <td
            v-for="col in columns"
            :key="col.key"
            class="px-4 py-3 max-w-[260px]"
            :class="alignClass(col.align)"
          >
            <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]" :column="col">
              <IntegrityBadge
                v-if="col.type === 'badge'"
                :tone="resolveTone(col, row[col.key])"
                dot
              >
                {{ col.map?.[String(row[col.key])] ?? row[col.key] ?? '—' }}
              </IntegrityBadge>

              <span
                v-else-if="col.type === 'boolean'"
                :class="row[col.key] ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'"
                class="font-medium"
              >
                {{ row[col.key] ? 'Sí' : 'No' }}
              </span>

              <span v-else-if="col.type === 'date'" class="text-slate-600 dark:text-slate-400 whitespace-nowrap">
                {{ formatDate(row[col.key]) }}
              </span>

              <span v-else-if="col.type === 'number'" class="tabular-nums text-slate-700 dark:text-slate-300">
                {{ formatNumber(row[col.key]) }}
              </span>

              <span v-else-if="col.type === 'mono'" class="font-mono text-xs text-slate-700 dark:text-slate-300">
                {{ row[col.key] ?? '—' }}
              </span>

              <span
                v-else
                class="block truncate text-slate-900 dark:text-slate-100"
                :title="String(row[col.key] ?? '')"
              >
                {{ row[col.key] ?? '—' }}
              </span>
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
