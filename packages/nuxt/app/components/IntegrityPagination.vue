<script setup lang="ts">
import { computed, useId } from 'vue'
import { computePaginationRange, getPaginationBounds } from '../utils/pagination'

const page = defineModel<number>('page', { default: 1 })
const pageSize = defineModel<number>('pageSize', { default: 10 })

const props = withDefaults(defineProps<{
  total: number
  pageSizeOptions?: number[]
  showPageSize?: boolean
  showSummary?: boolean
  itemLabel?: string
  siblingCount?: number
  disabled?: boolean
}>(), {
  pageSizeOptions: () => [10, 20, 50, 100],
  showPageSize: true,
  showSummary: true,
  itemLabel: 'registros',
  siblingCount: 1,
  disabled: false,
})

const selectId = useId()

const bounds = computed(() => getPaginationBounds(page.value, pageSize.value, props.total))

const tokens = computed(() =>
  computePaginationRange(bounds.value.page, bounds.value.totalPages, props.siblingCount),
)

const canPrev = computed(() => !props.disabled && bounds.value.page > 1)
const canNext = computed(() => !props.disabled && bounds.value.page < bounds.value.totalPages)

function goTo(target: number) {
  if (props.disabled) return
  const clamped = Math.min(Math.max(1, target), bounds.value.totalPages)
  if (clamped !== page.value) {
    page.value = clamped
  }
}

function onPageSizeChange(event: Event) {
  const next = Number((event.target as HTMLSelectElement).value)
  if (!Number.isNaN(next) && next > 0) {
    pageSize.value = next
    page.value = 1
  }
}
</script>

<template>
  <nav
    aria-label="Paginación"
    class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-xs text-slate-600 dark:text-slate-400"
  >
    <div class="flex flex-wrap items-center gap-3">
      <p v-if="showSummary" class="tabular-nums">
        <template v-if="total > 0">
          Mostrando
          <span class="font-semibold text-slate-900 dark:text-slate-100">{{ bounds.from }}–{{ bounds.to }}</span>
          de
          <span class="font-semibold text-slate-900 dark:text-slate-100">{{ total.toLocaleString('es-MX') }}</span>
          {{ itemLabel }}
        </template>
        <template v-else>
          0 {{ itemLabel }}
        </template>
      </p>

      <div v-if="showPageSize" class="flex items-center gap-2">
        <label :for="selectId" class="text-slate-500 dark:text-slate-400 whitespace-nowrap">
          Por página
        </label>
        <select
          :id="selectId"
          :value="pageSize"
          :disabled="disabled"
          class="page-size-select rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-50"
          @change="onPageSizeChange"
        >
          <option v-for="size in pageSizeOptions" :key="size" :value="size">
            {{ size }}
          </option>
        </select>
      </div>
    </div>

    <div class="flex items-center gap-1 self-start sm:self-auto">
      <button
        type="button"
        aria-label="Página anterior"
        :disabled="!canPrev"
        class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
        @click="goTo(bounds.page - 1)"
      >
        <Icon name="i-heroicons-chevron-left" class="h-4 w-4" />
      </button>

      <template v-for="(token, idx) in tokens" :key="`${token}-${idx}`">
        <span
          v-if="token === 'ellipsis'"
          class="inline-flex h-8 w-7 items-center justify-center text-slate-400 select-none"
          aria-hidden="true"
        >
          …
        </span>
        <button
          v-else
          type="button"
          :disabled="disabled"
          :aria-current="token === bounds.page ? 'page' : undefined"
          :class="[
            'inline-flex h-8 min-w-8 px-2 items-center justify-center rounded-lg text-xs font-medium tabular-nums transition-colors',
            token === bounds.page
              ? 'bg-accent text-white shadow-subtle'
              : 'border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800',
            disabled ? 'opacity-50 pointer-events-none' : '',
          ]"
          @click="goTo(token)"
        >
          {{ token }}
        </button>
      </template>

      <button
        type="button"
        aria-label="Página siguiente"
        :disabled="!canNext"
        class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
        @click="goTo(bounds.page + 1)"
      >
        <Icon name="i-heroicons-chevron-right" class="h-4 w-4" />
      </button>
    </div>
  </nav>
</template>
