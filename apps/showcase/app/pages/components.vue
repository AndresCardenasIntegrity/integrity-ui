<script setup lang="ts">
import { shallowRef } from 'vue'
import type { IntegritySelectOption } from '@andrescardenasintegrity/integrity-ui-nuxt/app/types/ui'

const { success, error, warning, info } = useIntegrityToast()
const { confirm } = useIntegrityConfirm()

const modalOpen = shallowRef(false)
const sampleName = shallowRef('Portal Operativo')
const sampleEmail = shallowRef('')
const sampleEnv = shallowRef('qa')

const envOptions: IntegritySelectOption[] = [
  { label: 'Desarrollo (DEV)', value: 'dev' },
  { label: 'Calidad (QA)', value: 'qa' },
  { label: 'Producción (PROD)', value: 'prod' },
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
</script>

<template>
  <div class="space-y-6">
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
      title="Modales, Confirmaciones y Toasts"
      description="Overlays globales montados una sola vez en app.vue y disparados por composables."
      :code="dialogCode"
    >
      <div class="flex flex-wrap items-center gap-3">
        <IntegrityButton icon="i-heroicons-window" @click="modalOpen = true">
          Abrir Modal
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
