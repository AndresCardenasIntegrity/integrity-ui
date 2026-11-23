<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  variant?: 'text' | 'rect' | 'circle' | 'card' | 'table'
  lines?: number
  rows?: number
  width?: string
  height?: string
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  label?: string
}>(), {
  variant: 'text',
  lines: 3,
  rows: 4,
  width: undefined,
  height: undefined,
  rounded: 'md',
  label: 'Cargando contenido…',
})

const roundedClass = computed(() => {
  const map = {
    sm: 'rounded',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  } as const
  return map[props.rounded]
})
</script>

<template>
  <div role="status" aria-busy="true" class="w-full">
    <span class="sr-only">{{ label }}</span>

    <div v-if="variant === 'text'" class="space-y-2.5">
      <div
        v-for="idx in lines"
        :key="idx"
        :class="[
          'h-3.5 animate-pulse bg-slate-200/80 dark:bg-slate-800',
          roundedClass,
          idx === lines && lines > 1 ? 'w-2/3' : 'w-full',
        ]"
      />
    </div>

    <div
      v-else-if="variant === 'circle'"
      class="animate-pulse rounded-full bg-slate-200/80 dark:bg-slate-800"
      :style="{ width: width ?? '2.5rem', height: height ?? '2.5rem' }"
    />

    <div
      v-else-if="variant === 'rect'"
      :class="['animate-pulse bg-slate-200/80 dark:bg-slate-800', roundedClass]"
      :style="{ width: width ?? '100%', height: height ?? '5rem' }"
    />

    <div
      v-else-if="variant === 'card'"
      class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4"
    >
      <div class="flex items-center gap-3">
        <div class="h-10 w-10 rounded-lg animate-pulse bg-slate-200/80 dark:bg-slate-800 shrink-0" />
        <div class="flex-1 space-y-2">
          <div class="h-3.5 w-1/3 rounded animate-pulse bg-slate-200/80 dark:bg-slate-800" />
          <div class="h-3 w-1/2 rounded animate-pulse bg-slate-200/70 dark:bg-slate-800/70" />
        </div>
      </div>
      <div class="space-y-2">
        <div class="h-3 w-full rounded animate-pulse bg-slate-200/70 dark:bg-slate-800/70" />
        <div class="h-3 w-5/6 rounded animate-pulse bg-slate-200/70 dark:bg-slate-800/70" />
      </div>
    </div>

    <div
      v-else
      class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
    >
      <div class="grid grid-cols-4 gap-4 px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60">
        <div v-for="col in 4" :key="col" class="h-3 rounded animate-pulse bg-slate-200 dark:bg-slate-800" />
      </div>
      <div class="divide-y divide-slate-100 dark:divide-slate-800/80">
        <div v-for="row in rows" :key="row" class="grid grid-cols-4 gap-4 px-4 py-3.5">
          <div class="h-3.5 w-4/5 rounded animate-pulse bg-slate-200/80 dark:bg-slate-800" />
          <div class="h-3.5 w-full rounded animate-pulse bg-slate-200/70 dark:bg-slate-800/70" />
          <div class="h-5 w-20 rounded-full animate-pulse bg-slate-200/80 dark:bg-slate-800" />
          <div class="h-3.5 w-16 ml-auto rounded animate-pulse bg-slate-200/70 dark:bg-slate-800/70" />
        </div>
      </div>
    </div>
  </div>
</template>
