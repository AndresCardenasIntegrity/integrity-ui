<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, useId, watch } from 'vue'
import type { IntegrityMultiSelectOption } from '../types/ui'

const model = defineModel<string[]>({ default: () => [] })

const props = withDefaults(defineProps<{
  options: IntegrityMultiSelectOption[]
  label?: string
  placeholder?: string
  searchPlaceholder?: string
  hint?: string
  error?: string
  disabled?: boolean
  required?: boolean
  maxSelections?: number
  emptyText?: string
  loading?: boolean
  id?: string
}>(), {
  label: undefined,
  placeholder: 'Selecciona una o más opciones…',
  searchPlaceholder: 'Buscar por nombre, correo o código…',
  hint: undefined,
  error: undefined,
  disabled: false,
  required: false,
  maxSelections: undefined,
  emptyText: 'No se encontraron coincidencias.',
  loading: false,
  id: undefined,
})

const emit = defineEmits<{
  search: [query: string]
}>()

const generatedId = useId()
const fieldId = computed(() => props.id ?? generatedId)
const rootRef = ref<HTMLElement | null>(null)
const searchInputRef = ref<HTMLInputElement | null>(null)
const isOpen = shallowRef(false)
const query = shallowRef('')

watch(query, (val) => {
  emit('search', val)
})

const selectedSet = computed(() => new Set(model.value))

const optionByValue = computed(() => {
  const map = new Map<string, IntegrityMultiSelectOption>()
  for (const opt of props.options) {
    map.set(opt.value, opt)
  }
  return map
})

const selectedOptions = computed(() =>
  model.value.map(value => optionByValue.value.get(value) ?? { value, label: value }),
)

const filteredOptions = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return props.options
  return props.options.filter(opt =>
    [opt.label, opt.description, opt.meta, opt.value]
      .filter(Boolean)
      .some(field => String(field).toLowerCase().includes(q)),
  )
})

const reachedMax = computed(() =>
  props.maxSelections !== undefined && model.value.length >= props.maxSelections,
)

function toggleOption(option: IntegrityMultiSelectOption) {
  if (props.disabled || option.disabled) return
  if (selectedSet.value.has(option.value)) {
    model.value = model.value.filter(v => v !== option.value)
    return
  }
  if (reachedMax.value) return
  model.value = [...model.value, option.value]
}

function removeValue(value: string) {
  if (props.disabled) return
  model.value = model.value.filter(v => v !== value)
}

function clearAll() {
  if (props.disabled) return
  model.value = []
}

function toggleDropdown() {
  if (props.disabled) return
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    setTimeout(() => searchInputRef.value?.focus(), 0)
  }
}

function closeDropdown() {
  isOpen.value = false
}

function onDocumentClick(event: MouseEvent) {
  if (!isOpen.value || !rootRef.value) return
  if (!rootRef.value.contains(event.target as Node)) {
    closeDropdown()
  }
}

function onDocumentKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && isOpen.value) {
    closeDropdown()
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
  <div ref="rootRef" class="relative w-full">
    <div v-if="label" class="flex items-center justify-between gap-2 mb-1.5">
      <label :for="fieldId" class="block text-xs font-medium text-slate-700 dark:text-slate-300">
        {{ label }}
        <span v-if="required" class="text-red-500 ml-0.5">*</span>
      </label>
      <span v-if="model.length" class="text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
        {{ model.length }}<template v-if="maxSelections"> / {{ maxSelections }}</template> seleccionados
      </span>
    </div>

    <div
      :id="fieldId"
      role="combobox"
      :aria-expanded="isOpen"
      :aria-controls="`${fieldId}-listbox`"
      :aria-disabled="disabled"
      :aria-invalid="Boolean(error)"
      tabindex="0"
      :class="[
        'flex min-h-[2.375rem] w-full items-center justify-between gap-2 rounded-lg border px-2.5 py-1.5 text-sm transition-colors cursor-pointer',
        'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100',
        'focus:outline-none focus:ring-2 focus:ring-offset-0',
        error
          ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20 dark:border-red-700'
          : isOpen
            ? 'border-accent ring-2 ring-accent/20'
            : 'border-slate-300 dark:border-slate-700 focus:border-accent focus:ring-accent/20',
        disabled ? 'opacity-60 cursor-not-allowed bg-slate-50 dark:bg-slate-800/60' : '',
      ]"
      @click="toggleDropdown"
      @keydown.enter.prevent="toggleDropdown"
      @keydown.space.prevent="toggleDropdown"
    >
      <div class="flex flex-wrap items-center gap-1.5 flex-1 min-w-0">
        <span
          v-for="item in selectedOptions"
          :key="item.value"
          class="inline-flex items-center gap-1 max-w-full rounded-md border border-brand-200 dark:border-brand-700/60 bg-brand-50 dark:bg-brand-900/50 px-2 py-0.5 text-xs font-medium text-brand-800 dark:text-brand-200"
        >
          <span class="truncate">{{ item.label }}</span>
          <button
            v-if="!disabled"
            type="button"
            :aria-label="`Quitar ${item.label}`"
            class="rounded p-0.5 text-brand-600/80 hover:text-brand-900 dark:text-brand-300 dark:hover:text-white transition-colors"
            @click.stop="removeValue(item.value)"
          >
            <Icon name="i-heroicons-x-mark" class="h-3 w-3" />
          </button>
        </span>
        <span
          v-if="!selectedOptions.length"
          class="px-0.5 text-sm text-slate-400 dark:text-slate-500 truncate"
        >
          {{ placeholder }}
        </span>
      </div>

      <div class="flex items-center gap-1 shrink-0">
        <button
          v-if="model.length && !disabled"
          type="button"
          aria-label="Limpiar selección"
          class="rounded p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          @click.stop="clearAll"
        >
          <Icon name="i-heroicons-x-circle" class="h-4 w-4" />
        </button>
        <Icon
          name="i-heroicons-chevron-down"
          :class="['h-4 w-4 text-slate-400 transition-transform', isOpen ? 'rotate-180' : '']"
        />
      </div>
    </div>

    <div
      v-if="isOpen"
      :id="`${fieldId}-listbox`"
      role="listbox"
      aria-multiselectable="true"
      class="absolute left-0 right-0 z-50 mt-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg overflow-hidden"
    >
      <div class="p-2 border-b border-slate-100 dark:border-slate-800">
        <div class="relative">
          <Icon
            name="i-heroicons-magnifying-glass"
            class="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
          />
          <input
            ref="searchInputRef"
            v-model="query"
            type="text"
            :placeholder="searchPlaceholder"
            class="block w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            @click.stop
          />
        </div>
      </div>

      <div class="max-h-60 overflow-y-auto scrollbar-thin p-1.5">
        <div v-if="loading" class="px-3 py-5 text-center text-xs text-slate-500 dark:text-slate-400">
          Buscando opciones…
        </div>
        <div v-else-if="!filteredOptions.length" class="px-3 py-5 text-center text-xs text-slate-500 dark:text-slate-400">
          {{ emptyText }}
        </div>
        <button
          v-for="opt in filteredOptions"
          v-else
          :key="opt.value"
          type="button"
          role="option"
          :aria-selected="selectedSet.has(opt.value)"
          :disabled="opt.disabled || (!selectedSet.has(opt.value) && reachedMax)"
          :class="[
            'flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors',
            selectedSet.has(opt.value)
              ? 'bg-brand-50/80 dark:bg-brand-950/60 text-slate-900 dark:text-slate-50'
              : 'hover:bg-slate-50 dark:hover:bg-slate-800/70 text-slate-700 dark:text-slate-200',
            opt.disabled || (!selectedSet.has(opt.value) && reachedMax)
              ? 'opacity-45 cursor-not-allowed'
              : 'cursor-pointer',
          ]"
          @click.stop="toggleOption(opt)"
        >
          <span
            :class="[
              'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors',
              selectedSet.has(opt.value)
                ? 'border-accent bg-accent text-white'
                : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900',
            ]"
            aria-hidden="true"
          >
            <Icon v-if="selectedSet.has(opt.value)" name="i-heroicons-check" class="h-3 w-3" />
          </span>
          <span class="min-w-0 flex-1">
            <span class="block text-xs font-medium truncate">{{ opt.label }}</span>
            <span v-if="opt.description" class="block text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {{ opt.description }}
            </span>
          </span>
          <span
            v-if="opt.meta"
            class="shrink-0 font-mono text-[10px] text-slate-400 dark:text-slate-500 pt-0.5"
          >
            {{ opt.meta }}
          </span>
        </button>
      </div>

      <div
        v-if="maxSelections"
        class="flex items-center justify-between px-3 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 text-[11px] text-slate-500 dark:text-slate-400"
      >
        <span>Máximo {{ maxSelections }} elementos</span>
        <button
          type="button"
          class="font-medium text-accent dark:text-brand-300 hover:underline"
          @click.stop="closeDropdown"
        >
          Listo
        </button>
      </div>
    </div>

    <p v-if="error" class="mt-1 text-xs text-red-600 dark:text-red-400">
      {{ error }}
    </p>
    <p v-else-if="hint" class="mt-1 text-xs text-slate-500 dark:text-slate-400">
      {{ hint }}
    </p>
  </div>
</template>
