<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef } from 'vue'

definePageMeta({
  layout: false,
})

interface ActionProposal {
  id: string
  action: string
  summary: string
  target: string
  status: 'pending' | 'executed' | 'cancelled'
}

interface GuideStep {
  title: string
  detail: string
  note?: string
}

interface GuidePayload {
  title: string
  subtitle: string
  steps: GuideStep[]
}

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  terminalLogs?: string[]
  guide?: GuidePayload
  proposal?: ActionProposal
}

interface ConversationSession {
  id: string
  title: string
  updatedAt: string
  messages: ChatMessage[]
}

const { isDark, toggleTheme, initTheme } = useIntegrityTheme()
const { success, info } = useIntegrityToast()
const { confirm } = useIntegrityConfirm()

// Environment state (demonstrates live IntegrityEnvironmentOverlay inside AI workspace)
const activeEnv = shallowRef<'PROD' | 'QA'>('PROD')
const pendingEnv = shallowRef<'PROD' | 'QA'>('PROD')
const switchingEnv = shallowRef(false)

// Chat UI state
const showHistory = shallowRef(false)
const inputText = shallowRef('')
const isThinking = shallowRef(false)
const thinkingLabel = shallowRef('Consultando telemetría…')
const messagesContainer = ref<HTMLElement | null>(null)
const textareaRef = ref<HTMLTextAreaElement | null>(null)

const initialConversations: ConversationSession[] = [
  {
    id: 'conv-pm2',
    title: 'Diagnóstico PM2 integrity-api',
    updatedAt: 'Hoy · 09:42',
    messages: [
      {
        id: 'm-1',
        role: 'user',
        content: 'Muéstrame los logs PM2 recientes de integrity-api en PROD.',
        timestamp: '09:41',
      },
      {
        id: 'm-2',
        role: 'assistant',
        content:
          'Revisé el worker **`integrity-api`** en **PROD**. El proceso completó un reinicio limpio tras rotación de caché sin errores críticos en los últimos 15 minutos:',
        timestamp: '09:42',
        terminalLogs: [
          '2026-11-24T09:40:11.012Z [PM2] [integrity-api] id=0 status=online pid=28412 mem=142MB cpu=1.4%',
          '2026-11-24T09:40:14.289Z \x1b[32mINFO\x1b[0m  healthcheck /api/health 200 OK (18ms)',
          '2026-11-24T09:40:28.504Z \x1b[33mWARN\x1b[0m  pool-db latency spike 148ms -> auto-recovered',
          '2026-11-24T09:41:02.901Z \x1b[32mINFO\x1b[0m  webhook-dispatcher synced 42 events (0 failed)',
        ],
      },
    ],
  },
  {
    id: 'conv-incident',
    title: 'Resumen incidente #408 + JSON',
    updatedAt: 'Ayer · 18:15',
    messages: [
      {
        id: 'm-3',
        role: 'user',
        content: 'Resume el incidente #408 con su payload JSON de auditoría.',
        timestamp: '18:14',
      },
      {
        id: 'm-4',
        role: 'assistant',
        content: `### Incidente #408 — Degradación parcial de Gateway

| Campo | Valor |
| --- | --- |
| Servicio | \`integrity-gateway\` |
| Entorno | \`PROD\` |
| Duración | **14 min** (resuelto) |
| Causa raíz | Límite de conexiones TLS en nodo secundario |

\`\`\`json
{
  "incidentId": "INC-408",
  "service": "integrity-gateway",
  "environment": "PROD",
  "status": "resolved",
  "impact": {
    "errorRatePct": 1.8,
    "p95LatencyMs": 412
  }
}
\`\`\``,
        timestamp: '18:15',
      },
    ],
  },
]

const conversations = ref<ConversationSession[]>(structuredClone(initialConversations))
const activeConversationId = shallowRef<string | null>(null)

const activeConversation = computed(() =>
  conversations.value.find((c) => c.id === activeConversationId.value) ?? null,
)

const activeMessages = computed<ChatMessage[]>(() => activeConversation.value?.messages ?? [])

