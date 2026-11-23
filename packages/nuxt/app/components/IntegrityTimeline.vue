<script setup lang="ts">
import type { IntegrityTimelineEvent } from '../types/ui'

withDefaults(defineProps<{
  events: IntegrityTimelineEvent[]
  emptyLabel?: string
}>(), {
  emptyLabel: 'Sin eventos en el seguimiento.',
})

function formatAt(value: unknown): string {
  if (!value) return 'Sin fecha'
  try {
    return new Date(String(value)).toLocaleString('es-MX', {
      dateStyle: 'short',
      timeStyle: 'medium',
    })
  } catch {
    return String(value)
  }
}

function kindStyle(kind: string): { dot: string; badge: string; label: string } {
  switch (kind) {
    case 'created':
      return { dot: 'bg-sky-500', badge: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/70 dark:text-sky-300 dark:border-sky-800', label: 'Creación' }
    case 'modified':
      return { dot: 'bg-amber-500', badge: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800', label: 'Cambio' }
    case 'email':
      return { dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800', label: 'Correo' }
    case 'api':
      return { dot: 'bg-blue-500', badge: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/70 dark:text-blue-300 dark:border-blue-800', label: 'API' }
    case 'error':
      return { dot: 'bg-red-500', badge: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/70 dark:text-red-300 dark:border-red-800', label: 'Error' }
    case 'status':
      return { dot: 'bg-accent', badge: 'bg-brand-50 text-brand-700 border-brand-200 dark:bg-brand-950/70 dark:text-brand-200 dark:border-brand-700', label: 'Estado' }
    default:
      return { dot: 'bg-slate-400', badge: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700', label: kind }
  }
}

function httpBadge(code: unknown): string {
  const n = Number(code)
  if (n >= 200 && n < 300) return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800'
  if (n >= 400) return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/70 dark:text-red-300 dark:border-red-800'
  return 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
}
</script>

<template>
  <div
    v-if="!events.length"
    class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-10 text-center text-sm text-slate-500 dark:text-slate-400"
  >
    {{ emptyLabel }}
  </div>

  <ol v-else class="relative space-y-0">
    <li
      v-for="(ev, idx) in events"
      :key="`${ev.kind}-${ev.at}-${idx}`"
      class="relative flex gap-4 pb-5 last:pb-0"
    >
      <div class="flex flex-col items-center">
        <span
          class="mt-1.5 h-3 w-3 shrink-0 rounded-full ring-4 ring-[#fafafa] dark:ring-[#0a0a0a]"
          :class="kindStyle(ev.kind).dot"
        />
        <span
          v-if="idx < events.length - 1"
          class="mt-1 w-px flex-1 bg-slate-200 dark:bg-slate-800"
          aria-hidden="true"
        />
      </div>

      <div class="min-w-0 flex-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 shadow-subtle">
        <div class="flex flex-wrap items-center gap-2 mb-1">
          <span
            class="inline-flex px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide rounded-md border"
            :class="kindStyle(ev.kind).badge"
          >
            {{ kindStyle(ev.kind).label }}
          </span>
          <span
            v-if="ev.http != null"
            class="inline-flex px-2 py-0.5 text-[10px] font-mono font-semibold rounded-md border"
            :class="httpBadge(ev.http)"
          >
            HTTP {{ ev.http }}
          </span>
          <span class="text-xs text-slate-400 ml-auto">{{ formatAt(ev.at) }}</span>
        </div>
        <p class="text-sm font-semibold text-slate-900 dark:text-slate-50">{{ ev.title }}</p>
        <p v-if="ev.detail" class="mt-1 text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap break-words">
          {{ ev.detail }}
        </p>
        <p v-if="ev.source" class="mt-2 text-[11px] font-mono text-slate-400 dark:text-slate-500">
          {{ ev.source }}
        </p>
      </div>
    </li>
  </ol>
</template>
