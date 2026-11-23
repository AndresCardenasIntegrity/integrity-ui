<script setup lang="ts">
import type { IntegrityNavGroup } from '@andrescardenasintegrity/integrity-ui-nuxt/app/types/ui'

const navGroups: IntegrityNavGroup[] = [
  {
    id: 'main',
    label: 'Operación',
    items: [
      { label: 'Inicio', to: '/', icon: 'i-heroicons-home', exact: true },
      { label: 'Acceso', to: '/login', icon: 'i-heroicons-lock-closed' },
    ],
  },
]
</script>

<template>
  <IntegrityAppShell
    brand-name="Portal Integrity"
    brand-subtitle="Proyecto Cliente"
    :nav-groups="navGroups"
    max-width="7xl"
  >
    <slot />
  </IntegrityAppShell>
</template>
