<script setup lang="ts">
withDefaults(defineProps<{
  icon?: string
  title?: string
  description?: string
}>(), {
  icon: 'i-heroicons-inbox',
  title: 'Sin registros',
  description: 'No hay elementos para mostrar con los criterios actuales.',
})
</script>

<template>
  <div class="flex flex-col items-center justify-center text-center py-12 px-4">
    <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 mb-3">
      <Icon :name="icon" class="h-6 w-6" />
    </div>
    <p class="text-sm font-semibold text-slate-700 dark:text-slate-200">
      {{ title }}
    </p>
    <p v-if="description" class="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
      {{ description }}
    </p>
    <div v-if="$slots.actions" class="mt-4 flex flex-wrap items-center justify-center gap-2">
      <slot name="actions" />
    </div>
  </div>
</template>
