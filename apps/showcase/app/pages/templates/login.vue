<script setup lang="ts">
import { shallowRef } from 'vue'

definePageMeta({
  layout: false,
})

const { isDark, toggleTheme, initTheme } = useIntegrityTheme()
const { success } = useIntegrityToast()

const email = shallowRef('operaciones@integrity.com')
const password = shallowRef('••••••••••••')
const loading = shallowRef(false)
const showWelcome = shallowRef(false)

onMounted(() => initTheme())

function handleSubmit() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    showWelcome.value = true
    setTimeout(() => {
      showWelcome.value = false
      success('Inicio de sesión simulado correctamente.', 'Bienvenido')
    }, 2200)
  }, 500)
}
</script>

<template>
  <div class="relative min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#fafafa] dark:bg-[#0a0a0a]">
    <!-- Left Brand Panel -->
    <section class="hidden lg:flex flex-col justify-between bg-brand-600 text-white p-12 relative overflow-hidden">
      <div class="flex items-center gap-3">
        <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
          <IntegrityMark class="h-6 w-6 text-white" />
        </span>
        <div>
          <p class="text-base font-semibold tracking-tight">INTEGRITY</p>
          <p class="text-xs text-white/70">Latin America</p>
        </div>
      </div>

      <div class="max-w-md space-y-4">
        <p class="text-xs font-semibold uppercase tracking-widest text-brand-200">
          Plataforma Operativa
        </p>
        <h1 class="text-3xl font-semibold tracking-tight leading-tight">
          Una sola experiencia visual clara, confiable y estandarizada.
        </h1>
        <p class="text-sm text-white/75 leading-relaxed">
          Plantilla corporativa base para portales administrativos, tableros de monitoreo y consolas operativas.
        </p>
      </div>

      <p class="text-xs text-white/60">
        © 2026 Integrity · Design System v1.0
      </p>
    </section>

    <!-- Right Form Panel -->
    <section class="flex flex-col justify-between p-6 sm:p-10 pb-24">
      <div class="flex items-center justify-end">
        <IntegrityButton
          variant="outline"
          size="sm"
          :icon="isDark ? 'i-heroicons-sun' : 'i-heroicons-moon'"
          @click="toggleTheme"
        >
          {{ isDark ? 'Claro' : 'Oscuro' }}
        </IntegrityButton>
      </div>

      <div class="w-full max-w-sm mx-auto my-12">
        <div class="flex items-center gap-2.5 mb-6 lg:hidden">
          <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-white">
            <IntegrityMark class="h-5 w-5" />
          </span>
          <span class="text-base font-semibold text-slate-900 dark:text-slate-50">Integrity</span>
        </div>

        <h2 class="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
          Iniciar sesión
        </h2>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-6">
          Ingresa tus credenciales corporativas para continuar.
        </p>

        <form class="space-y-4" @submit.prevent="handleSubmit">
          <IntegrityInput
            v-model="email"
            type="email"
            label="Correo electrónico"
            icon="i-heroicons-envelope"
            required
          />
          <IntegrityInput
            v-model="password"
            type="password"
            label="Contraseña"
            icon="i-heroicons-key"
            required
          />
          <IntegrityButton type="submit" size="lg" block :loading="loading">
            Entrar al panel
          </IntegrityButton>
        </form>
      </div>

      <p class="text-center text-xs text-slate-400">
        Acceso protegido · Integrity UI/UX Template
      </p>
    </section>

    <!-- Login Welcome Overlay -->
    <IntegrityWelcomeOverlay
      :show="showWelcome"
      label="Bienvenido"
      subtitle="Cargando panel operativo Integrity…"
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
          Login Corporativo
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
