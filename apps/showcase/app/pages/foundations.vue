<script setup lang="ts">
import { integrityTokens } from '@andrescardenasintegrity/integrity-tokens'

const { isDark, toggleTheme } = useIntegrityTheme()

const brandSwatches = Object.entries(integrityTokens.brand).map(([shade, hex]) => ({
  name: `Brand ${shade}`,
  value: hex,
  token: `bg-brand-${shade}`,
}))

const statusSwatches = [
  { name: 'Operational', value: integrityTokens.status.operational, token: '--color-operational' },
  { name: 'Degraded', value: integrityTokens.status.degraded, token: '--color-degraded' },
  { name: 'Down / Danger', value: integrityTokens.status.down, token: '--color-down' },
  { name: 'Maintenance', value: integrityTokens.status.maintenance, token: '--color-maintenance' },
]

const surfaceSwatches = [
  { name: 'Light Primary', value: '#FFFFFF', token: '--color-bg-primary' },
  { name: 'Light Secondary', value: '#FAFAFA', token: '--color-bg-secondary' },
  { name: 'Light Border', value: '#E2E8F0', token: '--color-border' },
  { name: 'Dark Primary', value: '#0A0A0A', token: '.dark --color-bg-primary' },
  { name: 'Dark Secondary', value: '#141414', token: '.dark --color-bg-secondary' },
  { name: 'Dark Sidebar', value: '#0F172A', token: '.dark --sidebar' },
]
</script>

<template>
  <div class="space-y-8">
    <IntegrityPageHeader
      eyebrow="@andrescardenasintegrity/integrity-tokens"
      title="Fundamentos Visuales"
      subtitle="Haz clic en cualquier muestra de color para copiar su valor hexadecimal. Alterna el tema para validar ambos modos."
    >
      <template #actions>
        <IntegrityButton
          variant="outline"
          :icon="isDark ? 'i-heroicons-sun' : 'i-heroicons-moon'"
          @click="toggleTheme"
        >
          {{ isDark ? 'Probar modo claro' : 'Probar modo oscuro' }}
        </IntegrityButton>
      </template>
    </IntegrityPageHeader>

    <IntegrityCard title="Paleta de Marca Integrity" subtitle="Escala oficial derivada de #273679 (claro) y #3D4F9C (oscuro).">
      <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        <ShowcaseSwatch
          v-for="item in brandSwatches"
          :key="item.name"
          :name="item.name"
          :value="item.value"
          :token="item.token"
        />
      </div>
    </IntegrityCard>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <IntegrityCard title="Estados Semánticos" subtitle="Reservados exclusivamente para estado operativo y feedback.">
        <div class="grid grid-cols-2 gap-3">
          <ShowcaseSwatch
            v-for="item in statusSwatches"
            :key="item.name"
            :name="item.name"
            :value="item.value"
            :token="item.token"
          />
        </div>
      </IntegrityCard>

      <IntegrityCard title="Superficies y Bordes" subtitle="Base minimalista neutra para tarjetas, fondos y sidebars.">
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <ShowcaseSwatch
            v-for="item in surfaceSwatches"
            :key="item.name"
            :name="item.name"
            :value="item.value"
            :token="item.token"
          />
        </div>
      </IntegrityCard>
    </div>

    <IntegrityCard title="Tipografía" subtitle="Inter para interfaz y JetBrains Mono para códigos, tablas numéricas e identificadores.">
      <div class="divide-y divide-slate-100 dark:divide-slate-800">
        <div class="py-3 flex flex-col sm:flex-row sm:items-baseline gap-2">
          <span class="w-36 shrink-0 font-mono text-xs text-slate-400">text-2xl / 600</span>
          <p class="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Título de página administrativa
          </p>
        </div>
        <div class="py-3 flex flex-col sm:flex-row sm:items-baseline gap-2">
          <span class="w-36 shrink-0 font-mono text-xs text-slate-400">text-base / 600</span>
          <p class="text-base font-semibold text-slate-900 dark:text-slate-50">
            Encabezado de tarjeta o diálogo modal
          </p>
        </div>
        <div class="py-3 flex flex-col sm:flex-row sm:items-baseline gap-2">
          <span class="w-36 shrink-0 font-mono text-xs text-slate-400">text-sm / 400</span>
          <p class="text-sm text-slate-600 dark:text-slate-400">
            Texto de cuerpo estándar para formularios, celdas de tabla y descripciones operativas.
          </p>
        </div>
        <div class="py-3 flex flex-col sm:flex-row sm:items-baseline gap-2">
          <span class="w-36 shrink-0 font-mono text-xs text-slate-400">font-mono / xs</span>
          <p class="font-mono text-xs text-accent dark:text-brand-300">
            INT-2026-00482 · CLABE 012180015928374612 · HTTP 200 OK
          </p>
        </div>
      </div>
    </IntegrityCard>

    <IntegrityCard title="Radios, Sombras e Isotipo" subtitle="Elevaciones muy sutiles y marca geométrica Integrity.">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 shadow-subtle">
          <p class="text-xs font-semibold text-slate-900 dark:text-slate-100">shadow-subtle + rounded-lg</p>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Botones, badges y tarjetas base.</p>
        </div>
        <div class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 shadow-card">
          <p class="text-xs font-semibold text-slate-900 dark:text-slate-100">shadow-card + rounded-xl</p>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Tarjetas con hover y contenedores.</p>
        </div>
        <div class="rounded-xl border border-slate-200 dark:border-slate-800 bg-brand-600 text-white p-4 flex items-center gap-3">
          <IntegrityMark class="h-8 w-8 shrink-0" />
          <div>
            <p class="text-xs font-semibold">IntegrityMark</p>
            <p class="text-[11px] text-white/75">Isotipo SVG con currentColor</p>
          </div>
        </div>
      </div>
    </IntegrityCard>
  </div>
</template>
