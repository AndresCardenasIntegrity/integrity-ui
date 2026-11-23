<script setup lang="ts">
import { computed, ref, shallowRef } from 'vue'
import type {
  IntegrityMultiSelectOption,
  IntegritySelectOption,
  IntegrityTabItem,
  IntegrityTableColumn,
  IntegrityTimelineEvent,
} from '@andrescardenasintegrity/integrity-ui-nuxt/app/types/ui'

const { success, info, warning } = useIntegrityToast()
const { confirm } = useIntegrityConfirm()

// Workbench tabs (shadcn.com interactive gallery switcher)
const workbenchTab = shallowRef('components')
const workbenchTabs: IntegrityTabItem[] = [
  { value: 'components', label: 'Componentes', icon: 'i-heroicons-squares-2x2' },
  { value: 'dashboard', label: 'Operación', icon: 'i-heroicons-table-cells' },
  { value: 'install', label: 'Instalación', icon: 'i-heroicons-command-line' },
]

// Live interactive state inside the shadcn-style bento grid
const serviceName = shallowRef('Portal de Facturación')
const serviceEnv = shallowRef('prod')
const alertEmails = ref<string[]>(['ops@integrity-la.com', 'alertas@integrity-la.com'])
const assignedTeam = ref<string[]>(['andres', 'sofia'])
const statusFilterTab = shallowRef('all')
const drawerOpen = shallowRef(false)
const modalOpen = shallowRef(false)

const envOptions: IntegritySelectOption[] = [
  { label: 'Producción (PROD)', value: 'prod' },
  { label: 'Calidad (QA)', value: 'qa' },
  { label: 'Desarrollo (DEV)', value: 'dev' },
]

const teamOptions: IntegrityMultiSelectOption[] = [
  { value: 'andres', label: 'Andrés Cárdenas', description: 'andres.cardenas@integrity-la.com', meta: 'LEAD' },
  { value: 'sofia', label: 'Sofía Ramírez', description: 'sofia.ramirez@integrity-la.com', meta: 'OPS' },
  { value: 'carlos', label: 'Carlos Mendoza', description: 'carlos.mendoza@integrity-la.com', meta: 'DEV' },
  { value: 'laura', label: 'Laura Torres', description: 'laura.torres@integrity-la.com', meta: 'QA' },
]

const pillTabs: IntegrityTabItem[] = [
  { value: 'all', label: 'Todos', badge: 24 },
  { value: 'online', label: 'En línea', badge: 22 },
  { value: 'alerts', label: 'Alertas', badge: 2 },
]

const recentEvents: IntegrityTimelineEvent[] = [
  {
    at: '2026-11-23T15:12:00Z',
    kind: 'api',
    title: 'Despliegue v1.0.0 verificado',
    detail: 'Build limpio y paquetes validados en GitHub Packages.',
    http: 200,
  },
  {
    at: '2026-11-23T14:40:00Z',
    kind: 'email',
    title: 'Alerta enviada a responsables',
    detail: 'Confirmación entregada a ops@integrity-la.com.',
  },
  {
    at: '2026-11-23T13:55:00Z',
    kind: 'status',
    title: 'SLA operativo en 99.96%',
  },
]

// Live table tab state
const tableSearch = shallowRef('')
const tablePage = shallowRef(1)
const tablePageSize = shallowRef(4)

const tableColumns: IntegrityTableColumn[] = [
  { key: 'folio', label: 'Folio', type: 'mono' },
  { key: 'cliente', label: 'Cliente' },
  { key: 'clabe', label: 'CLABE' },
  {
    key: 'estatus',
    label: 'Estado',
    type: 'badge',
    map: { ok: 'Operacional', warn: 'Pendiente', err: 'Rechazado' },
    tones: { ok: 'operational', warn: 'degraded', err: 'down' },
  },
  { key: 'monto', label: 'Monto (MXN)', type: 'number', align: 'right' },
]

const demoRows = [
  { id: 1, folio: 'INT-2026-1042', cliente: 'Seguros Horizonte S.A.', clabe: '012180015928374612', estatus: 'ok', monto: 48500 },
  { id: 2, folio: 'INT-2026-1043', cliente: 'Grupo Industrial Norte', clabe: '002180700481920345', estatus: 'warn', monto: 129300 },
  { id: 3, folio: 'INT-2026-1044', cliente: 'Logística Pacífico', clabe: '072180009182736451', estatus: 'err', monto: 17420 },
  { id: 4, folio: 'INT-2026-1045', cliente: 'Servicios Médicos Sur', clabe: '014180655019283746', estatus: 'ok', monto: 92150 },
  { id: 5, folio: 'INT-2026-1046', cliente: 'Energía Central MX', clabe: '044180221908374622', estatus: 'ok', monto: 63800 },
  { id: 6, folio: 'INT-2026-1047', cliente: 'Fintech Enlace Digital', clabe: '072180550192837465', estatus: 'ok', monto: 84900 },
]

