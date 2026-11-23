<script setup lang="ts">
import { computed, onMounted, shallowRef, watch } from 'vue'

const route = useRoute()
const { isDark, toggleTheme, initTheme } = useIntegrityTheme()
const mobileMenuOpen = shallowRef(false)

onMounted(() => initTheme())

watch(() => route.path, () => {
  mobileMenuOpen.value = false
})

const isLanding = computed(() => route.path === '/')

const topNav = [
  { label: 'Inicio', to: '/', exact: true },
  { label: 'Fundamentos', to: '/foundations' },
  { label: 'Componentes', to: '/components' },
  { label: 'Datos', to: '/data' },
  { label: 'Plantillas', to: '/templates' },
]

const docsSections = [
  {
    title: 'Introducción',
    items: [
      { label: 'Resumen e Instalación', to: '/', exact: true },
      { label: 'Fundamentos y Tokens', to: '/foundations' },
    ],
  },
  {
    title: 'Librería UI',
    items: [
      { label: 'Componentes Base', to: '/components' },
      { label: 'Datos y Trazabilidad', to: '/data' },
    ],
  },
  {
    title: 'Plantillas',
    items: [
      { label: 'Galería de Plantillas', to: '/templates', exact: true },
      { label: 'Dashboard Admin', to: '/templates/dashboard' },
      { label: 'Login Corporativo', to: '/templates/login' },
    ],
  },
]

function isActive(to: string, exact = false) {
  if (exact || to === '/') return route.path === to
  return route.path === to || route.path.startsWith(`${to}/`)
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-[#09090b] text-slate-900 dark:text-slate-50 antialiased">
    <!-- Top Sticky Header (shadcn.com style) -->
    <header class="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-zinc-800/80 bg-white/85 dark:bg-[#09090b]/85 backdrop-blur-md">
      <div class="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div class="flex items-center gap-6">
          <NuxtLink to="/" class="flex items-center gap-2.5 group">
            <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-white shadow-subtle transition-transform group-hover:scale-105">
              <IntegrityMark class="h-4 w-4" />
            </span>
            <span class="text-sm font-semibold tracking-tight text-slate-950 dark:text-white">
              Integrity UI
            </span>
          </NuxtLink>

          <nav class="hidden md:flex items-center gap-1" aria-label="Navegación principal">
            <NuxtLink
              v-for="item in topNav"
              :key="item.to"
              :to="item.to"
              :class="[
                'rounded-md px-2.5 py-1.5 text-sm transition-colors',
                isActive(item.to, item.exact)
                  ? 'font-medium text-slate-950 dark:text-white bg-slate-100/80 dark:bg-zinc-800/70'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white',
              ]"
            >
              {{ item.label }}
            </NuxtLink>
          </nav>
        </div>

        <div class="flex items-center gap-2">
          <span class="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 px-2.5 py-1 font-mono text-[11px] text-slate-600 dark:text-zinc-400">
            <span class="h-1.5 w-1.5 rounded-full bg-accent dark:bg-brand-400" />
            v1.0.0
          </span>

          <a
            href="https://github.com/AndresCardenasIntegrity/integrity-ui"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Repositorio en GitHub"
            class="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-950 dark:hover:text-white transition-colors"
          >
            <Icon name="i-heroicons-code-bracket-square" class="h-4 w-4" />
          </a>

          <button
            type="button"
            :aria-label="isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
            class="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-950 dark:hover:text-white transition-colors"
            @click="toggleTheme"
          >
            <Icon :name="isDark ? 'i-heroicons-sun' : 'i-heroicons-moon'" class="h-4 w-4" />
          </button>

          <button
            type="button"
            aria-label="Abrir menú"
            class="inline-flex md:hidden h-8 w-8 items-center justify-center rounded-lg text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <Icon :name="mobileMenuOpen ? 'i-heroicons-x-mark' : 'i-heroicons-bars-3'" class="h-5 w-5" />
          </button>
        </div>
      </div>

      <!-- Mobile Navigation Dropdown -->
      <div
        v-if="mobileMenuOpen"
        class="md:hidden border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#09090b] px-4 py-3 space-y-1"
      >
        <NuxtLink
          v-for="item in topNav"
          :key="item.to"
          :to="item.to"
          :class="[
            'block rounded-lg px-3 py-2 text-sm transition-colors',
            isActive(item.to, item.exact)
              ? 'font-medium bg-brand-50 dark:bg-brand-950/60 text-accent dark:text-brand-300'
              : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-900',
          ]"
        >
          {{ item.label }}
        </NuxtLink>
      </div>
    </header>

    <!-- Landing Page (Full-width shadcn.com container, no sidebar) -->
    <main v-if="isLanding" class="flex-1 w-full">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <slot />
      </div>
    </main>

    <!-- Documentation Pages (shadcn.com sticky left docs rail + content) -->
    <main v-else class="flex-1 w-full">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col lg:flex-row lg:gap-10">
          <aside class="hidden lg:block w-56 shrink-0 border-r border-slate-200/70 dark:border-zinc-800/70 py-8 pr-6">
            <nav class="sticky top-20 space-y-6" aria-label="Índice de documentación">
              <div v-for="section in docsSections" :key="section.title">
                <p class="mb-2 px-2 text-xs font-semibold tracking-tight text-slate-900 dark:text-zinc-100">
                  {{ section.title }}
                </p>
                <ul class="space-y-0.5">
                  <li v-for="link in section.items" :key="link.to">
                    <NuxtLink
                      :to="link.to"
                      :class="[
                        'block rounded-md px-2 py-1.5 text-sm transition-colors',
                        isActive(link.to, link.exact)
                          ? 'font-medium text-accent dark:text-brand-300 bg-brand-50/70 dark:bg-brand-950/50'
                          : 'text-slate-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-zinc-900',
                      ]"
                    >
                      {{ link.label }}
                    </NuxtLink>
                  </li>
                </ul>
              </div>
            </nav>
          </aside>

          <div class="min-w-0 flex-1 py-8 lg:py-10">
            <slot />
          </div>
        </div>
      </div>
    </main>

    <!-- Minimal Editorial Footer -->
    <footer class="border-t border-slate-200/80 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-950/40">
      <div class="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 lg:px-8 py-6 text-xs text-slate-500 dark:text-zinc-400">
        <div class="flex items-center gap-2">
          <IntegrityMark class="h-4 w-4 text-accent dark:text-brand-300" />
          <span>
            <strong class="font-medium text-slate-800 dark:text-zinc-200">Integrity UI/UX</strong>
            · Sistema de diseño oficial para proyectos web de Integrity.
          </span>
        </div>
        <div class="flex items-center gap-4">
          <NuxtLink to="/foundations" class="hover:text-slate-900 dark:hover:text-white transition-colors">
            Tokens
          </NuxtLink>
          <NuxtLink to="/components" class="hover:text-slate-900 dark:hover:text-white transition-colors">
            Componentes
          </NuxtLink>
          <NuxtLink to="/templates" class="hover:text-slate-900 dark:hover:text-white transition-colors">
            Plantillas
          </NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>
