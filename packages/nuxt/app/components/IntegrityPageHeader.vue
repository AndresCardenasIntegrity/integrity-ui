<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
  eyebrow?: string
}>()
</script>

<template>
  <header class="page-header">
    <div class="min-w-0">
      <p
        v-if="eyebrow"
        class="text-[11px] font-semibold uppercase tracking-wider text-accent dark:text-brand-300 mb-1"
      >
        {{ eyebrow }}
      </p>
      <h1 class="page-title">{{ title }}</h1>
      <p v-if="subtitle" class="page-subtitle">{{ subtitle }}</p>
    </div>
    <div v-if="$slots.actions" class="page-actions">
      <slot name="actions" />
    </div>
  </header>
</template>
