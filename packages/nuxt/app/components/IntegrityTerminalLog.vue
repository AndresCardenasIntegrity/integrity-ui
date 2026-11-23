<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import {
  parseTerminalLogs,
  type IntegrityLogLevel,
} from '../utils/terminalLog'

const props = withDefaults(defineProps<{
  logs: string | string[]
  title?: string
  status?: 'online' | 'degraded' | 'error' | 'idle'
  searchable?: boolean
  filterable?: boolean
  showLineNumbers?: boolean
  wrap?: boolean
  maxHeight?: string
}>(), {
  title: 'pm2 logs',
  status: 'online',
  searchable: true,
  filterable: true,
  showLineNumbers: true,
  wrap: false,
  maxHeight: '24rem',
})

const { success } = useIntegrityToast()
const search = shallowRef('')
const levelFilter = shallowRef<'all' | 'error' | 'warn' | 'info'>('all')
const wordWrap = shallowRef(props.wrap)
const copied = shallowRef(false)

const parsedLines = computed(() => parseTerminalLogs(props.logs))

const counts = computed(() => {
  let error = 0
  let warn = 0
  for (const line of parsedLines.value) {
    if (line.level === 'error') error++
    else if (line.level === 'warn') warn++
  }
  return { total: parsedLines.value.length, error, warn }
})

const visibleLines = computed(() => {
  const q = search.value.trim().toLowerCase()
  return parsedLines.value.filter((line) => {
    if (levelFilter.value === 'error' && line.level !== 'error') return false
    if (levelFilter.value === 'warn' && line.level !== 'warn') return false
    if (levelFilter.value === 'info' && !['info', 'success', 'debug', 'plain'].includes(line.level)) return false
    if (q && !line.plain.toLowerCase().includes(q)) return false
    return true
  })
})

const statusDotClass = computed(() => {
  const map = {
    online: 'bg-emerald-400',
    degraded: 'bg-amber-400',
    error: 'bg-red-500',
    idle: 'bg-zinc-500',
  } as const
  return map[props.status]
})

function rowClass(level: IntegrityLogLevel): string {
  if (level === 'error') return 'bg-red-950/35 border-l-2 border-red-500 hover:bg-red-950/50'
  if (level === 'warn') return 'bg-amber-950/25 border-l-2 border-amber-400 hover:bg-amber-950/40'
  return 'border-l-2 border-transparent hover:bg-zinc-900/70'
}

async function copyLogs() {
  if (!import.meta.client) return
  try {
    const plainText = visibleLines.value.map(l => l.plain).join('\n')
    await navigator.clipboard.writeText(plainText)
    copied.value = true
    success('Logs copiados al portapapeles.')
    setTimeout(() => {
      copied.value = false
    }, 1800)
  } catch {
    // ignore clipboard fallback
  }
}
</script>

