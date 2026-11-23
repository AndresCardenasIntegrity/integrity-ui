<script setup lang="ts">
import { computed } from 'vue'
import type { IntegrityBadgeTone } from '../types/ui'

const props = withDefaults(defineProps<{
  label: string
  value: string | number
  delta?: string
  deltaTone?: IntegrityBadgeTone
  trend?: 'up' | 'down' | 'flat'
  icon?: string
  tone?: IntegrityBadgeTone
  hint?: string
  loading?: boolean
}>(), {
  delta: undefined,
  deltaTone: 'neutral',
  trend: undefined,
  icon: undefined,
  tone: 'brand',
  hint: undefined,
  loading: false,
})

const iconBoxClass = computed(() => {
  const map: Record<IntegrityBadgeTone, string> = {
    brand: 'bg-brand-50 text-accent dark:bg-brand-950/70 dark:text-brand-300',
    operational: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/70 dark:text-emerald-400',
    degraded: 'bg-amber-50 text-amber-600 dark:bg-amber-950/70 dark:text-amber-400',
    down: 'bg-red-50 text-red-600 dark:bg-red-950/70 dark:text-red-400',
    maintenance: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/70 dark:text-indigo-400',
    info: 'bg-sky-50 text-sky-600 dark:bg-sky-950/70 dark:text-sky-400',
    neutral: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  }
  return map[props.tone]
})

const trendIcon = computed(() => {
  if (props.trend === 'up') return 'i-heroicons-arrow-trending-up'
  if (props.trend === 'down') return 'i-heroicons-arrow-trending-down'
  if (props.trend === 'flat') return 'i-heroicons-minus'
  return undefined
})

const formattedValue = computed(() => {
  if (typeof props.value === 'number') {
    return props.value.toLocaleString('es-MX')
  }
  return props.value
})
</script>

<template>
  <article class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-subtle">
    <div v-if="loading" class="space-y-3">
      <div class="flex items-center justify-between gap-3">
        <IntegritySkeleton variant="rect" width="45%" height="0.75rem" rounded="sm" />
        <IntegritySkeleton variant="rect" width="2.25rem" height="2.25rem" rounded="lg" />
      </div>
      <IntegritySkeleton variant="rect" width="55%" height="1.75rem" rounded="md" />
      <IntegritySkeleton variant="rect" width="38%" height="1.25rem" rounded="full" />
    </div>

    <template v-else>
      <div class="flex items-start justify-between gap-3">
        <p class="text-xs font-medium text-slate-500 dark:text-slate-400 leading-snug">
          {{ label }}
        </p>
        <span
          v-if="icon"
          :class="['flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', iconBoxClass]"
          aria-hidden="true"
        >
          <Icon :name="icon" class="h-5 w-5" />
        </span>
      </div>

      <p class="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 tabular-nums">
        {{ formattedValue }}
      </p>

      <div v-if="delta || hint || $slots.footer" class="mt-3 flex flex-wrap items-center gap-2">
        <IntegrityBadge v-if="delta" :tone="deltaTone" size="sm">
          <Icon v-if="trendIcon" :name="trendIcon" class="h-3.5 w-3.5 shrink-0" />
          {{ delta }}
        </IntegrityBadge>
        <span v-if="hint" class="text-xs text-slate-500 dark:text-slate-400">
          {{ hint }}
        </span>
        <slot name="footer" />
      </div>
    </template>
  </article>
</template>
