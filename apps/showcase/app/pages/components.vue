<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import type {
  IntegrityMultiSelectOption,
  IntegritySelectOption,
  IntegrityTabItem,
} from '@andrescardenasintegrity/integrity-ui-nuxt/app/types/ui'

const { success, error, warning, info } = useIntegrityToast()
const { confirm } = useIntegrityConfirm()

const modalOpen = shallowRef(false)
const drawerOpen = shallowRef(false)
const drawerSide = shallowRef<'right' | 'left'>('right')
const sampleName = shallowRef('Portal Operativo')
const sampleEmail = shallowRef('')
const sampleEnv = shallowRef('qa')
const activeTab = shallowRef('general')
const activePillTab = shallowRef('all')
const selectedMembers = ref<string[]>(['andres.cardenas', 'sofia.ramirez'])
const notificationEmails = ref<string[]>([
  'operaciones@integrity-la.com',
  'soporte@integrity-la.com',
])

const envOptions: IntegritySelectOption[] = [
  { label: 'Desarrollo (DEV)', value: 'dev' },
  { label: 'Calidad (QA)', value: 'qa' },
  { label: 'Producción (PROD)', value: 'prod' },
]

const tabItems: IntegrityTabItem[] = [
  { value: 'general', label: 'General', icon: 'i-heroicons-cog-6-tooth' },
  { value: 'members', label: 'Responsables', icon: 'i-heroicons-users', badge: 4 },
  { value: 'audit', label: 'Auditoría', icon: 'i-heroicons-clock', badge: 12 },
  { value: 'disabled', label: 'Archivado', disabled: true },
]

const pillTabItems: IntegrityTabItem[] = [
  { value: 'all', label: 'Todos', badge: 24 },
  { value: 'active', label: 'Activos', badge: 18 },
  { value: 'pending', label: 'Pendientes', badge: 6 },
]

const memberOptions: IntegrityMultiSelectOption[] = [
  { value: 'andres.cardenas', label: 'Andrés Cárdenas', description: 'andres.cardenas@integrity-la.com', meta: 'LEAD' },
  { value: 'sofia.ramirez', label: 'Sofía Ramírez', description: 'sofia.ramirez@integrity-la.com', meta: 'OPS' },
  { value: 'carlos.mendoza', label: 'Carlos Mendoza', description: 'carlos.mendoza@integrity-la.com', meta: 'DEV' },
  { value: 'laura.torres', label: 'Laura Torres', description: 'laura.torres@integrity-la.com', meta: 'QA' },
  { value: 'diego.vargas', label: 'Diego Vargas', description: 'diego.vargas@integrity-la.com', meta: 'SEC', disabled: true },
]

async function triggerStandardConfirm() {
  const accepted = await confirm({
    type: 'info',
    title: 'Aplicar configuración',
    message: 'Se actualizarán las preferencias del módulo para el equipo.',
    confirmText: 'Aplicar',
  })
  if (accepted) success('Configuración aplicada correctamente.')
}

async function triggerDangerConfirm() {
  const accepted = await confirm({
    type: 'danger',
    title: 'Eliminar registro crítico',
    message: 'Esta acción eliminará el lote seleccionado y no se puede deshacer.',
    dangerNote: 'Protección activa: espera el contador antes de confirmar.',
    confirmDelaySeconds: 3,
    confirmText: 'Sí, eliminar',
  })
  if (accepted) error('Registro eliminado (demo).', 'Acción confirmada')
}

const buttonCode = `<IntegrityButton variant="primary" icon="i-heroicons-plus">Nuevo registro</IntegrityButton>
<IntegrityButton variant="secondary">Secundario</IntegrityButton>
<IntegrityButton variant="outline">Outline</IntegrityButton>
<IntegrityButton variant="ghost">Ghost</IntegrityButton>
<IntegrityButton variant="danger" icon="i-heroicons-trash">Eliminar</IntegrityButton>
<IntegrityButton loading>Guardando…</IntegrityButton>`

