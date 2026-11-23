<script setup lang="ts">
const props = withDefaults(defineProps<{
  label?: string
  size?: 'sm' | 'md' | 'lg'
}>(), {
  label: 'Cargando…',
  size: 'md',
})

const boxClass = computed(() => {
  const map = {
    sm: 'h-10 w-10',
    md: 'h-14 w-14',
    lg: 'h-18 w-18',
  } as const
  return map[props.size]
})

const markClass = computed(() => {
  const map = {
    sm: 'h-5 w-5',
    md: 'h-7 w-7',
    lg: 'h-9 w-9',
  } as const
  return map[props.size]
})
</script>

<template>
  <div class="inline-flex flex-col items-center justify-center gap-3" role="status" aria-live="polite">
    <div class="relative flex items-center justify-center" :class="boxClass">
      <span
        class="absolute inset-0 rounded-2xl border-2 border-accent/20 border-t-accent animate-spin"
        aria-hidden="true"
      />
      <IntegrityMark class="text-accent" :class="markClass" />
    </div>
    <p v-if="label" class="text-xs font-medium tracking-wide text-slate-500 dark:text-slate-400">
      {{ label }}
    </p>
  </div>
</template>
