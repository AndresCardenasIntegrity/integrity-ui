<script setup lang="ts">
import { computed, onMounted } from 'vue'

export interface IntegrityErrorInput {
  statusCode?: number
  statusMessage?: string
  message?: string
  url?: string
}

const props = withDefaults(defineProps<{
  error?: IntegrityErrorInput | null
  statusCode?: number
  title?: string
  description?: string
  homePath?: string
  homeLabel?: string
  showBack?: boolean
  showDetails?: boolean
}>(), {
  error: null,
  statusCode: undefined,
  title: undefined,
  description: undefined,
  homePath: '/',
  homeLabel: 'Volver al inicio',
  showBack: true,
  showDetails: false,
})

const { initTheme, isDark, toggleTheme } = useIntegrityTheme()

onMounted(() => initTheme())

const code = computed(() => props.statusCode ?? props.error?.statusCode ?? 404)

const isNotFound = computed(() => code.value === 404)

const resolvedTitle = computed(() => {
  if (props.title) return props.title
  if (code.value === 404) return 'Página no encontrada'
  if (code.value === 403) return 'Acceso restringido'
  if (code.value === 401) return 'Sesión requerida'
  return 'Ocurrió un error inesperado'
})

const resolvedDescription = computed(() => {
  if (props.description) return props.description
  if (code.value === 404) {
    return 'La ruta que buscas no existe, fue movida o no está disponible en este módulo.'
  }
  if (code.value === 403) {
    return 'No cuentas con los permisos necesarios para consultar este recurso.'
  }
  if (code.value === 401) {
    return 'Inicia sesión nuevamente para continuar operando en la plataforma.'
  }
  return 'No fue posible completar la solicitud. Intenta nuevamente o regresa al panel principal.'
})

const badgeTone = computed(() => {
  if (code.value === 404) return 'brand' as const
  if (code.value === 401 || code.value === 403) return 'degraded' as const
  return 'down' as const
})

const iconName = computed(() => {
  if (code.value === 404) return 'i-heroicons-map'
  if (code.value === 401 || code.value === 403) return 'i-heroicons-lock-closed'
  return 'i-heroicons-exclamation-triangle'
})

const missingPath = computed(() => {
  if (props.error?.url) return props.error.url
  if (import.meta.client) return window.location.pathname
  return undefined
})

function handleGoHome() {
  clearError({ redirect: props.homePath })
}

function handleGoBack() {
  if (import.meta.client && window.history.length > 1) {
    window.history.back()
    return
  }
  clearError({ redirect: props.homePath })
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#fafafa] dark:bg-[#09090b] text-slate-900 dark:text-slate-50 antialiased">
    <!-- Minimal Brand Top Bar -->
    <header class="w-full border-b border-slate-200/80 dark:border-zinc-800/80 bg-white/85 dark:bg-[#09090b]/85 backdrop-blur-md">
      <div class="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <button
          type="button"
          class="flex items-center gap-2.5 group focus:outline-none"
          @click="handleGoHome"
        >
          <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-white shadow-subtle">
            <IntegrityMark class="h-4 w-4" />
          </span>
          <span class="text-sm font-semibold tracking-tight text-slate-950 dark:text-white">
            Integrity
          </span>
        </button>

        <button
          type="button"
          :aria-label="isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
          class="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-950 dark:hover:text-white transition-colors"
          @click="toggleTheme"
        >
          <Icon :name="isDark ? 'i-heroicons-sun' : 'i-heroicons-moon'" class="h-4 w-4" />
        </button>
      </div>
    </header>

    <!-- Centered Error Card -->
    <main class="flex-1 flex items-center justify-center px-4 py-12 sm:py-16">
      <div class="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 p-7 sm:p-10 text-center shadow-subtle">
        <div class="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 dark:bg-brand-950/70 text-accent dark:text-brand-300">
          <Icon :name="iconName" class="h-7 w-7" />
        </div>

        <div class="mb-3 flex justify-center">
          <IntegrityBadge :tone="badgeTone" dot size="md">
            <span class="font-mono tabular-nums">HTTP {{ code }}</span>
          </IntegrityBadge>
        </div>

        <h1 class="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
          {{ resolvedTitle }}
        </h1>

        <p class="mt-2.5 text-sm text-slate-600 dark:text-zinc-400 leading-relaxed max-w-md mx-auto">
          {{ resolvedDescription }}
        </p>

        <div
          v-if="isNotFound && missingPath"
          class="mt-5 inline-flex max-w-full items-center gap-2 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 px-3 py-1.5"
        >
          <Icon name="i-heroicons-link-slash" class="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <code class="font-mono text-xs text-slate-700 dark:text-zinc-300 truncate">
            {{ missingPath }}
          </code>
        </div>

        <div
          v-if="showDetails && error?.message"
          class="mt-5 rounded-lg border border-red-200 dark:border-red-900/60 bg-red-50/60 dark:bg-red-950/30 p-3 text-left"
        >
          <p class="font-mono text-xs text-red-700 dark:text-red-300 break-words">
            {{ error.message }}
          </p>
        </div>

        <div class="mt-7 flex flex-wrap items-center justify-center gap-3">
          <slot name="actions">
            <IntegrityButton icon="i-heroicons-home" @click="handleGoHome">
              {{ homeLabel }}
            </IntegrityButton>
            <IntegrityButton
              v-if="showBack"
              variant="outline"
              icon="i-heroicons-arrow-left"
              @click="handleGoBack"
            >
              Regresar
            </IntegrityButton>
          </slot>
        </div>
      </div>
    </main>

    <footer class="py-5 text-center text-xs text-slate-400 dark:text-zinc-600">
      Integrity UI/UX · Estándar visual corporativo
    </footer>
  </div>
</template>