const badgeCode = `<IntegrityBadge tone="brand" dot>Integrity</IntegrityBadge>
<IntegrityBadge tone="operational" dot>Operacional</IntegrityBadge>
<IntegrityBadge tone="degraded" dot>Degradado</IntegrityBadge>
<IntegrityBadge tone="down" dot>Caído</IntegrityBadge>
<IntegrityBadge tone="maintenance" dot>Mantenimiento</IntegrityBadge>`

const formCode = `<div class="form-grid-2">
  <IntegrityInput v-model="name" label="Nombre del proyecto" icon="i-heroicons-folder" required />
  <IntegritySelect v-model="env" label="Entorno" :options="envOptions" />
</div>`

const dialogCode = `const { confirm } = useIntegrityConfirm()

const ok = await confirm({
  type: 'danger',
  title: 'Eliminar registro crítico',
  message: 'Esta acción no se puede deshacer.',
  dangerNote: 'Protección activa: espera el contador antes de confirmar.',
  confirmDelaySeconds: 3,
})`

const advancedInputsCode = `<div class="form-grid-2">
  <IntegrityMultiSelect
    v-model="selectedMembers"
    label="Responsables asignados"
    :options="memberOptions"
    :max-selections="4"
  />
  <IntegrityEmailListInput
    v-model="notificationEmails"
    label="Correos de notificación"
    hint="Pega varios correos separados por ; o coma."
  />
</div>`

const tabsCode = `<IntegrityTabs v-model="activeTab" :items="tabItems">
  <template #panel-general>Contenido de la pestaña General</template>
</IntegrityTabs>`
</script>

