<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, useId, watch } from 'vue'
import type { IntegritySelectOption } from '../types/ui'

const model = defineModel<string>({ default: '' })

const props = withDefaults(defineProps<{
  label?: string
  options: IntegritySelectOption[]
  placeholder?: string
  searchPlaceholder?: string
  searchable?: boolean
  hint?: string
  error?: string
  disabled?: boolean
  required?: boolean
  emptyText?: string
  id?: string
}>(), {
  label: undefined,
  placeholder: 'Selecciona una opción…',
  searchPlaceholder: 'Buscar opción…',
  searchable: false,
  hint: undefined,
  error: undefined,
  disabled: false,
  required: false,
  emptyText: 'Sin coincidencias.',
  id: undefined,
})

const generatedId = useId()
const selectId = computed(() => props.id ?? generatedId)
const rootRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLButtonElement | null>(null)
const searchInputRef = ref<HTMLInputElement | null>(null)

const isOpen = shallowRef(false)
const query = shallowRef('')
const activeIndex = shallowRef(-1)

const selectedOption = computed(() =>
  props.options.find(opt => opt.value === model.value),
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

const showSearch = computed(() => props.searchable || props.options.length > 8)

watch(isOpen, async (open) => {
  if (open) {
    query.value = ''
    const currentIdx = props.options.findIndex(opt => opt.value === model.value && !opt.disabled)
    activeIndex.value = currentIdx >= 0 ? currentIdx : props.options.findIndex(opt => !opt.disabled)
    if (showSearch.value) {
      await nextTick()
      searchInputRef.value?.focus()
    }
  }
})

watch(query, () => {
  activeIndex.value = filteredOptions.value.findIndex(opt => !opt.disabled)
})

function openDropdown() {
  if (props.disabled) return
  isOpen.value = true
}

function closeDropdown(restoreFocus = false) {
  isOpen.value = false
  if (restoreFocus) {
    triggerRef.value?.focus()
  }
}

function toggleDropdown() {
  if (props.disabled) return
  if (isOpen.value) {
    closeDropdown(false)
  } else {
    openDropdown()
  }
}

function selectOption(option: IntegritySelectOption) {
  if (props.disabled || option.disabled) return
  model.value = option.value
  closeDropdown(true)
}

function moveActive(direction: 1 | -1) {
  const list = filteredOptions.value
  if (!list.length) return
  const len = list.length
  let idx = activeIndex.value
  for (let i = 0; i < len; i++) {
    idx = (idx + direction + len) % len
    if (!list[idx]?.disabled) {
      activeIndex.value = idx
      return
    }
  }
}

function onKeydown(event: KeyboardEvent) {
  if (props.disabled) return

  if (!isOpen.value) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openDropdown()
    }
    return
  }

  if (event.key === 'Escape') {
    event.preventDefault()
    closeDropdown(true)
  } else if (event.key === 'ArrowDown') {
    event.preventDefault()
    moveActive(1)
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    moveActive(-1)
  } else if (event.key === 'Home') {
    event.preventDefault()
    activeIndex.value = filteredOptions.value.findIndex(opt => !opt.disabled)
  } else if (event.key === 'End') {
    event.preventDefault()
    for (let i = filteredOptions.value.length - 1; i >= 0; i--) {
      if (!filteredOptions.value[i]?.disabled) {
        activeIndex.value = i
        break
      }
    }
  } else if (event.key === 'Enter') {
    const candidate = filteredOptions.value[activeIndex.value]
    if (candidate && !candidate.disabled) {
      event.preventDefault()
      selectOption(candidate)
    }
  } else if (event.key === 'Tab') {
    closeDropdown(false)
  }
}

function onDocumentClick(event: MouseEvent) {
  if (!isOpen.value || !rootRef.value) return
  if (!rootRef.value.contains(event.target as Node)) {
    closeDropdown(false)
  }
}

onMounted(() => {
  if (!import.meta.client) return
  document.addEventListener('mousedown', onDocumentClick)
})

onBeforeUnmount(() => {
  if (!import.meta.client) return
  document.removeEventListener('mousedown', onDocumentClick)
})
</script>

