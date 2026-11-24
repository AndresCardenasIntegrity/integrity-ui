<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, shallowRef } from 'vue'

definePageMeta({
  layout: false,
})

const { isDark, toggleTheme, initTheme } = useIntegrityTheme()
const { success, info } = useIntegrityToast()

// 1) Login Welcome Overlay state
const showWelcome = shallowRef(false)
const welcomeLabel = shallowRef('Bienvenido')
const welcomeSubtitle = shallowRef('Preparando tu espacio de trabajo Integrity…')
const welcomeDuration = shallowRef<'2400' | '3200'>('2400')

// 2) Environment Transition Overlay state
const showEnvOverlay = shallowRef(false)
const activeEnv = shallowRef<'PROD' | 'QA' | 'DEV'>('PROD')
const pendingEnv = shallowRef<'PROD' | 'QA' | 'DEV'>('PROD')
const envOverlaySize = shallowRef<'md' | 'lg'>('lg')

const envOptions = [
  { label: 'Producción (PROD)', value: 'PROD' },
  { label: 'Calidad (QA)', value: 'QA' },
  { label: 'Desarrollo (DEV)', value: 'DEV' },
]

const durationOptions = [
  { label: 'Estándar (2.4 s)', value: '2400' },
  { label: 'Extendida (3.2 s)', value: '3200' },
]

const sizeOptions = [
  { label: 'Grande (lg · 144px)', value: 'lg' },
  { label: 'Compacto (md · 80px)', value: 'md' },
]

const envLabels: Record<'PROD' | 'QA' | 'DEV', string> = {
  PROD: 'Producción (PROD)',
  QA: 'Calidad (QA)',
  DEV: 'Desarrollo (DEV)',
}

const envTransitionMessage = ref('Sincronizando datos de Producción (PROD)…')

let activeTimer: ReturnType<typeof setTimeout> | null = null

function clearActiveTimer() {
  if (activeTimer) {
    clearTimeout(activeTimer)
    activeTimer = null
  }
}

function triggerWelcome() {
  clearActiveTimer()
  showWelcome.value = true
  const ms = Number(welcomeDuration.value) || 2400
  activeTimer = setTimeout(() => {
    showWelcome.value = false
    success('Animación de bienvenida completada.', 'Login completado')
  }, ms)
}

function triggerEnvironmentSwitch(nextEnv?: 'PROD' | 'QA' | 'DEV') {
  clearActiveTimer()
  const target = nextEnv ?? (activeEnv.value === 'PROD' ? 'QA' : activeEnv.value === 'QA' ? 'DEV' : 'PROD')
  pendingEnv.value = target
  envTransitionMessage.value = `Cambiando a ${envLabels[target]}…`
  showEnvOverlay.value = true

  activeTimer = setTimeout(() => {
    activeEnv.value = target
    showEnvOverlay.value = false
    success(`Entorno activo actualizado a ${envLabels[target]}.`, 'Entorno sincronizado')
  }, 2200)
}

function handleEnvSelect(value: string | number | null) {
  if (value !== 'PROD' && value !== 'QA' && value !== 'DEV') return
  if (value === activeEnv.value) return
  triggerEnvironmentSwitch(value)
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && (showWelcome.value || showEnvOverlay.value)) {
    clearActiveTimer()
    showWelcome.value = false
    showEnvOverlay.value = false
    info('Vista previa de overlay cerrada con Escape.')
  }
}

onMounted(() => {
  initTheme()
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  clearActiveTimer()
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKeydown)
  }
})

const welcomeSnippet = `<script setup lang="ts">
const showWelcome = ref(false)

async function onLoginSuccess() {
  showWelcome.value = true
  await new Promise((r) => setTimeout(r, 2400))
  await navigateTo('/dashboard')
  showWelcome.value = false
}
<\/script>

<template>
  <IntegrityWelcomeOverlay
    :show="showWelcome"
    label="Bienvenido"
    subtitle="Preparando tu espacio de trabajo Integrity…"
  />
</template>`

const envSnippet = `<script setup lang="ts">
const switchingEnv = ref(false)
const currentEnv = ref('PROD')

async function switchEnvironment(nextEnv: 'PROD' | 'QA' | 'DEV') {
  switchingEnv.value = true
  try {
    await refreshWorkspaceData(nextEnv)
    currentEnv.value = nextEnv
  } finally {
    switchingEnv.value = false
  }
}
<\/script>

<template>
  <IntegrityEnvironmentOverlay
    :show="switchingEnv"
    :environment="currentEnv"
    label="Sincronizando servicios del entorno…"
    size="lg"
  />
</template>`
</script>

