<script setup lang="ts">
import type { IntegrityNavGroup } from '@andrescardenasintegrity/integrity-ui-nuxt/app/types/ui'

const navGroups: IntegrityNavGroup[] = [
  {
    id: 'ops',
    label: 'Operación',
    items: [
      { label: 'Panel de servicios', to: '/templates/dashboard', icon: 'i-heroicons-chart-bar-square', exact: true },
      { label: 'Monitoreo y SLA', to: '/templates/dashboard#monitoreo', icon: 'i-heroicons-signal' },
      { label: 'Solicitudes', to: '/templates/dashboard#solicitudes', icon: 'i-heroicons-document-text', badge: '4' },
    ],
  },
  {
    id: 'admin',
    label: 'Administración',
    items: [
      { label: 'Usuarios y roles', to: '/templates/dashboard#usuarios', icon: 'i-heroicons-users' },
      { label: 'Auditoría', to: '/templates/dashboard#auditoria', icon: 'i-heroicons-clock' },
      { label: 'Configuración', to: '/templates/dashboard#configuracion', icon: 'i-heroicons-cog-6-tooth' },
    ],
  },
]
</script>

<template>
  <div class="relative min-h-screen">
    <IntegrityAppShell
      brand-name="Portal Cliente"
      brand-subtitle="Plantilla Dashboard"
      :nav-groups="navGroups"
      max-width="7xl"
      content-class="pb-20"
    >
      <slot />
    </IntegrityAppShell>

    <!-- Floating Template Preview Bar (zero overlap with sidebar or mobile header) -->
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
          Dashboard Admin
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
