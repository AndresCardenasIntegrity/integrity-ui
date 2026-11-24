<script setup lang="ts">
import { computed, onMounted, reactive, shallowRef } from 'vue'
import type {
  IntegrityBadgeTone,
  IntegritySelectOption,
  IntegrityTabItem,
} from '@integritysoftwarela/integrity-ui-nuxt/app/types/ui'

definePageMeta({
  layout: false,
})

type ServiceStatus = 'operational' | 'degraded' | 'down' | 'maintenance'

interface UptimeDay {
  date: string
  dateLabel: string
  status: ServiceStatus
  note?: string
  duration?: string
}

interface SubComponentItem {
  id: string
  name: string
  status: ServiceStatus
  uptimePct: string
  history: UptimeDay[]
}

interface ServiceItem {
  id: string
  name: string
  environment: string
  status: ServiceStatus
  uptimePct: string
  history: UptimeDay[]
  components: SubComponentItem[]
}

interface IncidentItem {
  id: string
  severity: 'critical' | 'warning' | 'info'
  status: 'investigating' | 'monitoring' | 'resolved'
  service: string
  component?: string
  title: string
  description: string
  startedAt: string
  resolvedAt?: string
  duration?: string
  dateGroup: string
}

interface MaintenanceItem {
  id: string
  status: 'scheduled' | 'in_progress'
  service: string
  title: string
  description: string
  start: string
  end: string
}

interface EnvironmentBoard {
  id: 'prod' | 'qa'
  label: string
  overallStatus: ServiceStatus
  overallTitle: string
  overallDescription: string
  activeIncidents: IncidentItem[]
  maintenance: MaintenanceItem[]
  services: ServiceItem[]
  historyIncidents: IncidentItem[]
}

const { isDark, toggleTheme, initTheme } = useIntegrityTheme()
const { success } = useIntegrityToast()

onMounted(() => initTheme())

const selectedEnv = shallowRef<'all' | 'prod' | 'qa'>('prod')
const activeView = shallowRef<'status' | 'history'>('status')
const lastUpdated = shallowRef('23/11/2026, 17:45:00')
const isRefreshing = shallowRef(false)
const expandedServices = reactive<Record<string, boolean>>({
  'prod-api': true,
})

const selectedDay = shallowRef<{
  serviceName: string
  day: UptimeDay
} | null>(null)

const envOptions: IntegritySelectOption[] = [
  { value: 'prod', label: 'Producción (PROD)', description: 'Servicios productivos en línea', meta: 'PROD' },
  { value: 'qa', label: 'Calidad (QA)', description: 'Ambiente de pruebas y validación', meta: 'QA' },
  { value: 'all', label: 'Todos los entornos', description: 'Vista consolidada PROD + QA', meta: 'ALL' },
]

const viewTabs: IntegrityTabItem[] = [
  { value: 'status', label: 'Estado actual', icon: 'i-heroicons-signal' },
  { value: 'history', label: 'Historial (30 días)', icon: 'i-heroicons-clock', badge: 3 },
]

function buildHistory(overrides: Record<number, { status: ServiceStatus; note: string; duration?: string }> = {}): UptimeDay[] {
  const days: UptimeDay[] = []
  const baseDate = new Date('2026-11-23T12:00:00Z')
  for (let offset = 59; offset >= 0; offset--) {
    const d = new Date(baseDate)
    d.setUTCDate(baseDate.getUTCDate() - offset)
    const iso = d.toISOString().slice(0, 10)
    const label = d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })
    const custom = overrides[offset]
    days.push({
      date: iso,
      dateLabel: label,
      status: custom?.status ?? 'operational',
      note: custom?.note,
      duration: custom?.duration,
    })
  }
  return days
}

