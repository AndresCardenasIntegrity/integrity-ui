<script setup lang="ts">
import { computed } from 'vue'
import type { IntegrityBadgeTone } from '../types/ui'

const props = withDefaults(defineProps<{
  tone?: IntegrityBadgeTone
  size?: 'sm' | 'md'
  dot?: boolean
  pill?: boolean
}>(), {
  tone: 'neutral',
  size: 'sm',
  dot: false,
  pill: true,
})

const toneStyles = computed(() => {
  const map: Record<IntegrityBadgeTone, { box: string; dot: string }> = {
    brand: {
      box: 'bg-brand-50 text-brand-700 border-brand-200 dark:bg-brand-900/60 dark:text-brand-200 dark:border-brand-700/60',
      dot: 'bg-brand-600 dark:bg-brand-300',
    },
    operational: {
      box: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800/70',
      dot: 'bg-operational',
    },
    degraded: {
      box: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800/70',
      dot: 'bg-degraded',
    },
    down: {
      box: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/70 dark:text-red-300 dark:border-red-800/70',
      dot: 'bg-down',
    },
    maintenance: {
      box: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/70 dark:text-indigo-300 dark:border-indigo-800/70',
      dot: 'bg-maintenance',
    },
    info: {
      box: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/70 dark:text-sky-300 dark:border-sky-800/70',
      dot: 'bg-sky-500',
    },
    neutral: {
      box: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
      dot: 'bg-slate-400',
    },
  }
  return map[props.tone]
})

const sizeClass = computed(() =>
  props.size === 'md' ? 'px-2.5 py-1 text-xs gap-1.5' : 'px-2 py-0.5 text-[11px] gap-1.5',
)
</script>

<template>
  <span
    :class="[
      'inline-flex items-center font-semibold border whitespace-nowrap leading-tight',
      pill ? 'rounded-full' : 'rounded-md',
      sizeClass,
      toneStyles.box,
    ]"
  >
    <span v-if="dot" class="h-1.5 w-1.5 rounded-full shrink-0" :class="toneStyles.dot" aria-hidden="true" />
    <slot />
  </span>
</template>