const suggestions = [
  {
    icon: 'i-heroicons-command-line',
    title: 'Logs PM2 recientes',
    prompt: 'Ver logs PM2 recientes de integrity-api',
  },
  {
    icon: 'i-heroicons-code-bracket-square',
    title: 'Incidente #408 con JSON',
    prompt: 'Resumen del incidente #408 con payload JSON',
  },
  {
    icon: 'i-heroicons-signal',
    title: 'Estado de servicios',
    prompt: 'Mostrar estado actual de servicios críticos',
  },
  {
    icon: 'i-heroicons-clipboard-document-check',
    title: 'Guía de release + acción',
    prompt: 'Guía paso a paso para publicar un release y proponer recarga controlada',
  },
]

const thinkingSteps = [
  'Consultando telemetría…',
  'Analizando contexto operativo…',
  'Estructurando respuesta…',
]

let thinkingInterval: ReturnType<typeof setInterval> | null = null
let replyTimer: ReturnType<typeof setTimeout> | null = null
let envTimer: ReturnType<typeof setTimeout> | null = null

function clearTimers() {
  if (thinkingInterval) {
    clearInterval(thinkingInterval)
    thinkingInterval = null
  }
  if (replyTimer) {
    clearTimeout(replyTimer)
    replyTimer = null
  }
  if (envTimer) {
    clearTimeout(envTimer)
    envTimer = null
  }
}

function nowTime() {
  return new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false })
}