const boards: EnvironmentBoard[] = [
  {
    id: 'prod',
    label: 'Producción',
    overallStatus: 'operational',
    overallTitle: 'Todos los sistemas operacionales',
    overallDescription: 'Todos los servicios y componentes críticos de producción responden dentro de los umbrales SLA.',
    activeIncidents: [],
    maintenance: [
      {
        id: 'mnt-1',
        status: 'scheduled',
        service: 'Base de Datos Analítica',
        title: 'Actualización programada de índices y respaldo en caliente',
        description: 'Mantenimiento preventivo sin interrupción del flujo transaccional principal.',
        start: '26 nov 2026 · 02:00 CST',
        end: '26 nov 2026 · 03:30 CST',
      },
    ],
    services: [
      {
        id: 'prod-api',
        name: 'API Gateway & Autenticación',
        environment: 'Producción · Cluster MX',
        status: 'operational',
        uptimePct: '99.98%',
        history: buildHistory({
          14: { status: 'degraded', note: 'Incremento temporal de latencia (>450ms) mitigado por autoescalado.', duration: '14m' },
          38: { status: 'maintenance', note: 'Rotación programada de certificados TLS.', duration: '20m' },
        }),
        components: [
          {
            id: 'prod-api-core',
            name: 'Endpoints REST v2',
            status: 'operational',
            uptimePct: '99.99%',
            history: buildHistory({
              14: { status: 'degraded', note: 'Picos breves en /v2/webhooks.', duration: '14m' },
            }),
          },
          {
            id: 'prod-api-auth',
            name: 'OAuth2 & Gestión de Sesiones',
            status: 'operational',
            uptimePct: '100.00%',
            history: buildHistory(),
          },
        ],
      },
      {
        id: 'prod-workers',
        name: 'Procesador de Lotes y Notificaciones',
        environment: 'Producción · PM2 Workers',
        status: 'operational',
        uptimePct: '99.95%',
        history: buildHistory({
          7: { status: 'degraded', note: 'Cola SMTP con demora de entrega de 3 minutos.', duration: '18m' },
        }),
        components: [
          {
            id: 'prod-workers-queue',
            name: 'Worker de Despacho Financiero',
            status: 'operational',
            uptimePct: '99.99%',
            history: buildHistory(),
          },
          {
            id: 'prod-workers-mail',
            name: 'Servicio de Correos Transaccionales',
            status: 'operational',
            uptimePct: '99.91%',
            history: buildHistory({
              7: { status: 'degraded', note: 'Reintentos SMTP por throttling del proveedor.', duration: '18m' },
            }),
          },
        ],
      },
      {
        id: 'prod-portal',
        name: 'Portal Administrativo Web',
        environment: 'Producción · CDN + SSR',
        status: 'operational',
        uptimePct: '100.00%',
        history: buildHistory({
          42: { status: 'maintenance', note: 'Despliegue de Integrity UI v1.0.', duration: '10m' },
        }),
        components: [
          {
            id: 'prod-portal-ui',
            name: 'Frontend Nuxt SSR',
            status: 'operational',
            uptimePct: '100.00%',
            history: buildHistory(),
          },
        ],
      },
    ],
    historyIncidents: [
      {
        id: 'inc-hist-1',
        severity: 'warning',
        status: 'resolved',
        service: 'Procesador de Lotes y Notificaciones',
        component: 'Servicio de Correos Transaccionales',
        title: 'Demora en envío de notificaciones por correo',
        description: 'Se detectó throttling temporal en el relay SMTP; la cola se drenó automáticamente sin pérdida de mensajes.',
        startedAt: '16:10',
        resolvedAt: '16:28',
        duration: '18m',
        dateGroup: 'Hace 7 días',
      },
      {
        id: 'inc-hist-2',
        severity: 'warning',
        status: 'resolved',
        service: 'API Gateway & Autenticación',
        component: 'Endpoints REST v2',
        title: 'Latencia elevada en webhooks entrantes',
        description: 'Pico inusual de tráfico concurrente resuelto al escalar 2 réplicas adicionales.',
        startedAt: '11:04',
        resolvedAt: '11:18',
        duration: '14m',
        dateGroup: 'Hace 14 días',
      },
    ],
  },
  {
    id: 'qa',
    label: 'Calidad (QA)',
    overallStatus: 'degraded',
    overallTitle: 'Degradación parcial detectada',
    overallDescription: 'Un conector externo de pruebas presenta tiempos de respuesta elevados; el resto de módulos opera con normalidad.',
    activeIncidents: [
      {
        id: 'inc-qa-1',
        severity: 'warning',
        status: 'monitoring',
        service: 'Conector Externo Sandbox',
        component: 'Webhook Receptor QA',
        title: 'Latencia intermitente en entorno sandbox de terceros',
        description: 'Las respuestas del proveedor sandbox superan 1.8s. Se activó reintento exponencial mientras se estabiliza.',
        startedAt: '23 nov 2026 · 16:40 CST',
        dateGroup: 'Hoy',
      },
    ],
    maintenance: [],
    services: [
      {
        id: 'qa-api',
        name: 'API Gateway QA',
        environment: 'Calidad · Staging',
        status: 'operational',
        uptimePct: '99.72%',
        history: buildHistory({
          3: { status: 'maintenance', note: 'Despliegue de release candidate.', duration: '12m' },
        }),
        components: [
          {
            id: 'qa-api-rest',
            name: 'Endpoints REST QA',
            status: 'operational',
            uptimePct: '99.80%',
            history: buildHistory(),
          },
        ],
      },
      {
        id: 'qa-sandbox',
        name: 'Conector Externo Sandbox',
        environment: 'Calidad · Integraciones',
        status: 'degraded',
        uptimePct: '97.40%',
        history: buildHistory({
          0: { status: 'degraded', note: 'Latencia superior a 1.8s en sandbox externo (en monitoreo).', duration: 'En curso' },
          9: { status: 'down', note: 'Ventana de caída del proveedor externo de pruebas.', duration: '42m' },
        }),
        components: [
          {
            id: 'qa-sandbox-hook',
            name: 'Webhook Receptor QA',
            status: 'degraded',
            uptimePct: '97.40%',
            history: buildHistory({
              0: { status: 'degraded', note: 'Reintentos activos por timeout del sandbox.', duration: 'En curso' },
            }),
          },
        ],
      },
    ],
    historyIncidents: [
      {
        id: 'inc-qa-hist-1',
        severity: 'critical',
        status: 'resolved',
        service: 'Conector Externo Sandbox',
        component: 'Webhook Receptor QA',
        title: 'Indisponibilidad temporal de endpoint sandbox',
        description: 'El entorno de pruebas externo devolvió 503 durante 42 minutos hasta su restablecimiento.',
        startedAt: '09:12',
        resolvedAt: '09:54',
        duration: '42m',
        dateGroup: 'Hace 9 días',
      },
    ],
  },
]

