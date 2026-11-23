<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  title?: string
  subtitle?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hoverable?: boolean
}>(), {
  title: undefined,
  subtitle: undefined,
  padding: 'md',
  hoverable: false,
})

const bodyPaddingClass = computed(() => {
  const map = {
    none: '',
    sm: 'p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
  } as const
  return map[props.padding]
})
</script>

<template>
  <section
    :class="[
      'rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-subtle',
      hoverable ? 'transition-all hover:shadow-card hover:border-slate-300 dark:hover:border-slate-700' : '',
    ]"
  >
    <header
      v-if="title || subtitle || $slots.header || $slots.actions"
      class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800"
    >
      <div class="min-w-0">
        <slot name="header">
          <h3 v-if="title" class="text-sm font-semibold text-slate-900 dark:text-slate-50 truncate">
            {{ title }}
          </h3>
          <p v-if="subtitle" class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {{ subtitle }}
          </p>
        </slot>
      </div>
      <div v-if="$slots.actions" class="flex items-center gap-2 shrink-0">
        <slot name="actions" />
      </div>
    </header>

    <div :class="bodyPaddingClass">
      <slot />
    </div>

    <footer
      v-if="$slots.footer"
      class="px-5 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 rounded-b-xl"
    >
      <slot name="footer" />
    </footer>
  </section>
</template>
