<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import {
  highlightCode,
  normalizeCodeContent,
  type IntegrityCodeLanguage,
} from '../utils/codeHighlight'

const props = withDefaults(defineProps<{
  code: string | Record<string, unknown> | unknown[]
  language?: IntegrityCodeLanguage
  title?: string
  showLineNumbers?: boolean
  copyable?: boolean
  wrap?: boolean
  prettyJson?: boolean
  maxHeight?: string
}>(), {
  language: 'json',
  title: undefined,
  showLineNumbers: true,
  copyable: true,
  wrap: false,
  prettyJson: true,
  maxHeight: '26rem',
})

const { success } = useIntegrityToast()
const copied = shallowRef(false)
const wordWrap = shallowRef(props.wrap)

const normalized = computed(() =>
  normalizeCodeContent(props.code, props.language, props.prettyJson),
)

const highlightedLines = computed(() => {
  const html = highlightCode(normalized.value, props.language)
  return html.split('\n')
})

const displayLang = computed(() => (props.language || 'text').toLowerCase())

async function copyCode() {
  if (!import.meta.client) return
  try {
    await navigator.clipboard.writeText(normalized.value)
    copied.value = true
    success('Código copiado al portapapeles.')
    setTimeout(() => {
      copied.value = false
    }, 1800)
  } catch {
    // ignore clipboard fallback
  }
}
</script>

<template>
  <div class="rounded-xl border border-slate-200 dark:border-zinc-800 bg-zinc-950 text-zinc-100 overflow-hidden shadow-subtle">
    <!-- Header -->
    <div class="flex items-center justify-between gap-3 border-b border-zinc-800/90 bg-zinc-900/80 px-3.5 py-2">
      <div class="flex items-center gap-2 min-w-0">
        <span
          v-if="title"
          class="font-mono text-xs font-medium text-zinc-200 truncate"
        >
          {{ title }}
        </span>
        <span class="inline-flex items-center rounded-md border border-zinc-700/80 bg-zinc-800/80 px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-zinc-300 shrink-0">
          {{ displayLang }}
        </span>
      </div>

      <div class="flex items-center gap-1 shrink-0">
        <button
          type="button"
          :title="wordWrap ? 'Desactivar ajuste de línea' : 'Ajustar líneas largas'"
          :class="[
            'inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] transition-colors',
            wordWrap
              ? 'bg-zinc-800 text-white'
              : 'text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-100',
          ]"
          @click="wordWrap = !wordWrap"
        >
          <Icon name="i-heroicons-bars-3-bottom-left" class="h-3.5 w-3.5" />
          <span class="hidden sm:inline">Wrap</span>
        </button>

        <button
          v-if="copyable"
          type="button"
          class="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
          @click="copyCode"
        >
          <Icon
            :name="copied ? 'i-heroicons-check' : 'i-heroicons-clipboard-document'"
            :class="['h-3.5 w-3.5', copied ? 'text-emerald-400' : '']"
          />
          <span>{{ copied ? 'Copiado' : 'Copiar' }}</span>
        </button>
      </div>
    </div>

    <!-- Highlighted Code Body -->
    <div
      class="overflow-auto scrollbar-thin py-3 font-mono text-xs leading-6"
      :style="{ maxHeight }"
    >
      <div
        v-for="(lineHtml, idx) in highlightedLines"
        :key="idx"
        class="flex px-3.5 hover:bg-zinc-900/70 transition-colors"
      >
        <span
          v-if="showLineNumbers"
          class="w-9 pr-4 shrink-0 text-right text-zinc-600 select-none tabular-nums"
          aria-hidden="true"
        >
          {{ idx + 1 }}
        </span>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <span
          :class="wordWrap ? 'whitespace-pre-wrap break-all' : 'whitespace-pre'"
          class="flex-1 min-w-0"
          v-html="lineHtml || ' '"
        />
      </div>
    </div>
  </div>
</template>