const visibleBoards = computed(() => {
  if (selectedEnv.value === 'all') return boards
  return boards.filter(b => b.id === selectedEnv.value)
})

function toggleService(id: string) {
  expandedServices[id] = !expandedServices[id]
}

function statusTone(status: ServiceStatus): IntegrityBadgeTone {
  return status
}

function statusLabel(status: ServiceStatus): string {
  const map: Record<ServiceStatus, string> = {
    operational: 'Operacional',
    degraded: 'Degradado',
    down: 'Caído',
    maintenance: 'Mantenimiento',
  }
  return map[status]
}

function statusDotClass(status: ServiceStatus): string {
  const map: Record<ServiceStatus, string> = {
    operational: 'bg-operational',
    degraded: 'bg-degraded',
    down: 'bg-down',
    maintenance: 'bg-maintenance',
  }
  return map[status]
}

function capsuleColorClass(status: ServiceStatus): string {
  const map: Record<ServiceStatus, string> = {
    operational: 'bg-emerald-500/90 hover:bg-emerald-400',
    degraded: 'bg-amber-500 hover:bg-amber-400',
    down: 'bg-red-500 hover:bg-red-400',
    maintenance: 'bg-indigo-500 hover:bg-indigo-400',
  }
  return map[status]
}

function incidentStatusLabel(status: IncidentItem['status']): string {
  if (status === 'resolved') return 'Resuelto'
  if (status === 'monitoring') return 'Monitoreando'
  return 'Investigando'
}

