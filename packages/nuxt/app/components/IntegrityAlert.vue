<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import type { IntegrityAlertTone } from '../types/ui'

const props = withDefaults(defineProps<{
  tone?: IntegrityAlertTone
  title?: string
  dismissible?: boolean
}>(), {
  tone: 'info',
  title: undefined,
  dismissible: false,
})

const emit = defineEmits<{
  dismiss: []
}>()

const dismissed = shallowRef(false)

const styleMap: Record<IntegrityAlertTone, { wrap: string; icon: string; name: string }> = {
  info: {
    wrap: 'bg-brand-50/70 border-brand-200 text-brand-900 dark:bg-brand-950/50 dark:border-brand-800/80 dark:text-brand-100',
    icon: 'text-brand-600 dark:text-brand-300',
    name: 'i-heroicons-information-circle',
  },
  success: {
    wrap: 'bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/50 dark:border-emerald-800/80 dark:text-emerald-100',
    icon: 'text-emerald-600 dark:text-emerald-400',
    name: 'i-heroicons-check-circle',
  },
  warning: {
    wrap: 'bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/50 dark:border-amber-800/80 dark:text-amber-100',
    icon: 'text-amber-600 dark:text-amber-400',
    name: 'i-heroicons-exclamation-triangle',
  },
  danger: {
    wrap: 'bg-red-50 border-red-200 text-red-900 dark:bg-red-950/50 dark:border-red-800/80 dark:text-red-100',
    icon: 'text-red-600 dark:text-red-400',
    name: 'i-heroicons-x-circle',
  },
}

const current = computed(() => styleMap[props.tone])

function onDismiss() {
  dismissed.value = true
  emit('dismiss')
}
</script>

<template>
  <div
    v-if="!dismissed"
    role="alert"
    :class="['flex items-start gap-3 rounded-xl border px-4 py-3 text-sm', current.wrap]"
  >
    <Icon :name="current.name" class="h-5 w-5 shrink-0 mt-0.5" :class="current.icon" />
    <div class="min-w-0 flex-1">
      <p v-if="title" class="font-semibold mb-0.5">{{ title }}</p>
      <div class="text-sm opacity-90">
        <slot />
      </div>
    </div>
    <button
      v-if="dismissible"
      type="button"
      aria-label="Cerrar alerta"
      class="shrink-0 rounded-lg p-1 opacity-60 hover:opacity-100 transition-opacity"
      @click="onDismiss"
    >
      <Icon name="i-heroicons-x-mark" class="h-4 w-4" />
    </button>
  </div>
</template>
