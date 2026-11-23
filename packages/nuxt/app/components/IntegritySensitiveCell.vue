<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  value: string | number | null | undefined
  revealKey: string
  label?: string
  requireConfirm?: boolean
  visibleTail?: number
}>(), {
  label: 'dato sensible',
  requireConfirm: false,
  visibleTail: 4,
})

const { display, isRevealed, toggleReveal } = useIntegritySensitive()

const isEmpty = computed(() => props.value == null || props.value === '')
const revealed = computed(() => isRevealed(props.revealKey))
const shown = computed(() => display(props.revealKey, props.value, props.visibleTail))

async function onToggle() {
  await toggleReveal(props.revealKey, {
    label: props.label,
    requireConfirm: props.requireConfirm,
  })
}
</script>

<template>
  <span v-if="isEmpty" class="text-slate-400 dark:text-slate-500">—</span>
  <button
    v-else
    type="button"
    class="inline-flex items-center gap-1 font-mono text-xs text-accent dark:text-brand-300 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
    :title="revealed ? 'Ocultar' : 'Revelar'"
    @click="onToggle"
  >
    <span>{{ shown }}</span>
    <Icon
      :name="revealed ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
      class="h-3.5 w-3.5 opacity-60"
    />
  </button>
</template>