async function scrollToBottom() {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

function autoResize() {
  const el = textareaRef.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = `${Math.min(el.scrollHeight, 140)}px`
}

function switchEnvironment(target: 'PROD' | 'QA') {
  if (target === activeEnv.value || switchingEnv.value) return
  pendingEnv.value = target
  switchingEnv.value = true
  envTimer = setTimeout(() => {
    activeEnv.value = target
    switchingEnv.value = false
    success(`Contexto del agente cambiado a ${target}.`, 'Entorno actualizado')
  }, 1800)
}

function startNewConversation() {
  activeConversationId.value = null
  showHistory.value = false
  inputText.value = ''
  nextTick(() => {
    autoResize()
    textareaRef.value?.focus()
  })
}

function selectConversation(id: string) {
  activeConversationId.value = id
  showHistory.value = false
  scrollToBottom()
}

async function deleteConversation(session: ConversationSession) {
  const accepted = await confirm({
    type: 'danger',
    title: 'Eliminar conversación',
    message: `¿Seguro que deseas eliminar "${session.title}" del historial? Esta acción no se puede deshacer.`,
    confirmText: 'Eliminar',
    cancelText: 'Cancelar',
  })

  if (!accepted) return
  conversations.value = conversations.value.filter((c) => c.id !== session.id)
  if (activeConversationId.value === session.id) {
    activeConversationId.value = null
  }
  info('Conversación eliminada del historial.')
}

function buildSimulatedReply(prompt: string): Omit<ChatMessage, 'id' | 'role' | 'timestamp'> {
  const normalized = prompt.toLowerCase()

  if (normalized.includes('pm2') || normalized.includes('log')) {
    return {
      content: `Últimas líneas capturadas en **${activeEnv.value}** para \`integrity-api\`. No se detectan reinicios anómalos ni fugas de memoria:`,
      terminalLogs: [
        `2026-11-24T10:02:10.104Z [PM2] [integrity-api] env=${activeEnv.value} status=online uptime=14d mem=138MB`,
        '2026-11-24T10:02:14.881Z \x1b[32mINFO\x1b[0m  GET /api/v1/status 200 OK (12ms)',
        '2026-11-24T10:02:19.042Z \x1b[36mDEBUG\x1b[0m cache-layer hitRatio=98.4% keys=1240',
        '2026-11-24T10:02:25.410Z \x1b[33mWARN\x1b[0m  slow-query monitor_snapshots 184ms (threshold 150ms)',
        '2026-11-24T10:02:31.008Z \x1b[32mINFO\x1b[0m  worker heartbeat healthy · 0 pending retries',
      ],
    }
  }

  if (normalized.includes('408') || normalized.includes('json') || normalized.includes('incidente')) {
    return {
      content: `### Resumen del incidente #408 (${activeEnv.value})

Se registró un incremento temporal de latencia en el gateway de notificaciones, mitigado automáticamente por el balanceador.

| Indicador | Resultado |
| --- | --- |
| Estado | **Resuelto** |
| Disponibilidad | \`99.94%\` |
| Servicios afectados | \`integrity-gateway\`, \`notify-worker\` |

\`\`\`json
{
  "incident": "INC-408",
  "environment": "${activeEnv.value}",
  "resolved": true,
  "mttrMinutes": 14,
  "actionsTaken": [
    "scale_up_tls_pool",
    "drain_unhealthy_node",
    "verify_synthetic_probes"
  ]
}
\`\`\``,
    }
  }

  if (normalized.includes('estado') || normalized.includes('servicio')) {
    return {
      content: `### Estado actual de servicios — \`${activeEnv.value}\`

Todos los componentes principales operan dentro de los umbrales SLA definidos:

| Servicio | Estado | Uptime (30d) | Latencia p95 |
| --- | --- | --- | --- |
| Portal Corporativo | Operativo | \`99.98%\` | \`42 ms\` |
| API Gateway | Operativo | \`99.95%\` | \`68 ms\` |
| Motor de Reportes | Operativo | \`99.92%\` | \`115 ms\` |
| Cola de Notificaciones | Mantenimiento menor | \`99.89%\` | \`89 ms\` |

Puedes abrir el tablero público completo en \`/templates/status\` para inspeccionar el histórico diario.`,
    }
  }

  if (normalized.includes('guía') || normalized.includes('release') || normalized.includes('paso')) {
    return {
      content: `Preparé la guía recomendada para ejecutar un despliegue controlado en **${activeEnv.value}** junto con una propuesta de recarga segura sin caída:`,
      guide: {
        title: `Checklist de Release (${activeEnv.value})`,
        subtitle: 'Flujo estandarizado de validación antes de reiniciar workers',
        steps: [
          {
            title: 'Validar build y pruebas automáticas',
            detail: 'Confirma que `vitest`, `nuxt typecheck` y `nuxt generate` finalizaron con código 0.',
          },
          {
            title: 'Respaldar variables y configuración activa',
            detail: 'Verifica las variables del entorno destino y el estado de la cola de jobs pendientes.',
            note: 'Nunca ejecutes reinicios durante ventanas de facturación.',
          },
          {
            title: 'Aplicar reload sin tiempo de inactividad',
            detail: 'Ejecuta `pm2 reload integrity-api` y monitorea los logs durante 60 segundos.',
          },
        ],
      },
      proposal: {
        id: `prop-${Date.now()}`,
        action: 'pm2_reload_graceful',
        target: `integrity-api (${activeEnv.value})`,
        summary: 'Recargar el worker de forma escalonada (zero-downtime) y verificar /api/health.',
        status: 'pending',
      },
    }
  }

  return {
    content: `Entendido. Analicé tu consulta en el entorno **${activeEnv.value}**:

> "${prompt}"

### Siguientes acciones recomendadas
- Revisar métricas recientes del servicio correspondiente en el panel operativo.
- Verificar logs estructurados con \`IntegrityTerminalLog\` si necesitas rastrear errores en tiempo real.
- Puedes probar las tarjetas de sugerencia (PM2, JSON, Estado de servicios o Guía de release) para ver bloques interactivos completos.`,
  }
}

function sendMessage(prefill?: string) {
  const text = (prefill ?? inputText.value).trim()
  if (!text || isThinking.value) return

  let session = activeConversation.value
  if (!session) {
    const newSession: ConversationSession = {
      id: `conv-${Date.now()}`,
      title: text.length > 42 ? `${text.slice(0, 42)}…` : text,
      updatedAt: `Hoy · ${nowTime()}`,
      messages: [],
    }
    conversations.value.unshift(newSession)
    activeConversationId.value = newSession.id
    session = newSession
  }

  session.messages.push({
    id: `u-${Date.now()}`,
    role: 'user',
    content: text,
    timestamp: nowTime(),
  })
  session.updatedAt = `Hoy · ${nowTime()}`

  inputText.value = ''
  nextTick(() => autoResize())
  scrollToBottom()

  // Thinking state
  isThinking.value = true
  let stepIdx = 0
  thinkingLabel.value = thinkingSteps[0]!
  thinkingInterval = setInterval(() => {
    stepIdx = (stepIdx + 1) % thinkingSteps.length
    thinkingLabel.value = thinkingSteps[stepIdx]!
  }, 550)

  replyTimer = setTimeout(() => {
    if (thinkingInterval) {
      clearInterval(thinkingInterval)
      thinkingInterval = null
    }
    const reply = buildSimulatedReply(text)
    session?.messages.push({
      id: `a-${Date.now()}`,
      role: 'assistant',
      timestamp: nowTime(),
      ...reply,
    })
    isThinking.value = false
    scrollToBottom()
  }, 1250)
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
  }
}