<template>
  <div class="min-h-screen bg-[#fafafa] dark:bg-[#09090b] text-slate-900 dark:text-slate-100 pb-28">
    <!-- Top Bar -->
    <header class="sticky top-0 z-30 border-b border-slate-200/80 dark:border-zinc-800/80 bg-white/85 dark:bg-[#09090b]/85 backdrop-blur-md">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <div class="flex items-center gap-3 min-w-0">
          <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent text-white shadow-subtle">
            <IntegrityMark class="h-5 w-5" />
          </span>
          <div class="min-w-0">
            <p class="text-sm font-semibold tracking-tight truncate">
              Efectos de Carga y Transición
            </p>
            <p class="text-xs text-slate-500 dark:text-zinc-400 truncate">
              Login Welcome · Cambio de Entorno
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2.5">
          <div class="hidden sm:flex items-center gap-2 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 px-2.5 py-1">
            <span class="text-[11px] font-medium text-slate-500 dark:text-zinc-400">Entorno</span>
            <IntegrityBadge tone="brand" dot size="sm">
              {{ activeEnv }}
            </IntegrityBadge>
          </div>

          <IntegrityButton
            variant="outline"
            size="sm"
            :icon="isDark ? 'i-heroicons-sun' : 'i-heroicons-moon'"
            @click="toggleTheme"
          >
            <span class="hidden sm:inline">{{ isDark ? 'Claro' : 'Oscuro' }}</span>
          </IntegrityButton>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
      <div class="max-w-3xl space-y-2">
        <p class="text-xs font-semibold uppercase tracking-widest text-accent dark:text-brand-300">
          Plantilla Interactiva · Overlays de Transición
        </p>
        <h1 class="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
          Estados de carga corporativos con identidad Integrity
        </h1>
        <p class="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
          Prueba ambos overlays a pantalla completa en modo claro y oscuro. Ambos respetan
          <code class="font-mono text-xs px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-zinc-800">prefers-reduced-motion</code>
          y se montan con <code class="font-mono text-xs px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-zinc-800">Teleport to="body"</code>.
          Presiona <kbd class="font-mono text-[11px] px-1.5 py-0.5 rounded border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900">Esc</kbd> en cualquier momento para cerrar una vista previa.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Card 1: Login Welcome Overlay -->
        <IntegrityCard class="flex flex-col justify-between gap-6">
          <div class="space-y-5">
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-center gap-3">
                <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-950/70 text-accent dark:text-brand-300">
                  <Icon name="i-heroicons-sparkles" class="h-5 w-5" />
                </span>
                <div>
                  <h2 class="text-base font-semibold text-slate-900 dark:text-slate-50">
                    1. Bienvenida al iniciar sesión
                  </h2>
                  <p class="text-xs text-slate-500 dark:text-zinc-400 font-mono">
                    &lt;IntegrityWelcomeOverlay /&gt;
                  </p>
                </div>
              </div>
              <IntegrityBadge tone="brand">Login</IntegrityBadge>
            </div>

            <p class="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
              Dibuja secuencialmente los tres cuadrados del isotipo Integrity con un resplandor radial suave y muestra el mensaje de bienvenida antes de revelar el panel principal.
            </p>

            <div class="space-y-3 rounded-xl border border-slate-200/80 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-900/50 p-4">
              <IntegrityInput
                v-model="welcomeLabel"
                label="Mensaje principal"
                placeholder="Bienvenido"
              />
              <IntegrityInput
                v-model="welcomeSubtitle"
                label="Subtítulo opcional"
                placeholder="Cargando espacio de trabajo…"
              />
              <IntegritySelect
                v-model="welcomeDuration"
                label="Duración de la demostración"
                :options="durationOptions"
              />
            </div>

            <div class="flex flex-wrap items-center gap-3">
              <IntegrityButton
                icon="i-heroicons-play"
                size="md"
                @click="triggerWelcome"
              >
                Probar efecto de Login
              </IntegrityButton>
              <NuxtLink to="/templates/login">
                <IntegrityButton
                  variant="outline"
                  size="md"
                  icon-right="i-heroicons-arrow-top-right-on-square"
                >
                  Ver en plantilla Login
                </IntegrityButton>
              </NuxtLink>
            </div>
          </div>

          <IntegrityCodeBlock
            :code="welcomeSnippet"
            language="vue"
            title="LoginWelcomeExample.vue"
            max-height="220px"
          />
        </IntegrityCard>

        <!-- Card 2: Environment Transition Overlay -->
        <IntegrityCard class="flex flex-col justify-between gap-6">
          <div class="space-y-5">
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-center gap-3">
                <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-950/70 text-accent dark:text-brand-300">
                  <Icon name="i-heroicons-arrows-right-left" class="h-5 w-5" />
                </span>
                <div>
                  <h2 class="text-base font-semibold text-slate-900 dark:text-slate-50">
                    2. Transición al cambiar de entorno
                  </h2>
                  <p class="text-xs text-slate-500 dark:text-zinc-400 font-mono">
                    &lt;IntegrityEnvironmentOverlay /&gt;
                  </p>
                </div>
              </div>
              <IntegrityBadge tone="info">Entornos</IntegrityBadge>
            </div>

            <p class="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
              Overlay con vidrio esmerilado (<code class="font-mono text-xs">backdrop-blur-md</code>), trazado continuo en bucle del logo Integrity, badge del entorno destino y puntos animados mientras se recargan datos de <code class="font-mono text-xs">PROD / QA / DEV</code>.
            </p>

            <div class="space-y-3 rounded-xl border border-slate-200/80 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-900/50 p-4">
              <IntegritySelect
                :model-value="activeEnv"
                label="Cambiar entorno activo (dispara el efecto)"
                :options="envOptions"
                @update:model-value="handleEnvSelect"
              />
              <IntegritySelect
                v-model="envOverlaySize"
                label="Tamaño del loader"
                :options="sizeOptions"
              />
              <div class="flex items-center justify-between pt-1 text-xs text-slate-500 dark:text-zinc-400">
                <span>Entorno actual sincronizado:</span>
                <IntegrityBadge tone="brand" dot size="sm">
                  {{ envLabels[activeEnv] }}
                </IntegrityBadge>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-3">
              <IntegrityButton
                icon="i-heroicons-arrow-path"
                size="md"
                @click="triggerEnvironmentSwitch()"
              >
                Simular cambio de entorno
              </IntegrityButton>
              <IntegrityButton
                variant="outline"
                size="md"
                icon="i-heroicons-beaker"
                @click="triggerEnvironmentSwitch('QA')"
              >
                Ir a QA
              </IntegrityButton>
              <IntegrityButton
                variant="outline"
                size="md"
                icon="i-heroicons-server-stack"
                @click="triggerEnvironmentSwitch('PROD')"
              >
                Ir a PROD
              </IntegrityButton>
            </div>
          </div>

          <IntegrityCodeBlock
            :code="envSnippet"
            language="vue"
            title="EnvironmentSwitchExample.vue"
            max-height="220px"
          />
        </IntegrityCard>
      </div>
    </main>

    <!-- Actual Reusable Overlays -->
    <IntegrityWelcomeOverlay
      :show="showWelcome"
      :label="welcomeLabel || 'Bienvenido'"
      :subtitle="welcomeSubtitle || undefined"
    />

    <IntegrityEnvironmentOverlay
      :show="showEnvOverlay"
      :environment="envLabels[pendingEnv]"
      :label="envTransitionMessage"
      :size="envOverlaySize"
    />

    <!-- Floating Template Preview Bar -->
    <div
      role="region"
      aria-label="Controles de vista previa de plantilla"
      class="fixed bottom-5 right-5 z-[60] flex items-center gap-3 rounded-xl border border-slate-700/80 bg-slate-950/95 px-3.5 py-2 text-white shadow-2xl backdrop-blur-md"
    >
      <div class="hidden sm:flex items-center gap-2 pr-1">
        <span class="inline-flex items-center rounded bg-brand-600 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
          Plantilla
        </span>
        <span class="text-xs font-medium text-slate-200">
          Efectos de Carga
        </span>
      </div>

      <NuxtLink to="/templates">
        <IntegrityButton
          variant="danger"
          size="sm"
          icon="i-heroicons-arrow-left-on-rectangle"
        >
          Salir de la plantilla
        </IntegrityButton>
      </NuxtLink>
    </div>
  </div>
</template>
