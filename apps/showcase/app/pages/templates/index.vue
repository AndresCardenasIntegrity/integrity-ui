<script setup lang="ts">
const templates = [
  {
    title: 'Tablero de Estados de Servicios',
    description: 'Página pública de monitoreo por entorno (PROD/QA) con banner general, incidentes activos, mantenimiento programado, cápsulas interactivas de uptime de 60 días e historial de 30 días.',
    to: '/templates/status',
    icon: 'i-heroicons-signal',
    badge: 'Status Board',
  },
  {
    title: 'Chat para Agente IA',
    description: 'Interfaz corporativa a pantalla completa para asistentes IA con historial deslizable, selector de entorno PROD/QA, Markdown con JSON, logs PM2 ANSI, guías paso a paso y confirmación de acciones.',
    to: '/templates/agent',
    icon: 'i-heroicons-sparkles',
    badge: 'Agente IA',
  },
  {
    title: 'Efectos de Carga y Transición',
    description: 'Laboratorio interactivo de los dos overlays oficiales de carga: animación de bienvenida al hacer login (IntegrityWelcomeOverlay) y transición esmerilada al cambiar de entorno (IntegrityEnvironmentOverlay).',
    to: '/templates/transitions',
    icon: 'i-heroicons-arrow-path',
    badge: 'Overlays',
  },
  {
    title: 'Dashboard Administrativo + CRUD',
    description: 'Estructura base con métricas KPI, filtros rápidos, tabla tipada, modal de alta y confirmación.',
    to: '/templates/dashboard',
    icon: 'i-heroicons-chart-bar-square',
    badge: 'Layout Admin',
  },
  {
    title: 'Login Corporativo Integrity',
    description: 'Pantalla completa minimalista con panel de identidad Integrity, validación, efecto de bienvenida animado y modo oscuro.',
    to: '/templates/login',
    icon: 'i-heroicons-lock-closed',
    badge: 'Pantalla Completa',
  },
]
</script>

<template>
  <div class="space-y-6">
    <IntegrityPageHeader
      eyebrow="Plantillas de Referencia"
      title="Templates Estandarizados"
      subtitle="Usa estas pantallas como punto de partida para cada nuevo proyecto de cliente."
    />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <IntegrityCard
        v-for="tpl in templates"
        :key="tpl.to"
        hoverable
      >
        <div class="flex items-start justify-between gap-3 mb-4">
          <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-950/70 text-accent dark:text-brand-300">
            <Icon :name="tpl.icon" class="h-6 w-6" />
          </span>
          <IntegrityBadge tone="brand">{{ tpl.badge }}</IntegrityBadge>
        </div>
        <h2 class="text-base font-semibold text-slate-900 dark:text-slate-50">
          {{ tpl.title }}
        </h2>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-5">
          {{ tpl.description }}
        </p>
        <NuxtLink :to="tpl.to">
          <IntegrityButton icon-right="i-heroicons-arrow-top-right-on-square">
            Abrir plantilla en vista previa
          </IntegrityButton>
        </NuxtLink>
      </IntegrityCard>
    </div>
  </div>
</template>