function refreshBoard() {
  isRefreshing.value = true
  setTimeout(() => {
    isRefreshing.value = false
    lastUpdated.value = new Date().toLocaleString('es-MX')
    success('Estados actualizados correctamente.')
  }, 450)
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-[#09090b] text-slate-900 dark:text-slate-50 antialiased">
    <!-- Public Status Board Header -->
    <header class="border-b border-slate-200 dark:border-zinc-800 bg-white/90 dark:bg-[#09090b]/90 backdrop-blur-md sticky top-0 z-40">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 py-4 sm:py-5">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div class="flex items-center gap-3 min-w-0">
            <span class="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-white shadow-subtle">
              <IntegrityMark class="h-5 w-5 sm:h-6 sm:w-6" />
            </span>
            <div class="min-w-0">
              <h1 class="text-lg sm:text-xl font-semibold tracking-tight text-slate-950 dark:text-white truncate">
                Integrity Platform
              </h1>
              <p class="text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
                Tablero de Estado de Servicios
              </p>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-2.5">
            <div class="w-48">
              <IntegritySelect
                v-model="selectedEnv"
                :options="envOptions"
              />
            </div>

            <IntegrityButton
              size="sm"
              variant="outline"
              icon="i-heroicons-arrow-path"
              :loading="isRefreshing"
              @click="refreshBoard"
            >
              Actualizar
            </IntegrityButton>

            <button
              type="button"
              :aria-label="isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
              class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors"
              @click="toggleTheme"
            >
              <Icon :name="isDark ? 'i-heroicons-sun' : 'i-heroicons-moon'" class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 mx-auto w-full max-w-6xl px-4 sm:px-6 py-8 sm:py-10 pb-24 space-y-8">
      <!-- Switcher: Live Status vs 30-day Incident History -->
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <IntegrityTabs v-model="activeView" :items="viewTabs" variant="pills" size="sm" />

        <div class="flex flex-wrap items-center gap-3.5 text-xs text-slate-500 dark:text-zinc-400">
          <span class="font-medium">Últimos 60 días:</span>
          <span class="inline-flex items-center gap-1.5">
            <span class="h-2 w-2 rounded-sm bg-emerald-500" /> Operacional
          </span>
          <span class="inline-flex items-center gap-1.5">
            <span class="h-2 w-2 rounded-sm bg-amber-500" /> Degradado
          </span>
          <span class="inline-flex items-center gap-1.5">
            <span class="h-2 w-2 rounded-sm bg-red-500" /> Caído
          </span>
          <span class="inline-flex items-center gap-1.5">
            <span class="h-2 w-2 rounded-sm bg-indigo-500" /> Mantenimiento
          </span>
        </div>
      </div>

      <!-- STATUS VIEW -->
      <div v-if="activeView === 'status'" class="space-y-12">
        <section
          v-for="board in visibleBoards"
          :key="board.id"
          class="space-y-6"
        >
          <!-- Environment Heading -->
          <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 border-b border-slate-200 dark:border-zinc-800 pb-4">
            <div>
              <p class="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                Entorno
              </p>
              <h2 class="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
                {{ board.label }}
              </h2>
            </div>
            <div class="flex items-center gap-2 text-sm text-slate-600 dark:text-zinc-300">
              <span class="h-2.5 w-2.5 rounded-full" :class="statusDotClass(board.overallStatus)" />
              <span class="font-medium">{{ board.overallTitle }}</span>
              <span class="text-slate-300 dark:text-zinc-700">·</span>
              <span class="text-slate-500 dark:text-zinc-400 tabular-nums">
                {{ board.services.length }} servicios
              </span>
            </div>
          </div>

          <!-- Overall Status Banner -->
          <div class="rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/80 dark:bg-zinc-900/50 px-5 py-4 sm:px-6">
            <div class="flex items-start gap-3">
              <span class="mt-1.5 h-3 w-3 rounded-full shrink-0" :class="statusDotClass(board.overallStatus)" />
              <div>
                <h3 class="text-base font-semibold text-slate-950 dark:text-white">
                  {{ board.overallTitle }}
                </h3>
                <p class="text-sm text-slate-600 dark:text-zinc-400 mt-0.5">
                  {{ board.overallDescription }}
                </p>
              </div>
            </div>
          </div>

          <!-- Active Incidents -->
          <div v-if="board.activeIncidents.length" class="space-y-3">
            <h3 class="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              Incidentes Activos
            </h3>
            <article
              v-for="inc in board.activeIncidents"
              :key="inc.id"
              :class="[
                'rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 border-l-4 p-5 shadow-subtle',
                inc.severity === 'critical' ? 'border-l-red-500' : inc.severity === 'warning' ? 'border-l-amber-500' : 'border-l-brand-600',
              ]"
            >
              <div class="flex flex-wrap items-center gap-2 mb-2">
                <IntegrityBadge :tone="inc.severity === 'critical' ? 'down' : 'degraded'" size="sm">
                  {{ inc.severity.toUpperCase() }}
                </IntegrityBadge>
                <span class="text-xs text-slate-500 dark:text-zinc-400">
                  {{ inc.service }}
                  <template v-if="inc.component">
                    <Icon name="i-heroicons-chevron-right" class="inline h-3.5 w-3.5" />
                    <strong class="font-medium text-slate-700 dark:text-zinc-200">{{ inc.component }}</strong>
                  </template>
                </span>
              </div>
              <h4 class="text-sm sm:text-base font-semibold text-slate-950 dark:text-white">
                {{ inc.title }}
              </h4>
              <p class="text-sm text-slate-600 dark:text-zinc-400 mt-1">
                {{ inc.description }}
              </p>
              <div class="mt-3 pt-3 border-t border-slate-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-zinc-400">
                <IntegrityBadge tone="degraded" dot size="sm">
                  {{ incidentStatusLabel(inc.status) }}
                </IntegrityBadge>
                <span class="font-mono">Iniciado: {{ inc.startedAt }}</span>
              </div>
            </article>
          </div>

          <!-- Scheduled Maintenance -->
          <div v-if="board.maintenance.length" class="space-y-3">
            <h3 class="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              Mantenimiento Programado
            </h3>
            <article
              v-for="mnt in board.maintenance"
              :key="mnt.id"
              class="rounded-xl border border-slate-200 dark:border-zinc-800 border-l-4 border-l-indigo-500 bg-white dark:bg-zinc-900/70 p-5 shadow-subtle"
            >
              <div class="flex flex-wrap items-center gap-2 mb-2">
                <IntegrityBadge tone="maintenance" dot size="sm">
                  {{ mnt.status === 'in_progress' ? 'En curso' : 'Programado' }}
                </IntegrityBadge>
                <span class="text-xs text-slate-500 dark:text-zinc-400">{{ mnt.service }}</span>
              </div>
              <h4 class="text-sm sm:text-base font-semibold text-slate-950 dark:text-white">
                {{ mnt.title }}
              </h4>
              <p class="text-sm text-slate-600 dark:text-zinc-400 mt-1">
                {{ mnt.description }}
              </p>
              <p class="mt-3 pt-3 border-t border-slate-100 dark:border-zinc-800 font-mono text-xs text-slate-500 dark:text-zinc-400">
                {{ mnt.start }} → {{ mnt.end }}
              </p>
            </article>
          </div>

          <!-- Expandable Services + 60-Day Uptime Bars -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                Servicios y Componentes
              </h3>
              <span class="text-xs text-slate-400 dark:text-zinc-500">
                Haz clic en cualquier barra de día para inspeccionar
              </span>
            </div>

            <div
              v-for="svc in board.services"
              :key="svc.id"
              class="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 overflow-hidden shadow-subtle"
            >
              <!-- Service Row -->
              <div class="p-4 sm:p-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <button
                  type="button"
                  class="flex items-center gap-3 text-left min-w-0 lg:w-[22rem] shrink-0 group"
                  @click="toggleService(svc.id)"
                >
                  <Icon
                    name="i-heroicons-chevron-right"
                    :class="[
                      'h-4 w-4 text-slate-400 transition-transform shrink-0',
                      expandedServices[svc.id] ? 'rotate-90 text-accent dark:text-brand-300' : '',
                    ]"
                  />
                  <div class="min-w-0 flex-1">
                    <p class="text-sm font-semibold text-slate-950 dark:text-white truncate group-hover:text-accent dark:group-hover:text-brand-300 transition-colors">
                      {{ svc.name }}
                    </p>
                    <p class="text-xs text-slate-500 dark:text-zinc-400 truncate">
                      {{ svc.environment }} · <span class="font-mono tabular-nums">{{ svc.uptimePct }}</span>
                    </p>
                  </div>
                  <IntegrityBadge :tone="statusTone(svc.status)" dot size="sm" class="shrink-0">
                    {{ statusLabel(svc.status) }}
                  </IntegrityBadge>
                </button>

                <!-- 60-day capsules -->
                <div class="flex-1 min-w-0">
                  <div class="uptime-track" role="list" :aria-label="`Historial de 60 días para ${svc.name}`">
                    <button
                      v-for="day in svc.history"
                      :key="`${svc.id}-${day.date}`"
                      type="button"
                      role="listitem"
                      :title="`${day.dateLabel}: ${statusLabel(day.status)}`"
                      :class="['uptime-capsule', capsuleColorClass(day.status)]"
                      @click="selectedDay = { serviceName: svc.name, day }"
                    />
                  </div>
                  <div class="mt-1.5 flex items-center justify-between text-[11px] text-slate-400 dark:text-zinc-500 tabular-nums">
                    <span>Hace 60 días</span>
                    <span class="font-mono">{{ svc.uptimePct }} uptime</span>
                    <span>Hoy</span>
                  </div>
                </div>
              </div>

              <!-- Expanded Subcomponents -->
              <div
                v-if="expandedServices[svc.id] && svc.components.length"
                class="border-t border-slate-200/80 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-950/60 divide-y divide-slate-200/70 dark:divide-zinc-800/70"
              >
                <div
                  v-for="comp in svc.components"
                  :key="comp.id"
                  class="px-4 sm:px-5 py-3.5 pl-9 sm:pl-12 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div class="flex items-center justify-between gap-3 min-w-0 lg:w-[19.5rem] shrink-0">
                    <div class="min-w-0">
                      <p class="text-xs sm:text-sm font-medium text-slate-800 dark:text-zinc-200 truncate">
                        {{ comp.name }}
                      </p>
                      <p class="font-mono text-[11px] text-slate-400 dark:text-zinc-500 tabular-nums">
                        {{ comp.uptimePct }}
                      </p>
                    </div>
                    <IntegrityBadge :tone="statusTone(comp.status)" dot size="sm">
                      {{ statusLabel(comp.status) }}
                    </IntegrityBadge>
                  </div>

                  <div class="flex-1 min-w-0">
                    <div class="uptime-track uptime-track--sm" role="list" :aria-label="`Historial de 60 días para ${comp.name}`">
                      <button
                        v-for="day in comp.history"
                        :key="`${comp.id}-${day.date}`"
                        type="button"
                        role="listitem"
                        :title="`${day.dateLabel}: ${statusLabel(day.status)}`"
                        :class="['uptime-capsule', capsuleColorClass(day.status)]"
                        @click="selectedDay = { serviceName: `${svc.name} › ${comp.name}`, day }"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- HISTORY VIEW (30 DAYS) -->
      <div v-else class="space-y-10">
        <section
          v-for="board in visibleBoards"
          :key="`hist-${board.id}`"
          class="space-y-5"
        >
          <div class="flex items-end justify-between border-b border-slate-200 dark:border-zinc-800 pb-4">
            <div>
              <p class="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                Historial · Últimos 30 días
              </p>
              <h2 class="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
                {{ board.label }}
              </h2>
            </div>
            <span class="text-sm text-slate-500 dark:text-zinc-400 tabular-nums">
              <strong class="text-slate-900 dark:text-white">{{ board.historyIncidents.length }}</strong> incidentes
            </span>
          </div>

          <div class="space-y-4">
            <article
              v-for="inc in board.historyIncidents"
              :key="inc.id"
              class="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-5 shadow-subtle"
            >
              <div
                class="h-1 w-full rounded-full mb-4"
                :class="inc.status === 'resolved' ? 'bg-emerald-500' : inc.severity === 'critical' ? 'bg-red-500' : 'bg-amber-500'"
              />
              <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div class="flex flex-wrap items-center gap-2">
                  <IntegrityBadge :tone="inc.severity === 'critical' ? 'down' : 'degraded'" size="sm">
                    {{ inc.severity.toUpperCase() }}
                  </IntegrityBadge>
                  <span class="text-xs text-slate-500 dark:text-zinc-400">
                    {{ inc.service }}
                    <template v-if="inc.component">
                      <Icon name="i-heroicons-chevron-right" class="inline h-3.5 w-3.5" />
                      {{ inc.component }}
                    </template>
                  </span>
                </div>
                <span class="text-xs text-slate-400 dark:text-zinc-500">{{ inc.dateGroup }}</span>
              </div>

              <h3 class="text-base font-semibold text-slate-950 dark:text-white">
                {{ inc.title }}
              </h3>
              <p class="text-sm text-slate-600 dark:text-zinc-400 mt-1">
                {{ inc.description }}
              </p>

              <div class="mt-4 space-y-1.5 text-xs">
                <div class="flex items-center gap-3">
                  <span class="font-mono text-slate-400 w-14">{{ inc.startedAt }}</span>
                  <span class="text-slate-600 dark:text-zinc-400">Incidente iniciado</span>
                </div>
                <div v-if="inc.resolvedAt" class="flex items-center gap-3">
                  <span class="font-mono text-slate-400 w-14">{{ inc.resolvedAt }}</span>
                  <span class="text-emerald-600 dark:text-emerald-400 font-medium">
                    Servicio recuperado · Duración total: {{ inc.duration }}
                  </span>
                </div>
              </div>
            </article>
          </div>
        </section>
      </div>
    </main>

    <!-- Footer -->
    <footer class="border-t border-slate-200 dark:border-zinc-800 py-6 text-center text-xs text-slate-500 dark:text-zinc-400 space-y-1">
      <p>Última actualización: <span class="font-mono">{{ lastUpdated }}</span></p>
      <p class="font-mono text-[11px] text-slate-400 dark:text-zinc-600">
        Integrity Status Board Template · v1.0.0
      </p>
    </footer>

    <!-- Day Uptime Detail Modal -->
    <IntegrityModal
      :open="Boolean(selectedDay)"
      :title="selectedDay?.day.dateLabel ?? 'Detalle del día'"
      :subtitle="selectedDay?.serviceName"
      size="sm"
      @update:open="(v) => { if (!v) selectedDay = null }"
    >
      <div v-if="selectedDay" class="space-y-3">
        <div class="flex items-center justify-between gap-2">
          <IntegrityBadge :tone="statusTone(selectedDay.day.status)" dot size="md">
            {{ statusLabel(selectedDay.day.status) }}
          </IntegrityBadge>
          <span v-if="selectedDay.day.duration" class="font-mono text-xs text-slate-500 dark:text-zinc-400">
            Duración: {{ selectedDay.day.duration }}
          </span>
        </div>

        <p class="text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
          {{ selectedDay.day.note || 'Operacional durante las 24 horas sin incidentes ni degradaciones registradas.' }}
        </p>
      </div>
    </IntegrityModal>

    <!-- Floating Template Preview Bar -->
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
          Tablero de Estados
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

<style scoped>
.uptime-track {
  display: grid;
  grid-template-columns: repeat(60, minmax(0, 1fr));
  gap: 2px;
  height: 28px;
  width: 100%;
}

.uptime-track--sm {
  height: 22px;
}

.uptime-capsule {
  height: 100%;
  width: 100%;
  border-radius: 2px;
  transition: transform 0.12s ease, opacity 0.12s ease;
  cursor: pointer;
}

.uptime-capsule:hover,
.uptime-capsule:focus-visible {
  transform: scaleY(1.12);
  outline: none;
}
</style>
