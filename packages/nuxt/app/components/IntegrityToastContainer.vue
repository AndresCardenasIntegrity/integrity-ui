<script setup lang="ts">
import type { IntegrityToastType } from '../types/ui'

const { toasts, dismiss } = useIntegrityToast()

const typeConfig: Record<IntegrityToastType, { wrap: string; icon: string }> = {
  success: {
    wrap: 'bg-emerald-50/95 dark:bg-emerald-950/95 text-emerald-900 dark:text-emerald-100 border-emerald-200 dark:border-emerald-800',
    icon: 'i-heroicons-check-circle',
  },
  error: {
    wrap: 'bg-red-50/95 dark:bg-red-950/95 text-red-900 dark:text-red-100 border-red-200 dark:border-red-800',
    icon: 'i-heroicons-x-circle',
  },
  warning: {
    wrap: 'bg-amber-50/95 dark:bg-amber-950/95 text-amber-900 dark:text-amber-100 border-amber-200 dark:border-amber-800',
    icon: 'i-heroicons-exclamation-triangle',
  },
  info: {
    wrap: 'bg-brand-50/95 dark:bg-brand-950/95 text-brand-900 dark:text-brand-100 border-brand-200 dark:border-brand-800',
    icon: 'i-heroicons-information-circle',
  },
}
</script>

<template>
  <Teleport to="body">
    <TransitionGroup
      name="integrity-toast"
      tag="div"
      aria-live="polite"
      class="fixed top-4 right-4 z-[9999] flex flex-col gap-2.5 pointer-events-none max-w-[calc(100vw-2rem)]"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="[
          'pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-sm',
          'min-w-[280px] sm:min-w-[320px] max-w-md',
          typeConfig[toast.type].wrap,
        ]"
      >
        <Icon :name="typeConfig[toast.type].icon" class="h-5 w-5 shrink-0 mt-0.5" />
        <div class="min-w-0 flex-1">
          <p v-if="toast.title" class="text-sm font-semibold leading-snug mb-0.5">
            {{ toast.title }}
          </p>
          <p class="text-sm leading-snug" :class="toast.title ? 'opacity-90' : ''">
            {{ toast.message }}
          </p>
        </div>
        <button
          type="button"
          aria-label="Cerrar notificación"
          class="shrink-0 rounded-md p-0.5 opacity-60 hover:opacity-100 transition-opacity"
          @click="dismiss(toast.id)"
        >
          <Icon name="i-heroicons-x-mark" class="h-4 w-4" />
        </button>
      </div>
    </TransitionGroup>
  </Teleport>
</template>

<style scoped>
.integrity-toast-enter-active,
.integrity-toast-leave-active {
  transition: all 0.25s ease;
}

.integrity-toast-enter-from {
  opacity: 0;
  transform: translateX(48px);
}

.integrity-toast-leave-to {
  opacity: 0;
  transform: translateX(48px) scale(0.96);
}

.integrity-toast-move {
  transition: transform 0.25s ease;
}
</style>
