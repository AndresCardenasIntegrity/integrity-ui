<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import type { IntegrityTabItem } from '../types/ui'

const active = defineModel<string>({ default: '' })

const props = withDefaults(defineProps<{
  items: IntegrityTabItem[]
  variant?: 'underline' | 'pills'
  size?: 'sm' | 'md'
  fullWidth?: boolean
  ariaLabel?: string
}>(), {
  variant: 'underline',
  size: 'md',
  fullWidth: false,
  ariaLabel: 'Pestañas',
})

const baseId = useId()
const tabRefs = ref<HTMLButtonElement[]>([])

const activeValue = computed(() => {
  if (active.value && props.items.some(item => item.value === active.value)) {
    return active.value
  }
  return props.items.find(item => !item.disabled)?.value ?? ''
})

function selectTab(item: IntegrityTabItem) {
  if (item.disabled) return
  active.value = item.value
}

function onKeydown(event: KeyboardEvent, currentIndex: number) {
  const enabledIndices = props.items
    .map((item, idx) => (item.disabled ? -1 : idx))
    .filter(idx => idx !== -1)

  if (!enabledIndices.length) return

  const pos = enabledIndices.indexOf(currentIndex)
  let nextIdx: number | null = null

  if (event.key === 'ArrowRight') {
    nextIdx = enabledIndices[(pos + 1) % enabledIndices.length] ?? null
  } else if (event.key === 'ArrowLeft') {
    nextIdx = enabledIndices[(pos - 1 + enabledIndices.length) % enabledIndices.length] ?? null
  } else if (event.key === 'Home') {
    nextIdx = enabledIndices[0] ?? null
  } else if (event.key === 'End') {
    nextIdx = enabledIndices[enabledIndices.length - 1] ?? null
  }

  if (nextIdx !== null) {
    event.preventDefault()
    const target = props.items[nextIdx]
    if (target) {
      active.value = target.value
      tabRefs.value[nextIdx]?.focus()
    }
  }
}

const sizeClass = computed(() =>
  props.size === 'sm' ? 'px-3 py-1.5 text-xs gap-1.5' : 'px-3.5 py-2 text-sm gap-2',
)
</script>

<template>
  <div class="w-full">
    <div
      role="tablist"
      :aria-label="ariaLabel"
      :class="[
        'flex items-center overflow-x-auto scrollbar-hidden',
        variant === 'underline'
          ? 'border-b border-slate-200 dark:border-slate-800 gap-1'
          : 'inline-flex rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 gap-1',
        fullWidth ? 'w-full' : '',
      ]"
    >
      <button
        v-for="(item, idx) in items"
        :id="`${baseId}-tab-${item.value}`"
        :key="item.value"
        ref="tabRefs"
        type="button"
        role="tab"
        :aria-selected="activeValue === item.value"
        :aria-controls="`${baseId}-panel-${item.value}`"
        :tabindex="activeValue === item.value ? 0 : -1"
        :disabled="item.disabled"
        :class="[
          'inline-flex items-center justify-center font-medium whitespace-nowrap transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40',
          sizeClass,
          fullWidth ? 'flex-1' : '',
          item.disabled ? 'opacity-45 cursor-not-allowed' : 'cursor-pointer',
          variant === 'underline'
            ? [
                '-mb-px border-b-2',
                activeValue === item.value
                  ? 'border-accent text-accent dark:text-brand-300'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:border-slate-300 dark:hover:border-slate-700',
              ]
            : [
                'rounded-lg',
                activeValue === item.value
                  ? 'bg-white dark:bg-slate-800 text-accent dark:text-slate-50 shadow-subtle'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100',
              ],
        ]"
        @click="selectTab(item)"
        @keydown="onKeydown($event, idx)"
      >
        <Icon v-if="item.icon" :name="item.icon" class="h-4 w-4 shrink-0" />
        <span>{{ item.label }}</span>
        <span
          v-if="item.badge !== undefined && item.badge !== ''"
          :class="[
            'inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none tabular-nums',
            activeValue === item.value
              ? 'bg-brand-50 text-accent dark:bg-brand-900/70 dark:text-brand-200'
              : 'bg-slate-200/80 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
          ]"
        >
          {{ item.badge }}
        </span>
      </button>
    </div>

    <div
      v-if="$slots.default || $slots[`panel-${activeValue}`]"
      :id="`${baseId}-panel-${activeValue}`"
      role="tabpanel"
      :aria-labelledby="`${baseId}-tab-${activeValue}`"
      class="pt-4"
    >
      <slot :name="`panel-${activeValue}`" :active="activeValue">
        <slot :active="activeValue" />
      </slot>
    </div>
  </div>
</template>