<template>
  <div class="space-y-10">
    <IntegrityPageHeader
      eyebrow="@andrescardenasintegrity/integrity-ui-nuxt"
      title="Componentes Base"
      subtitle="Primitivos interactivos con soporte nativo Light/Dark, foco accesible y contratos TypeScript."
    />

    <ShowcaseSection
      title="IntegrityButton"
      description="Cinco variantes oficiales, tres tamaños, estado de carga e iconos Heroicons."
      :code="buttonCode"
    >
      <div class="flex flex-wrap items-center gap-3">
        <IntegrityButton variant="primary" icon="i-heroicons-plus">Primario</IntegrityButton>
        <IntegrityButton variant="secondary">Secundario</IntegrityButton>
        <IntegrityButton variant="outline">Outline</IntegrityButton>
        <IntegrityButton variant="ghost">Ghost</IntegrityButton>
        <IntegrityButton variant="danger" icon="i-heroicons-trash">Eliminar</IntegrityButton>
        <IntegrityButton loading>Guardando…</IntegrityButton>
      </div>
      <div class="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <IntegrityButton size="sm">Pequeño (sm)</IntegrityButton>
        <IntegrityButton size="md">Estándar (md)</IntegrityButton>
        <IntegrityButton size="lg">Grande (lg)</IntegrityButton>
      </div>
    </ShowcaseSection>

    <ShowcaseSection
      title="IntegrityBadge"
      description="Etiquetas compactas con punto opcional para estatus, categorías y entornos."
      :code="badgeCode"
    >
      <div class="flex flex-wrap items-center gap-2.5">
        <IntegrityBadge tone="brand" dot>Integrity</IntegrityBadge>
        <IntegrityBadge tone="operational" dot>Operacional</IntegrityBadge>
        <IntegrityBadge tone="degraded" dot>Degradado</IntegrityBadge>
        <IntegrityBadge tone="down" dot>Caído</IntegrityBadge>
        <IntegrityBadge tone="maintenance" dot>Mantenimiento</IntegrityBadge>
        <IntegrityBadge tone="info" dot>Informativo</IntegrityBadge>
        <IntegrityBadge tone="neutral">Neutral</IntegrityBadge>
      </div>
    </ShowcaseSection>

    <ShowcaseSection
      title="IntegrityAlert"
      description="Mensajes contextuales en línea con cierre opcional."
    >
      <div class="space-y-3">
        <IntegrityAlert tone="info" title="Información del sistema">
          Todos los proyectos nuevos heredan automáticamente la tipografía Inter y la paleta Integrity.
        </IntegrityAlert>
        <IntegrityAlert tone="success" title="Sincronización completa" dismissible>
          Los cambios se aplicaron correctamente en los servicios monitoreados.
        </IntegrityAlert>
        <IntegrityAlert tone="warning" title="Latencia elevada">
          El servicio de reportes presenta tiempos de respuesta por encima del umbral.
        </IntegrityAlert>
        <IntegrityAlert tone="danger" title="Error de conexión">
          No fue posible validar el token contra el servidor remoto.
        </IntegrityAlert>
      </div>
    </ShowcaseSection>

    <ShowcaseSection
      title="IntegrityInput & IntegritySelect"
      description="Controles de formulario con etiquetas accesibles, hints y validación."
      :code="formCode"
    >
      <div class="form-grid-2">
        <IntegrityInput
          v-model="sampleName"
          label="Nombre del proyecto"
          icon="i-heroicons-folder"
          hint="Se mostrará en el encabezado de la barra lateral."
          required
        />
        <IntegritySelect
          v-model="sampleEnv"
          label="Entorno objetivo"
          :options="envOptions"
          hint="Selecciona el ambiente de despliegue."
        />
        <IntegrityInput
          v-model="sampleEmail"
          type="email"
          label="Correo de notificaciones"
          placeholder="equipo@integrity.com"
          icon="i-heroicons-envelope"
          :error="sampleEmail && !sampleEmail.includes('@') ? 'Ingresa un correo electrónico válido.' : ''"
        />
        <IntegrityInput
          model-value="INT-READONLY-001"
          label="Código de cliente (deshabilitado)"
          disabled
        />
      </div>
    </ShowcaseSection>

    <ShowcaseSection
      title="IntegrityMultiSelect & IntegrityEmailListInput"
      description="Selector múltiple buscable con chips y editor de listas de correos con validación y soporte para pegado con punto y coma (;)."
      :code="advancedInputsCode"
    >
      <div class="form-grid-2">
        <IntegrityMultiSelect
          v-model="selectedMembers"
          label="Responsables del proyecto"
          :options="memberOptions"
          :max-selections="4"
          hint="Filtra por nombre, correo o rol."
        />
        <IntegrityEmailListInput
          v-model="notificationEmails"
          label="Destinatarios de alertas"
          hint="Escribe o pega correos separados por ; , coma o Enter."
        />
      </div>
    </ShowcaseSection>

    <ShowcaseSection
      title="IntegrityTabs"
      description="Pestañas accesibles con navegación por teclado (flechas, Inicio/Fin), iconos y contadores en variantes underline y pills."
      :code="tabsCode"
    >
      <div class="space-y-6">
        <IntegrityTabs v-model="activeTab" :items="tabItems">
          <template #panel-general>
            <p class="text-sm text-slate-600 dark:text-slate-400">
              Configuración general del espacio de trabajo y parámetros base del módulo.
            </p>
          </template>
          <template #panel-members>
            <p class="text-sm text-slate-600 dark:text-slate-400">
              Hay <span class="font-semibold text-slate-900 dark:text-slate-100">{{ selectedMembers.length }}</span> responsables seleccionados actualmente.
            </p>
          </template>
          <template #panel-audit>
            <p class="text-sm text-slate-600 dark:text-slate-400">
              Últimos 12 eventos de auditoría sincronizados con trazabilidad completa.
            </p>
          </template>
        </IntegrityTabs>

        <div class="pt-4 border-t border-slate-100 dark:border-slate-800">
          <IntegrityTabs v-model="activePillTab" :items="pillTabItems" variant="pills" size="sm" />
        </div>
      </div>
    </ShowcaseSection>

    <ShowcaseSection
      title="Modales, Drawers, Confirmaciones y Toasts"
      description="Overlays globales montados una sola vez en app.vue y paneles laterales para edición o inspección rápida."
      :code="dialogCode"
    >
      <div class="flex flex-wrap items-center gap-3">
        <IntegrityButton icon="i-heroicons-window" @click="modalOpen = true">
          Abrir Modal
        </IntegrityButton>
        <IntegrityButton
          variant="secondary"
          icon="i-heroicons-bars-3-bottom-right"
          @click="drawerSide = 'right'; drawerOpen = true"
        >
          Drawer derecho
        </IntegrityButton>
        <IntegrityButton
          variant="outline"
          icon="i-heroicons-bars-3-bottom-left"
          @click="drawerSide = 'left'; drawerOpen = true"
        >
          Drawer izquierdo
        </IntegrityButton>
        <IntegrityButton variant="outline" @click="triggerStandardConfirm">
          Confirmación estándar
        </IntegrityButton>
        <IntegrityButton variant="danger" @click="triggerDangerConfirm">
          Confirmación crítica (3s)
        </IntegrityButton>
      </div>

      <div class="flex flex-wrap items-center gap-2.5 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <span class="text-xs font-medium text-slate-500 dark:text-slate-400 mr-1">Disparar Toast:</span>
        <IntegrityButton size="sm" variant="secondary" @click="success('Operación guardada sin errores.', 'Éxito')">
          Success
        </IntegrityButton>
        <IntegrityButton size="sm" variant="secondary" @click="info('Hay una actualización disponible.', 'Info')">
          Info
        </IntegrityButton>
        <IntegrityButton size="sm" variant="secondary" @click="warning('Revisa los campos pendientes.', 'Aviso')">
          Warning
        </IntegrityButton>
        <IntegrityButton size="sm" variant="secondary" @click="error('No se pudo conectar al endpoint.', 'Error')">
          Error
        </IntegrityButton>
      </div>
    </ShowcaseSection>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <IntegrityCard title="IntegrityEmptyState" padding="none">
        <IntegrityEmptyState
          title="No se encontraron resultados"
          description="Prueba ajustando los filtros o crea un nuevo registro para comenzar."
        >
          <template #actions>
            <IntegrityButton size="sm" icon="i-heroicons-plus" @click="info('Acción de estado vacío disparada.')">
              Crear registro
            </IntegrityButton>
          </template>
        </IntegrityEmptyState>
      </IntegrityCard>

      <IntegrityCard title="IntegrityLogoLoader">
        <div class="flex items-center justify-around py-6">
          <IntegrityLogoLoader size="sm" label="Cargando…" />
          <IntegrityLogoLoader size="md" label="Sincronizando…" />
        </div>
      </IntegrityCard>
    </div>

    <ShowcaseSection
      title="IntegritySkeleton"
      description="Placeholders de carga accesibles para texto, tarjetas y tablas completas."
    >
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <IntegritySkeleton variant="text" :lines="3" />
          <IntegritySkeleton variant="card" />
        </div>
        <IntegritySkeleton variant="table" :rows="3" />
      </div>
    </ShowcaseSection>

    <IntegrityDrawer
      v-model:open="drawerOpen"
      :side="drawerSide"
      title="Detalle de configuración"
      subtitle="Panel deslizable lateral para formularios o inspección sin perder el contexto."
    >
      <div class="space-y-4">
        <IntegrityInput v-model="sampleName" label="Nombre del servicio" />
        <IntegritySelect v-model="sampleEnv" label="Entorno" :options="envOptions" />
        <IntegrityEmailListInput
          v-model="notificationEmails"
          label="Notificaciones"
        />
      </div>
      <template #footer="{ close }">
        <IntegrityButton variant="ghost" @click="close">Cancelar</IntegrityButton>
        <IntegrityButton @click="close(); success('Panel guardado correctamente.')">
          Aplicar
        </IntegrityButton>
      </template>
    </IntegrityDrawer>

    <IntegrityModal
      v-model:open="modalOpen"
      title="Ejemplo de IntegrityModal"
      subtitle="Cierra con Escape, clic fuera o el botón inferior."
    >
      <div class="space-y-4">
        <p class="text-sm text-slate-600 dark:text-slate-400">
          Los modales mantienen padding consistente, encabezado claro, cuerpo con scroll propio y pie de acciones alineado a la derecha.
        </p>
        <IntegrityInput v-model="sampleName" label="Título de ejemplo" />
      </div>
      <template #footer="{ close }">
        <IntegrityButton variant="ghost" @click="close">Cancelar</IntegrityButton>
        <IntegrityButton @click="close(); success('Cambios guardados desde el modal.')">
          Guardar cambios
        </IntegrityButton>
      </template>
    </IntegrityModal>
  </div>
</template>