function executeProposal(proposal: ActionProposal) {
  proposal.status = 'executed'
  success(`Acción "${proposal.action}" ejecutada sobre ${proposal.target}.`, 'Acción completada')
}

function cancelProposal(proposal: ActionProposal) {
  proposal.status = 'cancelled'
  info('Acción propuesta cancelada por el operador.')
}

onMounted(() => initTheme())
onBeforeUnmount(() => clearTimers())
</script>

<template>
  <div class="h-screen overflow-hidden flex flex-col bg-[#fafafa] dark:bg-[#09090b] text-slate-900 dark:text-slate-100">
    <!-- Top Bar (Includes Exit Template button cleanly without covering the chat Send button) -->
    <header class="shrink-0 z-30 border-b border-slate-200/80 dark:border-zinc-800/80 bg-white/90 dark:bg-[#09090b]/90 backdrop-blur-md">
      <div class="px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        <!-- Left: Agent Identity -->
        <div class="flex items-center gap-3 min-w-0">
          <IntegrityAgentIcon variant="mark" size="md" pulse />
          <div class="min-w-0">
            <div class="flex items-center gap-2">
              <h1 class="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-50 truncate">
                {{ activeConversation?.title || 'Asistente IA Integrity' }}
              </h1>
              <span class="hidden md:inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800/70">
                <span class="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                En línea
              </span>
            </div>
            <p class="text-[11px] text-slate-500 dark:text-zinc-400 truncate">
              Copiloto operativo · Markdown, JSON y logs PM2
            </p>
          </div>
        </div>

        <!-- Right: Env switcher, History, New Chat, Theme & Exit Template -->
        <div class="flex items-center gap-2 shrink-0">
          <!-- Environment quick pill -->
          <div class="hidden sm:flex items-center rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-100/80 dark:bg-zinc-900 p-0.5">
            <button
              type="button"
              class="px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors"
              :class="activeEnv === 'PROD' ? 'bg-accent text-white shadow-sm' : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'"
              @click="switchEnvironment('PROD')"
            >
              PROD
            </button>
            <button
              type="button"
              class="px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors"
              :class="activeEnv === 'QA' ? 'bg-accent text-white shadow-sm' : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'"
              @click="switchEnvironment('QA')"
            >
              QA
            </button>
          </div>

          <IntegrityButton
            variant="outline"
            size="sm"
            icon="i-heroicons-clock"
            @click="showHistory = !showHistory"
          >
            <span class="hidden md:inline">Historial ({{ conversations.length }})</span>
          </IntegrityButton>

          <IntegrityButton
            variant="outline"
            size="sm"
            icon="i-heroicons-plus"
            @click="startNewConversation"
          >
            <span class="hidden md:inline">Nueva</span>
          </IntegrityButton>

          <IntegrityButton
            variant="outline"
            size="sm"
            :icon="isDark ? 'i-heroicons-sun' : 'i-heroicons-moon'"
            :aria-label="isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
            @click="toggleTheme"
          />

          <div class="h-5 w-px bg-slate-200 dark:bg-zinc-800 mx-0.5 hidden sm:block" />

          <NuxtLink to="/templates">
            <IntegrityButton
              variant="danger"
              size="sm"
              icon="i-heroicons-arrow-left-on-rectangle"
            >
              <span class="hidden sm:inline">Salir de la plantilla</span>
              <span class="sm:hidden">Salir</span>
            </IntegrityButton>
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- Chat Workspace Body -->
    <div class="relative flex-1 min-h-0 flex overflow-hidden">
      <!-- Slide-over History Panel -->
      <Transition name="history-slide">
        <aside
          v-if="showHistory"
          class="absolute inset-y-0 left-0 z-20 w-80 max-w-[85vw] flex flex-col border-r border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#0f1014] shadow-2xl"
        >
          <div class="flex items-center justify-between px-4 py-3.5 border-b border-slate-200/80 dark:border-zinc-800">
            <div class="flex items-center gap-2">
              <Icon name="i-heroicons-chat-bubble-left-right" class="h-4 w-4 text-accent dark:text-brand-300" />
              <span class="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-200">
                Conversaciones
              </span>
            </div>
            <button
              type="button"
              class="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Cerrar historial"
              @click="showHistory = false"
            >
              <Icon name="i-heroicons-x-mark" class="h-4 w-4" />
            </button>
          </div>

          <div class="p-3 border-b border-slate-100 dark:border-zinc-800/80">
            <IntegrityButton
              block
              size="sm"
              icon="i-heroicons-plus"
              @click="startNewConversation"
            >
              Nueva conversación
            </IntegrityButton>
          </div>

          <div class="flex-1 overflow-y-auto p-2.5 space-y-1">
            <div
              v-for="session in conversations"
              :key="session.id"
              class="group flex items-center gap-2 rounded-xl px-3 py-2.5 cursor-pointer transition-colors border"
              :class="
                session.id === activeConversationId
                  ? 'bg-brand-50/90 dark:bg-brand-950/60 border-brand-200 dark:border-brand-800/80'
                  : 'border-transparent hover:bg-slate-100/80 dark:hover:bg-zinc-900'
              "
              @click="selectConversation(session.id)"
            >
              <div class="flex-1 min-w-0">
                <p
                  class="text-xs font-semibold truncate"
                  :class="session.id === activeConversationId ? 'text-accent dark:text-brand-300' : 'text-slate-800 dark:text-zinc-200'"
                >
                  {{ session.title }}
                </p>
                <p class="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5 tabular-nums">
                  {{ session.updatedAt }} · {{ session.messages.length }} msgs
                </p>
              </div>

              <button
                type="button"
                class="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-all"
                aria-label="Eliminar conversación"
                @click.stop="deleteConversation(session)"
              >
                <Icon name="i-heroicons-trash" class="h-3.5 w-3.5" />
              </button>
            </div>

            <div
              v-if="conversations.length === 0"
              class="px-4 py-10 text-center text-xs text-slate-500 dark:text-zinc-400"
            >
              No hay conversaciones guardadas.
            </div>
          </div>
        </aside>
      </Transition>

      <!-- Main Chat Column -->
      <div class="flex-1 min-w-0 flex flex-col">
        <!-- Messages Scroll Area -->
        <div
          ref="messagesContainer"
          class="flex-1 overflow-y-auto px-4 sm:px-6 py-6"
        >
          <div class="max-w-3xl mx-auto">
            <!-- Empty Welcome State -->
            <div
              v-if="activeMessages.length === 0"
              class="py-8 sm:py-14 flex flex-col items-center text-center"
            >
              <IntegrityAgentIcon variant="mark" size="xl" pulse class="mb-5" />

              <IntegrityBadge tone="brand" dot class="mb-3">
                Plantilla Chat IA · Entorno {{ activeEnv }}
              </IntegrityBadge>

              <h2 class="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                ¿En qué te puedo ayudar hoy?
              </h2>
              <p class="mt-2 max-w-lg text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">
                Interfaz estandarizada para agentes IA corporativos de Integrity. Soporta respuestas en Markdown, bloques JSON resaltados, logs PM2 con colores ANSI, guías paso a paso y confirmación de acciones.
              </p>

              <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
                <button
                  v-for="item in suggestions"
                  :key="item.title"
                  type="button"
                  class="group flex items-start gap-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 p-4 hover:border-accent dark:hover:border-brand-400 hover:shadow-subtle transition-all"
                  @click="sendMessage(item.prompt)"
                >
                  <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-950/70 text-accent dark:text-brand-300 group-hover:bg-accent group-hover:text-white transition-colors">
                    <Icon :name="item.icon" class="h-4 w-4" />
                  </span>
                  <div class="min-w-0">
                    <p class="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {{ item.title }}
                    </p>
                    <p class="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 line-clamp-2">
                      {{ item.prompt }}
                    </p>
                  </div>
                </button>
              </div>
            </div>

            <!-- Message Thread -->
            <div v-else class="space-y-6 pb-4">
              <div
                v-for="msg in activeMessages"
                :key="msg.id"
                class="flex gap-3"
                :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
              >
                <IntegrityAgentIcon
                  v-if="msg.role === 'assistant'"
                  variant="avatar"
                  size="sm"
                  class="mt-0.5"
                />

                <div
                  class="min-w-0 space-y-3"
                  :class="msg.role === 'user' ? 'max-w-[82%]' : 'flex-1 max-w-full'"
                >
                  <!-- User Bubble -->
                  <div
                    v-if="msg.role === 'user'"
                    class="rounded-2xl rounded-tr-sm bg-accent text-white px-4 py-2.5 text-sm leading-relaxed shadow-subtle"
                  >
                    <p class="whitespace-pre-wrap">{{ msg.content }}</p>
                    <p class="mt-1 text-[10px] text-white/70 text-right tabular-nums">
                      {{ msg.timestamp }}
                    </p>
                  </div>

                  <!-- Assistant Card -->
                  <div
                    v-else
                    class="space-y-3 rounded-2xl rounded-tl-sm border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 px-4 py-3.5 shadow-subtle"
                  >
                    <IntegrityMarkdown :content="msg.content" />

                    <!-- Optional PM2 Terminal Log Output -->
                    <IntegrityTerminalLog
                      v-if="msg.terminalLogs?.length"
                      :logs="msg.terminalLogs"
                      title="pm2 logs integrity-api"
                      status="online"
                      max-height="220px"
                    />

                    <!-- Optional Step-by-Step Guide Card -->
                    <div
                      v-if="msg.guide"
                      class="overflow-hidden rounded-xl border border-slate-200 dark:border-zinc-800"
                    >
                      <div class="bg-accent text-white px-4 py-3">
                        <p class="text-xs font-semibold uppercase tracking-wider text-brand-100">
                          Guía Operativa
                        </p>
                        <p class="text-sm font-semibold mt-0.5">
                          {{ msg.guide.title }}
                        </p>
                        <p class="text-xs text-white/80">
                          {{ msg.guide.subtitle }}
                        </p>
                      </div>
                      <ol class="divide-y divide-slate-100 dark:divide-zinc-800 bg-slate-50/70 dark:bg-zinc-950/60">
                        <li
                          v-for="(step, idx) in msg.guide.steps"
                          :key="step.title"
                          class="flex items-start gap-3 p-3.5"
                        >
                          <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-950 text-accent dark:text-brand-300 text-xs font-semibold tabular-nums">
                            {{ idx + 1 }}
                          </span>
                          <div class="min-w-0 text-xs space-y-1">
                            <p class="font-semibold text-slate-900 dark:text-slate-100">
                              {{ step.title }}
                            </p>
                            <p class="text-slate-600 dark:text-zinc-400 leading-relaxed">
                              {{ step.detail }}
                            </p>
                            <p
                              v-if="step.note"
                              class="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 dark:text-amber-300"
                            >
                              <Icon name="i-heroicons-exclamation-triangle" class="h-3.5 w-3.5 shrink-0" />
                              {{ step.note }}
                            </p>
                          </div>
                        </li>
                      </ol>
                    </div>

                    <!-- Optional Human-in-the-loop Action Proposal -->
                    <div
                      v-if="msg.proposal"
                      class="rounded-xl border border-brand-200/80 dark:border-brand-800/80 bg-brand-50/50 dark:bg-brand-950/30 p-3.5 space-y-2.5"
                    >
                      <div class="flex items-center justify-between gap-2">
                        <div class="flex items-center gap-2 min-w-0">
                          <Icon name="i-heroicons-shield-check" class="h-4 w-4 text-accent dark:text-brand-300 shrink-0" />
                          <span class="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                            Acción propuesta · <code class="font-mono">{{ msg.proposal.action }}</code>
                          </span>
                        </div>
                        <IntegrityBadge
                          :tone="msg.proposal.status === 'executed' ? 'operational' : msg.proposal.status === 'cancelled' ? 'neutral' : 'degraded'"
                          size="sm"
                        >
                          {{
                            msg.proposal.status === 'executed'
                              ? 'Ejecutada'
                              : msg.proposal.status === 'cancelled'
                                ? 'Cancelada'
                                : 'Pendiente'
                          }}
                        </IntegrityBadge>
                      </div>

                      <p class="text-xs text-slate-600 dark:text-zinc-300">
                        {{ msg.proposal.summary }}
                      </p>

                      <div
                        v-if="msg.proposal.status === 'pending'"
                        class="flex flex-wrap items-center gap-2 pt-1"
                      >
                        <IntegrityButton
                          size="sm"
                          icon="i-heroicons-check"
                          @click="executeProposal(msg.proposal)"
                        >
                          Confirmar y ejecutar
                        </IntegrityButton>
                        <IntegrityButton
                          variant="outline"
                          size="sm"
                          icon="i-heroicons-x-mark"
                          @click="cancelProposal(msg.proposal)"
                        >
                          Cancelar
                        </IntegrityButton>
                      </div>
                    </div>

                    <div class="flex items-center justify-between pt-1 text-[10px] text-slate-400 dark:text-zinc-500">
                      <span>Asistente IA Integrity · {{ activeEnv }}</span>
                      <span class="tabular-nums">{{ msg.timestamp }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Thinking Indicator -->
              <div v-if="isThinking" class="flex items-start gap-3">
                <IntegrityAgentIcon variant="avatar" size="sm" pulse class="mt-0.5" />
                <div class="flex-1 max-w-md rounded-2xl rounded-tl-sm border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 px-4 py-3 space-y-2.5 shadow-subtle">
                  <div class="flex items-center gap-2">
                    <span class="h-2 w-2 rounded-full bg-accent animate-pulse" />
                    <span class="text-xs font-medium text-slate-700 dark:text-zinc-200">
                      {{ thinkingLabel }}
                    </span>
                  </div>
                  <div class="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-zinc-800">
                    <div class="integrity-thinking-bar h-full w-1/2 rounded-full bg-accent" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Composer Footer -->
        <footer class="shrink-0 border-t border-slate-200/80 dark:border-zinc-800/80 bg-white/95 dark:bg-[#09090b]/95 px-4 sm:px-6 py-3.5">
          <div class="max-w-3xl mx-auto space-y-2">
            <div class="flex items-end gap-2.5 rounded-2xl border border-slate-300/90 dark:border-zinc-700/90 bg-white dark:bg-zinc-900 px-3.5 py-2.5 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20 transition-all shadow-subtle">
              <textarea
                ref="textareaRef"
                v-model="inputText"
                rows="1"
                placeholder="Escribe tu consulta para el asistente IA (ej. ver logs PM2, estado de servicios)…"
                class="flex-1 resize-none bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none max-h-[140px] py-1"
                :disabled="isThinking"
                @input="autoResize"
                @keydown="handleKeydown"
              />

              <IntegrityButton
                size="sm"
                icon="i-heroicons-paper-airplane"
                :disabled="!inputText.trim() || isThinking"
                :loading="isThinking"
                aria-label="Enviar mensaje"
                @click="sendMessage()"
              >
                <span class="hidden sm:inline">Enviar</span>
              </IntegrityButton>
            </div>

            <div class="flex items-center justify-between text-[11px] text-slate-400 dark:text-zinc-500 px-1">
              <span>
                <kbd class="font-mono">Enter</kbd> para enviar · <kbd class="font-mono">Shift + Enter</kbd> nueva línea
              </span>
              <span class="hidden sm:inline">
                Plantilla Chat IA · Integrity UI/UX
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>

    <!-- Live Environment Switch Overlay -->
    <IntegrityEnvironmentOverlay
      :show="switchingEnv"
      :environment="pendingEnv === 'PROD' ? 'Producción (PROD)' : 'Calidad (QA)'"
      :label="`Sincronizando herramientas del agente en ${pendingEnv}…`"
    />
  </div>
</template>

<style scoped>
.history-slide-enter-active,
.history-slide-leave-active {
  transition: transform 0.22s ease, opacity 0.22s ease;
}

.history-slide-enter-from,
.history-slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.integrity-thinking-bar {
  animation: integrity-agent-progress 1.3s ease-in-out infinite;
}

@keyframes integrity-agent-progress {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(220%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .integrity-thinking-bar {
    animation: none;
    width: 100%;
  }
}
</style>