<template>
  <div ref="rootRef" class="relative w-full" @keydown="onKeydown">
    <label
      v-if="label"
      :for="selectId"
      class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-0.5">*</span>
    </label>

    <!-- Native hidden input for form required validation -->
    <input
      v-if="required"
      type="text"
      :value="model"
      required
      tabindex="-1"
      aria-hidden="true"
      class="sr-only pointer-events-none"
    />

    <button
      :id="selectId"
      ref="triggerRef"
      type="button"
      role="combobox"
      :aria-expanded="isOpen"
      :aria-controls="`${selectId}-listbox`"
      aria-haspopup="listbox"
      :aria-invalid="Boolean(error)"
      :disabled="disabled"
      :class="[
        'flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors',
        'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-0',
        error
          ? 'border-red-400 focus-visible:border-red-500 focus-visible:ring-red-500/20 dark:border-red-700'
          : isOpen
            ? 'border-accent ring-2 ring-accent/20'
            : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 focus-visible:border-accent focus-visible:ring-accent/20',
        disabled ? 'opacity-60 cursor-not-allowed bg-slate-50 dark:bg-slate-800/60' : 'cursor-pointer',
      ]"
      @click="toggleDropdown"
    >
      <span class="flex items-center gap-2 min-w-0 flex-1">
        <span
          v-if="selectedOption"
          class="truncate text-slate-900 dark:text-slate-100"
        >
          {{ selectedOption.label }}
        </span>
        <span
          v-else
          class="truncate text-slate-400 dark:text-slate-500"
        >
          {{ placeholder }}
        </span>
        <span
          v-if="selectedOption?.meta"
          class="shrink-0 rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-slate-500 dark:text-slate-400"
        >
          {{ selectedOption.meta }}
        </span>
      </span>

      <Icon
        name="i-heroicons-chevron-up-down"
        :class="[
          'h-4 w-4 shrink-0 text-slate-400 transition-colors',
          isOpen ? 'text-accent dark:text-brand-300' : '',
        ]"
      />
    </button>

    <Transition name="integrity-select-pop">
      <div
        v-if="isOpen"
        :id="`${selectId}-listbox`"
        role="listbox"
        class="absolute left-0 right-0 z-50 mt-1.5 overflow-hidden rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg ring-1 ring-slate-950/5 dark:ring-white/5"
      >
        <div
          v-if="showSearch"
          class="border-b border-slate-100 dark:border-zinc-800 p-2"
        >
          <div class="relative">
            <Icon
              name="i-heroicons-magnifying-glass"
              class="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400"
            />
            <input
              ref="searchInputRef"
              v-model="query"
              type="text"
              :placeholder="searchPlaceholder"
              class="block w-full rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950 pl-8 pr-2.5 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              @click.stop
            />
          </div>
        </div>

        <div class="max-h-60 overflow-y-auto scrollbar-thin p-1.5 space-y-0.5">
          <div
            v-if="!filteredOptions.length"
            class="px-3 py-5 text-center text-xs text-slate-500 dark:text-zinc-400"
          >
            {{ emptyText }}
          </div>

          <button
            v-for="(opt, idx) in filteredOptions"
            v-else
            :key="opt.value"
            type="button"
            role="option"
            :aria-selected="opt.value === model"
            :disabled="opt.disabled"
            :class="[
              'flex w-full items-center justify-between gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors',
              opt.disabled
                ? 'opacity-45 cursor-not-allowed text-slate-400 dark:text-zinc-600'
                : 'cursor-pointer',
              !opt.disabled && opt.value === model
                ? 'bg-brand-50/90 dark:bg-brand-950/70 text-accent dark:text-brand-200 font-medium'
                : !opt.disabled && idx === activeIndex
                  ? 'bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-slate-100'
                  : !opt.disabled
                    ? 'text-slate-700 dark:text-zinc-200 hover:bg-slate-100/80 dark:hover:bg-zinc-800/80'
                    : '',
            ]"
            @mouseenter="!opt.disabled && (activeIndex = idx)"
            @click="selectOption(opt)"
          >
            <span class="min-w-0 flex-1">
              <span class="block truncate leading-snug">{{ opt.label }}</span>
              <span
                v-if="opt.description"
                class="block truncate text-[11px] font-normal text-slate-500 dark:text-zinc-400 mt-0.5"
              >
                {{ opt.description }}
              </span>
            </span>

            <span class="flex items-center gap-2 shrink-0">
              <span
                v-if="opt.meta"
                class="font-mono text-[10px] text-slate-400 dark:text-zinc-500"
              >
                {{ opt.meta }}
              </span>
              <Icon
                v-if="opt.value === model"
                name="i-heroicons-check"
                class="h-4 w-4 text-accent dark:text-brand-300"
              />
            </span>
          </button>
        </div>
      </div>
    </Transition>

    <p v-if="error" class="mt-1 text-xs text-red-600 dark:text-red-400">
      {{ error }}
    </p>
    <p v-else-if="hint" class="mt-1 text-xs text-slate-500 dark:text-slate-400">
      {{ hint }}
    </p>
  </div>
</template>

<style scoped>
.integrity-select-pop-enter-active,
.integrity-select-pop-leave-active {
  transition: opacity 0.14s ease, transform 0.14s ease;
  transform-origin: top center;
}

.integrity-select-pop-enter-from,
.integrity-select-pop-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}
</style>