const filteredDemoRows = computed(() => {
  const q = tableSearch.value.trim().toLowerCase()
  if (!q) return demoRows
  return demoRows.filter(r =>
    r.folio.toLowerCase().includes(q) || r.cliente.toLowerCase().includes(q),
  )
})

const pagedDemoRows = computed(() => {
  const start = (tablePage.value - 1) * tablePageSize.value
  return filteredDemoRows.value.slice(start, start + tablePageSize.value)
})

// Snippets
const npmrcSnippet = `@andrescardenasintegrity:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=\${NODE_AUTH_TOKEN}`

const installCmd = 'pnpm add @andrescardenasintegrity/integrity-ui-nuxt'

const nuxtConfigSnippet = `export default defineNuxtConfig({
  extends: ['@andrescardenasintegrity/integrity-ui-nuxt'],
})`

const reactPresetSnippet = `import integrityPreset from '@andrescardenasintegrity/integrity-tokens/preset'

export default {
  presets: [integrityPreset],
  content: ['./src/**/*.{ts,tsx}'],
}`

async function copyText(text: string, label: string) {
  if (!import.meta.client) return
  try {
    await navigator.clipboard.writeText(text)
    success(`${label} copiado al portapapeles.`)
  } catch {
    // ignore clipboard restrictions
  }
}

function submitQuickForm() {
  success(`Servicio "${serviceName.value}" guardado para ${serviceEnv.value.toUpperCase()}.`, 'Configuración actualizada')
}

async function triggerCriticalAction() {
  const ok = await confirm({
    type: 'danger',
    title: 'Revocar credenciales del entorno',
    message: 'Esta acción invalidará los tokens activos y requiere confirmación protegida.',
    dangerNote: 'Espera el contador de seguridad antes de confirmar.',
    confirmDelaySeconds: 3,
    confirmText: 'Sí, revocar',
  })
  if (ok) {
    warning('Credenciales revocadas (simulación).', 'Confirmado')
  }
}
</script>

