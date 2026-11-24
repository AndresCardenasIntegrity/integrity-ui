<script setup lang="ts">
import { shallowRef } from 'vue'
import type { IntegrityCodeLanguage } from '@integritysoftwarela/integrity-ui-nuxt/app/utils/codeHighlight'

withDefaults(defineProps<{
  title: string
  description?: string
  code?: string
  language?: IntegrityCodeLanguage
}>(), {
  description: undefined,
  code: undefined,
  language: 'vue',
})

const activeTab = shallowRef<'preview' | 'code'>('preview')
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

    <!-- Highlighted Code Frame -->
    <IntegrityCodeBlock
      v-else
      :code="code"
      :language="language"
      :show-line-numbers="true"
    />
  </section>
</template>
