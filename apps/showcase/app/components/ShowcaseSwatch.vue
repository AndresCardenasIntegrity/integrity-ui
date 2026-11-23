<script setup lang="ts">
const props = defineProps<{
  name: string
  value: string
  token?: string
}>()

const { success } = useIntegrityToast()

async function copyValue() {
  if (!import.meta.client) return
  try {
    await navigator.clipboard.writeText(props.value)
    success(`Copiado ${props.value}`, props.name)
  } catch {
    // ignore clipboard fallback
  }
}
</script>

<template>
  <button
    type="button"
    class="group text-left rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-subtle hover:shadow-card transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    @click="copyValue"
  >
    <div
      class="h-16 w-full border-b border-slate-200/70 dark:border-slate-800"
      :style="{ backgroundColor: value }"
    />
    <div class="p-3">
      <p class="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
        {{ name }}
      </p>
      <p class="font-mono text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 uppercase">
        {{ value }}
      </p>
      <p v-if="token" class="font-mono text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
        {{ token }}
      </p>
    </div>
  </button>
</template>