<template>
  <div class="space-y-12">
    <!-- Hero Section (shadcn.com centered editorial typography) -->
    <section class="mx-auto flex max-w-3xl flex-col items-center text-center pt-2 sm:pt-4">
      <NuxtLink
        to="/components"
        class="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-zinc-800 bg-slate-50/80 dark:bg-zinc-900/80 px-3 py-1 text-xs font-medium text-slate-700 dark:text-zinc-300 hover:border-slate-300 dark:hover:border-zinc-700 transition-colors mb-5"
      >
        <span class="h-1.5 w-1.5 rounded-full bg-accent dark:bg-brand-400" />
        <span>Integrity UI/UX v1.0 · Nuxt 4 Layer + Tokens</span>
        <Icon name="i-heroicons-arrow-right" class="h-3.5 w-3.5 text-slate-400" />
      </NuxtLink>

      <h1 class="text-3xl sm:text-5xl font-bold tracking-tight text-slate-950 dark:text-white leading-[1.12]">
        El estándar visual para construir todos los productos de
        <span class="text-accent dark:text-brand-400">Integrity</span>.
      </h1>

      <p class="mt-4 max-w-2xl text-sm sm:text-base text-slate-600 dark:text-zinc-400 leading-relaxed">
        Tokens agnósticos de framework, 25 componentes empresariales listos para Nuxt 4, modo claro y oscuro de primera clase y plantillas operativas con identidad 100% Integrity.
      </p>

      <div class="mt-7 flex flex-wrap items-center justify-center gap-3">
        <NuxtLink to="/components">
          <IntegrityButton size="md" icon="i-heroicons-cube">
            Explorar componentes
          </IntegrityButton>
        </NuxtLink>
        <NuxtLink to="/templates/dashboard">
          <IntegrityButton size="md" variant="outline" icon="i-heroicons-window">
            Ver Dashboard Admin
          </IntegrityButton>
        </NuxtLink>
      </div>

      <!-- Compact copyable install bar (signature shadcn.com touch) -->
      <div class="mt-6 inline-flex max-w-full items-center gap-2 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/80 pl-3.5 pr-1.5 py-1.5">
        <span class="font-mono text-xs text-slate-400 select-none">$</span>
        <code class="font-mono text-xs text-slate-800 dark:text-zinc-200 truncate">
          {{ installCmd }}
        </code>
        <button
          type="button"
          aria-label="Copiar comando de instalación"
          class="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-500 hover:bg-slate-200/70 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white transition-colors"
          @click="copyText(installCmd, 'Comando')"
        >
          <Icon name="i-heroicons-clipboard-document" class="h-3.5 w-3.5" />
        </button>
      </div>
    </section>

    <!-- Interactive Workbench Showcase (shadcn.com framed multi-tab preview) -->
    <section class="space-y-4">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <IntegrityTabs v-model="workbenchTab" :items="workbenchTabs" variant="pills" size="sm" />

        <div class="flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400 shrink-0">
          <span class="inline-flex items-center gap-1.5">
            <span class="h-2 w-2 rounded-full bg-accent dark:bg-brand-400" />
            <span class="font-mono">#273679</span>
          </span>
          <span aria-hidden="true">·</span>
          <span>Inter + JetBrains Mono</span>
        </div>
      </div>

      <!-- Framed Canvas -->
      <div class="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-950/60 p-4 sm:p-6 shadow-subtle">
        <!-- TAB 1: Live Bento Showcase -->
        <div v-if="workbenchTab === 'components'" class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <!-- Column 1: Operational Form & Alert -->
          <div class="lg:col-span-4 space-y-5">
            <IntegrityCard
              title="Nuevo servicio operativo"
              subtitle="Formularios tipados con validación y listas de correos."
            >
              <form class="space-y-4" @submit.prevent="submitQuickForm">
                <IntegrityInput
                  v-model="serviceName"
                  label="Nombre del módulo"
                  icon="i-heroicons-cube"
                  required
                />
                <IntegritySelect
                  v-model="serviceEnv"
                  label="Entorno de despliegue"
                  :options="envOptions"
                />
                <IntegrityEmailListInput
                  v-model="alertEmails"
                  label="Correos de notificación"
                  hint="Pega varios correos separados por ;"
                />
                <div class="flex items-center justify-end gap-2 pt-1">
                  <IntegrityButton variant="ghost" size="sm" @click="info('Cambios descartados.')">
                    Cancelar
                  </IntegrityButton>
                  <IntegrityButton type="submit" size="sm" icon="i-heroicons-check">
                    Guardar
                  </IntegrityButton>
                </div>
              </form>
            </IntegrityCard>

            <IntegrityAlert tone="info" title="Herencia automática del Layer">
              Un solo <span class="font-mono text-xs">extends</span> aplica tokens, fuentes, Heroicons y 25 componentes en cualquier proyecto Nuxt 4.
            </IntegrityAlert>
          </div>

          <!-- Column 2: KPIs, MultiSelect & Tabs -->
          <div class="lg:col-span-4 space-y-5">
            <div class="grid grid-cols-2 gap-4">
              <IntegrityStatCard
                label="Disponibilidad"
                value="99.96%"
                delta="SLA OK"
                delta-tone="operational"
                trend="up"
                icon="i-heroicons-signal"
                tone="operational"
              />
              <IntegrityStatCard
                label="Solicitudes hoy"
                :value="1482"
                delta="+8.4%"
                delta-tone="brand"
                trend="up"
                icon="i-heroicons-bolt"
                tone="brand"
              />
            </div>

            <IntegrityCard
              title="Responsables asignados"
              subtitle="Selector múltiple con búsqueda y límite configurable."
            >
              <div class="space-y-4">
                <IntegrityMultiSelect
                  v-model="assignedTeam"
                  label="Equipo operativo"
                  :options="teamOptions"
                  :max-selections="4"
                />

                <div class="pt-2 border-t border-slate-100 dark:border-zinc-800/80">
                  <p class="text-xs font-medium text-slate-600 dark:text-zinc-400 mb-2">
                    Estados semánticos oficiales
                  </p>
                  <div class="flex flex-wrap gap-1.5">
                    <IntegrityBadge tone="brand" dot>Integrity</IntegrityBadge>
                    <IntegrityBadge tone="operational" dot>Operacional</IntegrityBadge>
                    <IntegrityBadge tone="degraded" dot>Degradado</IntegrityBadge>
                    <IntegrityBadge tone="down" dot>Caído</IntegrityBadge>
                    <IntegrityBadge tone="maintenance" dot>Mantenimiento</IntegrityBadge>
                  </div>
                </div>
              </div>
            </IntegrityCard>

            <IntegrityCard padding="sm">
              <IntegrityTabs v-model="statusFilterTab" :items="pillTabs" variant="pills" size="sm" full-width />
            </IntegrityCard>
          </div>

          <!-- Column 3: Sensitive Data, Overlays & Audit Timeline -->
          <div class="lg:col-span-4 space-y-5">
            <IntegrityCard
              title="Seguridad y Overlays"
              subtitle="Datos enmascarados y confirmaciones protegidas."
            >
              <div class="space-y-4">
                <div class="flex items-center justify-between gap-3 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-950/60 px-3 py-2.5">
                  <div>
                    <p class="text-[11px] font-medium text-slate-500 dark:text-zinc-400">CLABE concentradora</p>
                    <IntegritySensitiveCell
                      value="012180015928374612"
                      reveal-key="home-demo-clabe"
                      label="cuenta CLABE"
                      require-confirm
                    />
                  </div>
                  <IntegrityBadge tone="neutral" size="sm">Auditado</IntegrityBadge>
                </div>

                <div class="grid grid-cols-2 gap-2">
                  <IntegrityButton size="sm" variant="outline" icon="i-heroicons-window" @click="modalOpen = true">
                    Modal
                  </IntegrityButton>
                  <IntegrityButton size="sm" variant="outline" icon="i-heroicons-bars-3-bottom-right" @click="drawerOpen = true">
                    Drawer
                  </IntegrityButton>
                  <IntegrityButton size="sm" variant="secondary" icon="i-heroicons-bell" @click="success('Notificación de prueba entregada.')">
                    Toast
                  </IntegrityButton>
                  <IntegrityButton size="sm" variant="danger" icon="i-heroicons-shield-exclamation" @click="triggerCriticalAction">
                    Confirm 3s
                  </IntegrityButton>
                </div>
              </div>
            </IntegrityCard>

            <IntegrityCard title="Trazabilidad reciente" padding="sm">
              <IntegrityTimeline :events="recentEvents" />
            </IntegrityCard>
          </div>
        </div>

        <!-- TAB 2: Operational Data Table Preview -->
        <div v-else-if="workbenchTab === 'dashboard'" class="space-y-4">
          <IntegrityCard
            title="Vista operativa en vivo"
            subtitle="Tabla tipada con datos sensibles, búsqueda y paginación estándar."
            padding="none"
          >
            <template #actions>
              <NuxtLink to="/templates/dashboard">
                <IntegrityButton size="sm" variant="outline" icon-right="i-heroicons-arrow-up-right">
                  Abrir plantilla completa
                </IntegrityButton>
              </NuxtLink>
            </template>

            <div class="p-4 border-b border-slate-100 dark:border-zinc-800 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <div class="w-full sm:max-w-xs">
                <IntegrityInput
                  v-model="tableSearch"
                  placeholder="Filtrar por folio o cliente…"
                  icon="i-heroicons-magnifying-glass"
                />
              </div>
              <span class="text-xs text-slate-500 dark:text-zinc-400 tabular-nums">
                {{ filteredDemoRows.length }} registros encontrados
              </span>
            </div>

            <IntegrityDataTable :columns="tableColumns" :rows="pagedDemoRows">
              <template #cell-clabe="{ row }">
                <IntegritySensitiveCell
                  :value="String(row.clabe)"
                  :reveal-key="`home-table-${row.id}`"
                  label="número CLABE"
                  require-confirm
                />
              </template>
            </IntegrityDataTable>

            <template #footer>
              <IntegrityPagination
                v-model:page="tablePage"
                v-model:page-size="tablePageSize"
                :total="filteredDemoRows.length"
                :page-size-options="[4, 6, 10]"
                item-label="solicitudes"
              />
            </template>
          </IntegrityCard>
        </div>

        <!-- TAB 3: Quickstart Installation -->
        <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <IntegrityCard
            title="Integración en Nuxt 4"
            subtitle="Configura GitHub Packages y extiende el Layer oficial."
          >
            <div class="space-y-4">
              <IntegrityCodeBlock
                title=".npmrc"
                language="bash"
                :code="npmrcSnippet"
                :show-line-numbers="false"
              />
              <IntegrityCodeBlock
                title="nuxt.config.ts"
                language="ts"
                :code="nuxtConfigSnippet"
                :show-line-numbers="false"
              />
            </div>
          </IntegrityCard>

          <IntegrityCard
            title="Tokens agnósticos (React / Tailwind)"
            subtitle="Comparte exactamente los mismos colores, tipografía y radios."
          >
            <div class="space-y-4">
              <p class="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                El paquete <code class="font-mono text-xs break-all text-slate-900 dark:text-zinc-100">@andrescardenasintegrity/integrity-tokens</code> no tiene dependencias de Vue ni Nuxt y ofrece exports duales ESM/CJS.
              </p>
              <IntegrityCodeBlock
                title="tailwind.config.js"
                language="js"
                :code="reactPresetSnippet"
                :show-line-numbers="false"
              />
            </div>
          </IntegrityCard>
        </div>
      </div>
    </section>

    <!-- Bottom Directory Strip (clean hairline 4-column index) -->
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <NuxtLink
        to="/foundations"
        class="group rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-5 transition-colors hover:border-slate-300 dark:hover:border-zinc-700"
      >
        <Icon name="i-heroicons-swatch" class="h-5 w-5 text-accent dark:text-brand-400 mb-3" />
        <h2 class="text-sm font-semibold text-slate-950 dark:text-white group-hover:text-accent dark:group-hover:text-brand-300 transition-colors">
          Fundamentos
        </h2>
        <p class="mt-1 text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
          Paleta azul Integrity, estados semánticos, tipografía y superficies Light/Dark.
        </p>
      </NuxtLink>

      <NuxtLink
        to="/components"
        class="group rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-5 transition-colors hover:border-slate-300 dark:hover:border-zinc-700"
      >
        <Icon name="i-heroicons-cube" class="h-5 w-5 text-accent dark:text-brand-400 mb-3" />
        <h2 class="text-sm font-semibold text-slate-950 dark:text-white group-hover:text-accent dark:group-hover:text-brand-300 transition-colors">
          25 Componentes
        </h2>
        <p class="mt-1 text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
          Formularios, selectores múltiples, tabs, drawers, modales, skeletons y toasts.
        </p>
      </NuxtLink>

      <NuxtLink
        to="/data"
        class="group rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-5 transition-colors hover:border-slate-300 dark:hover:border-zinc-700"
      >
        <Icon name="i-heroicons-table-cells" class="h-5 w-5 text-accent dark:text-brand-400 mb-3" />
        <h2 class="text-sm font-semibold text-slate-950 dark:text-white group-hover:text-accent dark:group-hover:text-brand-300 transition-colors">
          Datos y Auditoría
        </h2>
        <p class="mt-1 text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
          KPIs, tablas administrativas tipadas, paginación, datos sensibles y timeline.
        </p>
      </NuxtLink>

      <NuxtLink
        to="/templates"
        class="group rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-5 transition-colors hover:border-slate-300 dark:hover:border-zinc-700"
      >
        <Icon name="i-heroicons-window" class="h-5 w-5 text-accent dark:text-brand-400 mb-3" />
        <h2 class="text-sm font-semibold text-slate-950 dark:text-white group-hover:text-accent dark:group-hover:text-brand-300 transition-colors">
          Plantillas y Starter
        </h2>
        <p class="mt-1 text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
          Pantallas completas de Dashboard Admin y Login corporativo listas para replicar.
        </p>
      </NuxtLink>
    </section>

    <!-- Live Demo Overlays -->
    <IntegrityModal
      v-model:open="modalOpen"
      title="Vista previa de IntegrityModal"
      subtitle="Diálogo centrado con cierre por Escape o clic en el fondo."
    >
      <p class="text-sm text-slate-600 dark:text-zinc-400">
        Todos los diálogos mantienen encabezado limpio, cuerpo con scroll discreto y barra de acciones consistente.
      </p>
      <template #footer="{ close }">
        <IntegrityButton variant="ghost" @click="close">Cerrar</IntegrityButton>
        <IntegrityButton @click="close(); success('Acción confirmada desde el modal.')">
          Confirmar
        </IntegrityButton>
      </template>
    </IntegrityModal>

    <IntegrityDrawer
      v-model:open="drawerOpen"
      title="Panel lateral IntegrityDrawer"
      subtitle="Ideal para edición contextual y detalles de auditoría."
    >
      <div class="space-y-4">
        <IntegrityInput v-model="serviceName" label="Nombre del servicio" />
        <IntegritySelect v-model="serviceEnv" label="Entorno" :options="envOptions" />
        <IntegrityEmailListInput v-model="alertEmails" label="Alertas" />
      </div>
      <template #footer="{ close }">
        <IntegrityButton variant="ghost" @click="close">Cancelar</IntegrityButton>
        <IntegrityButton @click="close(); success('Cambios aplicados desde el drawer.')">
          Aplicar
        </IntegrityButton>
      </template>
    </IntegrityDrawer>
  </div>
</template>