<template>
  <div class="rounded-xl border border-slate-200 dark:border-zinc-800 bg-[#09090b] text-zinc-100 overflow-hidden shadow-subtle">
    <!-- Terminal Chrome Bar -->
    <div class="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 bg-zinc-900/90 px-3.5 py-2.5">
      <div class="flex items-center gap-2.5 min-w-0">
        <span class="flex items-center gap-1.5 shrink-0" aria-hidden="true">
          <span class="h-2.5 w-2.5 rounded-full bg-zinc-700" />
          <span class="h-2.5 w-2.5 rounded-full bg-zinc-700" />
          <span class="h-2.5 w-2.5 rounded-full" :class="statusDotClass" />
        </span>
        <span class="font-mono text-xs font-medium text-zinc-200 truncate">
          {{ title }}
        </span>
        <span class="font-mono text-[10px] text-zinc-500 tabular-nums shrink-0">
          {{ visibleLines.length }}/{{ counts.total }} líneas
        </span>
      </div>

      <div class="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          :class="[
            'inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] transition-colors',
            wordWrap
              ? 'bg-zinc-800 text-white'
              : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100',
          ]"
          @click="wordWrap = !wordWrap"
        >
          <Icon name="i-heroicons-bars-3-bottom-left" class="h-3.5 w-3.5" />
          <span class="hidden sm:inline">Wrap</span>
        </button>

        <button
          type="button"
          class="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
          @click="copyLogs"
        >
          <Icon
            :name="copied ? 'i-heroicons-check' : 'i-heroicons-clipboard-document'"
            :class="['h-3.5 w-3.5', copied ? 'text-emerald-400' : '']"
          />
          <span>{{ copied ? 'Copiado' : 'Copiar' }}</span>
        </button>
      </div>
    </div>

    <!-- Search & Level Filter Bar -->
    <div
      v-if="searchable || filterable"
      class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-800/80 bg-zinc-950/80 px-3.5 py-2"
    >
      <div v-if="searchable" class="relative w-full sm:max-w-xs">
        <Icon
          name="i-heroicons-magnifying-glass"
          class="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500"
        />
        <input
          v-model="search"
          type="text"
          placeholder="Filtrar logs (proceso, endpoint, error)…"
          class="block w-full rounded-md border border-zinc-800 bg-zinc-900/90 pl-8 pr-2.5 py-1 font-mono text-xs text-zinc-100 placeholder:text-zinc-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
      </div>

      <div v-if="filterable" class="flex flex-wrap items-center gap-1">
        <button
          type="button"
          :class="[
            'rounded-md px-2 py-1 font-mono text-[11px] transition-colors',
            levelFilter === 'all' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-zinc-200',
          ]"
          @click="levelFilter = 'all'"
        >
          Todos ({{ counts.total }})
        </button>
        <button
          type="button"
          :class="[
            'rounded-md px-2 py-1 font-mono text-[11px] transition-colors',
            levelFilter === 'error' ? 'bg-red-950/90 text-red-300 font-medium border border-red-800/60' : 'text-red-400/80 hover:text-red-300',
          ]"
          @click="levelFilter = 'error'"
        >
          Error ({{ counts.error }})
        </button>
        <button
          type="button"
          :class="[
            'rounded-md px-2 py-1 font-mono text-[11px] transition-colors',
            levelFilter === 'warn' ? 'bg-amber-950/90 text-amber-300 font-medium border border-amber-800/60' : 'text-amber-400/80 hover:text-amber-300',
          ]"
          @click="levelFilter = 'warn'"
        >
          Warn ({{ counts.warn }})
        </button>
        <button
          type="button"
          :class="[
            'rounded-md px-2 py-1 font-mono text-[11px] transition-colors',
            levelFilter === 'info' ? 'bg-sky-950/90 text-sky-300 font-medium border border-sky-800/60' : 'text-sky-400/80 hover:text-sky-300',
          ]"
          @click="levelFilter = 'info'"
        >
          Info
        </button>
      </div>
    </div>

    <!-- Terminal Lines -->
    <div
      class="overflow-auto scrollbar-thin py-2.5 font-mono text-xs leading-6"
      :style="{ maxHeight }"
    >
      <div
        v-if="!visibleLines.length"
        class="px-4 py-8 text-center font-sans text-xs text-zinc-500"
      >
        Ninguna línea coincide con el filtro actual.
      </div>

      <div
        v-for="line in visibleLines"
        v-else
        :key="line.lineNumber"
        :class="['flex items-start gap-2.5 px-3 py-0.5 transition-colors', rowClass(line.level)]"
      >
        <span
          v-if="showLineNumbers"
          class="w-7 shrink-0 text-right text-zinc-600 select-none tabular-nums"
          aria-hidden="true"
        >
          {{ line.lineNumber }}
        </span>

        <span
          v-if="line.process"
          class="shrink-0 rounded bg-brand-950/90 border border-brand-800/60 px-1.5 text-[10px] leading-5 text-brand-300"
        >
          {{ line.process }}
        </span>

        <span
          v-if="line.timestamp"
          class="shrink-0 text-zinc-500 tabular-nums"
        >
          {{ line.timestamp }}
        </span>

        <!-- eslint-disable-next-line vue/no-v-html -->
        <span
          :class="wordWrap ? 'whitespace-pre-wrap break-all' : 'whitespace-pre'"
          class="flex-1 min-w-0 text-zinc-200"
          v-html="line.html || ' '"
        />
      </div>
    </div>
  </div>
</template>
