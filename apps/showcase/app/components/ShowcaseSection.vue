<script setup lang="ts">
import { shallowRef } from 'vue'

const props = defineProps<{
  title: string
  description?: string
  code?: string
}>()

const { success } = useIntegrityToast()
const activeTab = shallowRef<'preview' | 'code'>('preview')

async function copyCode() {
  if (!props.code || !import.meta.client) return
  try {
    await navigator.clipboard.writeText(props.code)
    success('Código copiado al portapapeles.')
  } catch {
    // ignore clipboard fallback
  }
}
</script>

<template>
  <section class="space-y-3">
    <div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div class="min-w-0">
        <h2 class="text-base font-semibold tracking-tight text-slate-950 dark:text-white">
          {{ title }}
        </h2>
        <p v-if="description" class="text-sm text-slate-500 dark:text-zinc-400 mt-0.5">
          {{ description }}
        </p>
      </div>

      <div
        v-if="code"
        class="inline-flex items-center rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-100/80 dark:bg-zinc-900 p-0.5 self-start sm:self-auto shrink-0"
        role="tablist"
        aria-label="Modo de vista"
      >
        <button
          type="button"
          role="tab"
          :aria-selected="activeTab === 'preview'"
          :class="[
            'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
            activeTab === 'preview'
              ? 'bg-white dark:bg-zinc-800 text-slate-950 dark:text-white shadow-subtle'
              : 'text-slate-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white',
          ]"
          @click="activeTab = 'preview'"
        >
          Vista previa
        </button>
        <button
          type="button"
          role="tab"
          :aria-selected="activeTab === 'code'"
          :class="[
            'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
            activeTab === 'code'
              ? 'bg-white dark:bg-zinc-800 text-slate-950 dark:text-white shadow-subtle'
              : 'text-slate-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white',
          ]"
          @click="activeTab = 'code'"
        >
          Código
        </button>
      </div>
    </div>

    <!-- Preview Frame -->
    <div
      v-if="activeTab === 'preview' || !code"
      class="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/60 p-5 sm:p-6 shadow-subtle"
    >
      <slot />
    </div>

    <!-- Code Frame -->
    <div
      v-else
      class="relative rounded-xl border border-slate-200 dark:border-zinc-800 bg-zinc-950 text-zinc-100 overflow-hidden shadow-subtle"
    >
      <div class="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900/70">
        <span class="font-mono text-[11px] text-zinc-400">vue</span>
        <button
          type="button"
          class="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
          @click="copyCode"
        >
          <Icon name="i-heroicons-clipboard-document" class="h-3.5 w-3.5" />
          <span>Copiar</span>
        </button>
      </div>
      <div class="p-4 overflow-x-auto scrollbar-thin">
        <pre class="font-mono text-xs leading-relaxed"><code>{{ code }}</code></pre>
      </div>
    </div>
  </section>
</template>
