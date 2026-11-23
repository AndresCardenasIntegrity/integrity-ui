<script setup lang="ts">
import type { IntegrityNavGroup } from '@andrescardenasintegrity/integrity-ui-nuxt/app/types/ui'

const navGroups: IntegrityNavGroup[] = [
  {
    id: 'start',
    label: 'Inicio',
    items: [
      { label: 'Resumen e Instalación', to: '/', icon: 'i-heroicons-squares-2x2', exact: true },
      { label: 'Fundamentos', to: '/foundations', icon: 'i-heroicons-swatch' },
    ],
  },
  {
    id: 'ui',
    label: 'Librería UI',
    items: [
      { label: 'Componentes Base', to: '/components', icon: 'i-heroicons-cube' },
      { label: 'Datos y Seguimiento', to: '/data', icon: 'i-heroicons-table-cells' },
    ],
  },
  {
    id: 'templates',
    label: 'Templates',
    items: [
      { label: 'Galería de Plantillas', to: '/templates', icon: 'i-heroicons-window', exact: true },
      { label: 'Dashboard Admin', to: '/templates/dashboard', icon: 'i-heroicons-chart-bar-square' },
      { label: 'Login Corporativo', to: '/templates/login', icon: 'i-heroicons-lock-closed' },
    ],
  },
]
</script>

<template>
  <IntegrityAppShell
    brand-name="Integrity UI/UX"
    brand-subtitle="Design System v1.0"
    :nav-groups="navGroups"
    max-width="7xl"
  >
    <slot />
  </IntegrityAppShell>
</template>
