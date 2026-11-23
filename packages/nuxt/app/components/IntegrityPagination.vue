<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, useId } from 'vue'
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
const sizeMenuRef = ref<HTMLElement | null>(null)
const sizeMenuOpen = shallowRef(false)

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

function selectPageSize(next: number) {
  if (props.disabled) return
  sizeMenuOpen.value = false
  if (next > 0 && next !== pageSize.value) {
    pageSize.value = next
    page.value = 1
  }
}

function onDocumentClick(event: MouseEvent) {
  if (!sizeMenuOpen.value || !sizeMenuRef.value) return
  if (!sizeMenuRef.value.contains(event.target as Node)) {
    sizeMenuOpen.value = false
  }
}

function onDocumentKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && sizeMenuOpen.value) {
    sizeMenuOpen.value = false
  }
}

onMounted(() => {
  if (!import.meta.client) return
  document.addEventListener('mousedown', onDocumentClick)
  document.addEventListener('keydown', onDocumentKeydown)
})

onBeforeUnmount(() => {
  if (!import.meta.client) return
  document.removeEventListener('mousedown', onDocumentClick)
  document.removeEventListener('keydown', onDocumentKeydown)
})
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

      <div v-if="showPageSize" ref="sizeMenuRef" class="relative flex items-center gap-2">
        <label :for="selectId" class="text-slate-500 dark:text-slate-400 whitespace-nowrap">
          Por página
        </label>
        <button
          :id="selectId"
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          :aria-expanded="sizeMenuOpen"
          :disabled="disabled"
          :class="[
            'page-size-select justify-between rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 tabular-nums transition-colors',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/20 disabled:opacity-50',
            sizeMenuOpen
              ? 'border-accent ring-2 ring-accent/20'
              : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600',
          ]"
          @click="sizeMenuOpen = !sizeMenuOpen"
        >
          <span>{{ pageSize }}</span>
          <Icon name="i-heroicons-chevron-up-down" class="h-3.5 w-3.5 text-slate-400 shrink-0" />
        </button>

        <Transition name="integrity-pagesize-pop">
          <div
            v-if="sizeMenuOpen"
            role="listbox"
            class="absolute bottom-full right-0 z-50 mb-1.5 min-w-[4.75rem] rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-1 shadow-lg ring-1 ring-slate-950/5 dark:ring-white/5"
          >
            <button
              v-for="size in pageSizeOptions"
              :key="size"
              type="button"
              role="option"
              :aria-selected="size === pageSize"
              :class="[
                'flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-xs tabular-nums transition-colors',
                size === pageSize
                  ? 'bg-brand-50 dark:bg-brand-950/70 text-accent dark:text-brand-200 font-semibold'
                  : 'text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800',
              ]"
              @click="selectPageSize(size)"
            >
              <span>{{ size }}</span>
              <Icon v-if="size === pageSize" name="i-heroicons-check" class="h-3.5 w-3.5 text-accent dark:text-brand-300" />
            </button>
          </div>
        </Transition>
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

<style scoped>
.integrity-pagesize-pop-enter-active,
.integrity-pagesize-pop-leave-active {
  transition: opacity 0.14s ease, transform 0.14s ease;
  transform-origin: bottom right;
}

.integrity-pagesize-pop-enter-from,
.integrity-pagesize-pop-leave-to {
  opacity: 0;
  transform: translateY(4px) scale(0.97);
}
</style>
