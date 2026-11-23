<script setup lang="ts">
const nuxtConfigSnippet = `export default defineNuxtConfig({
  extends: ['@andrescardenasintegrity/integrity-ui-nuxt'],
})`

const appVueSnippet = `<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <IntegrityToastContainer />
  <IntegrityConfirmDialog />
</template>`

const reactPresetSnippet = `import integrityPreset from '@andrescardenasintegrity/integrity-tokens/preset'

export default {
  presets: [integrityPreset],
  content: ['./src/**/*.{ts,tsx}'],
}`

const highlights = [
  {
    title: 'Fundamentos y Tokens',
    description: 'Paleta 100% Integrity, estados semánticos, Inter + JetBrains Mono, sombras y soporte Light/Dark.',
    to: '/foundations',
    icon: 'i-heroicons-swatch',
    badge: '@andrescardenasintegrity/integrity-tokens',
  },
  {
    title: 'Componentes Base',
    description: 'Botones, badges, tarjetas, alertas, formularios, modales, confirmaciones con temporizador y toasts.',
    to: '/components',
    icon: 'i-heroicons-cube',
    badge: '@andrescardenasintegrity/integrity-ui-nuxt',
  },
  {
    title: 'Datos y Seguimiento',
    description: 'Tablas administrativas tipadas, celdas de datos sensibles con máscara y timelines de auditoría.',
    to: '/data',
    icon: 'i-heroicons-table-cells',
    badge: 'Operación',
  },
  {
    title: 'Plantillas de Página',
    description: 'Pantallas completas listas como referencia: Dashboard CRUD administrativo y Login corporativo.',
    to: '/templates',
    icon: 'i-heroicons-window',
    badge: 'Templates',
  },
]
</script>

<template>
  <div class="space-y-8">
    <IntegrityPageHeader
      eyebrow="Sistema de Diseño Corporativo"
      title="Integrity UI/UX"
      subtitle="Estándar visual único para todos los proyectos de la empresa: tokens agnósticos de framework, Nuxt 4 Layer reutilizable y plantillas listas para producción."
    >
      <template #actions>
        <NuxtLink to="/components">
          <IntegrityButton icon="i-heroicons-cube">
            Explorar componentes
          </IntegrityButton>
        </NuxtLink>
        <NuxtLink to="/templates/dashboard">
          <IntegrityButton variant="outline" icon="i-heroicons-window">
            Ver plantilla Dashboard
          </IntegrityButton>
        </NuxtLink>
      </template>
    </IntegrityPageHeader>

    <!-- Architecture strip -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <IntegrityCard padding="sm">
        <div class="flex items-start gap-3">
          <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-950/70 text-accent dark:text-brand-300">
            <Icon name="i-heroicons-swatch" class="h-5 w-5" />
          </span>
          <div>
            <p class="text-sm font-semibold text-slate-900 dark:text-slate-50">100% Identidad Integrity</p>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Paleta azul Integrity (<span class="font-mono">#273679</span>), superficies minimalistas y contraste cuidado en Light & Dark.
            </p>
          </div>
        </div>
      </IntegrityCard>

      <IntegrityCard padding="sm">
        <div class="flex items-start gap-3">
          <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <Icon name="i-heroicons-puzzle-piece" class="h-5 w-5" />
          </span>
          <div>
            <p class="text-sm font-semibold text-slate-900 dark:text-slate-50">Nuxt 4 Layer Empaquetado</p>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Una sola línea <span class="font-mono">extends: ['@andrescardenasintegrity/integrity-ui-nuxt']</span> hereda fuentes, CSS, Tailwind y componentes.
            </p>
          </div>
        </div>
      </IntegrityCard>

      <IntegrityCard padding="sm">
        <div class="flex items-start gap-3">
          <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <Icon name="i-heroicons-arrows-right-left" class="h-5 w-5" />
          </span>
          <div>
            <p class="text-sm font-semibold text-slate-900 dark:text-slate-50">Preparado para React</p>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
              <span class="font-mono">@andrescardenasintegrity/integrity-tokens</span> desacopla variables CSS y preset Tailwind para futuros proyectos en React.
            </p>
          </div>
        </div>
      </IntegrityCard>
    </div>

    <!-- Navigation cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <NuxtLink
        v-for="item in highlights"
        :key="item.to"
        :to="item.to"
        class="group block"
      >
        <IntegrityCard hoverable padding="md" class="h-full">
          <div class="flex items-start justify-between gap-3 mb-3">
            <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-950/70 text-accent dark:text-brand-300 group-hover:bg-accent group-hover:text-white transition-colors">
              <Icon :name="item.icon" class="h-5 w-5" />
            </span>
            <IntegrityBadge tone="brand">{{ item.badge }}</IntegrityBadge>
          </div>
          <h2 class="text-base font-semibold text-slate-900 dark:text-slate-50 group-hover:text-accent dark:group-hover:text-brand-300 transition-colors">
            {{ item.title }}
          </h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {{ item.description }}
          </p>
        </IntegrityCard>
      </NuxtLink>
    </div>

    <!-- Quickstart -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <IntegrityCard
        title="Inicio rápido en Nuxt 4"
        subtitle="Conecta un proyecto nuevo al estándar visual en 2 pasos."
      >
        <div class="space-y-4">
          <div>
            <p class="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
              1. Extiende el layer en <span class="font-mono">nuxt.config.ts</span>
            </p>
            <pre class="rounded-lg bg-slate-950 text-slate-100 p-3.5 font-mono text-xs overflow-x-auto"><code>{{ nuxtConfigSnippet }}</code></pre>
          </div>
          <div>
            <p class="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
              2. Monta toasts y confirmaciones globales en <span class="font-mono">app/app.vue</span>
            </p>
            <pre class="rounded-lg bg-slate-950 text-slate-100 p-3.5 font-mono text-xs overflow-x-auto"><code>{{ appVueSnippet }}</code></pre>
          </div>
        </div>
      </IntegrityCard>

      <IntegrityCard
        title="Consumo futuro en React + Tailwind"
        subtitle="Reutiliza exactamente la misma paleta, fuentes y variables CSS."
      >
        <div class="space-y-4">
          <p class="text-sm text-slate-600 dark:text-slate-400">
            Al mantener <span class="font-mono text-xs">@andrescardenasintegrity/integrity-tokens</span> libre de dependencias de Vue/Nuxt, cualquier proyecto React puede importar el preset de Tailwind y el archivo <span class="font-mono text-xs">@andrescardenasintegrity/integrity-tokens/css</span> sin duplicar definiciones.
          </p>
          <pre class="rounded-lg bg-slate-950 text-slate-100 p-3.5 font-mono text-xs overflow-x-auto"><code>{{ reactPresetSnippet }}</code></pre>
        </div>
      </IntegrityCard>
    </div>
  </div>
</template>
