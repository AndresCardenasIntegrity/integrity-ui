<script setup lang="ts">
const templates = [
  {
    title: 'Dashboard Administrativo + CRUD',
    description: 'Estructura base con métricas KPI, filtros rápidos, tabla tipada, modal de alta y confirmación.',
    to: '/templates/dashboard',
    icon: 'i-heroicons-chart-bar-square',
    badge: 'Layout Admin',
  },
  {
    title: 'Login Corporativo Integrity',
    description: 'Pantalla completa minimalista con panel de identidad Integrity, validación y modo oscuro.',
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
          <IntegrityButton icon-right="i-heroicons-arrow-right">
            Abrir vista previa
          </IntegrityButton>
        </NuxtLink>
      </IntegrityCard>
    </div>
  </div>
</template>
