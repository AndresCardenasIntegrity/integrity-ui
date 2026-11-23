<script setup lang="ts">
import type { IntegrityNavGroup } from '@andrescardenasintegrity/integrity-ui-nuxt/app/types/ui'

const navGroups: IntegrityNavGroup[] = [
  {
    id: 'back',
    label: 'Portal Showcase',
    items: [
      { label: 'Volver a Plantillas', to: '/templates', icon: 'i-heroicons-arrow-left', exact: true },
      { label: 'Inicio Showcase', to: '/', icon: 'i-heroicons-squares-2x2', exact: true },
    ],
  },
  {
    id: 'demo',
    label: 'Módulos Admin (Demo)',
    items: [
      { label: 'Dashboard Admin', to: '/templates/dashboard', icon: 'i-heroicons-chart-bar-square' },
      { label: 'Datos y Tablas', to: '/data', icon: 'i-heroicons-table-cells' },
      { label: 'Componentes Base', to: '/components', icon: 'i-heroicons-cube' },
      { label: 'Login Corporativo', to: '/templates/login', icon: 'i-heroicons-lock-closed' },
    ],
  },
]
</script>

<template>
  <IntegrityAppShell
    brand-name="Integrity Admin"
    brand-subtitle="Template AppShell"
    :nav-groups="navGroups"
    max-width="7xl"
  >
    <slot />
  </IntegrityAppShell>
</template>
