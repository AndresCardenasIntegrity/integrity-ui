<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from 'vue'

const open = defineModel<boolean>('open', { default: false })

const props = withDefaults(defineProps<{
  title?: string
  subtitle?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  closeOnBackdrop?: boolean
}>(), {
  title: undefined,
  subtitle: undefined,
  size: 'md',
  closeOnBackdrop: true,
})

const emit = defineEmits<{
  close: []
}>()

const sizeClass = computed(() => {
  const map = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  } as const
  return map[props.size]
})

function closeModal() {
  open.value = false
  emit('close')
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && open.value) {
    closeModal()
  }
}

watch(open, (isOpen) => {
  if (!import.meta.client) return
  if (isOpen) {
    window.addEventListener('keydown', onKeydown)
  } else {
    window.removeEventListener('keydown', onKeydown)
  }
}, { immediate: true })

onBeforeUnmount(() => {
  if (import.meta.client) {
    window.removeEventListener('keydown', onKeydown)
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="integrity-modal">
      <div
        v-if="open"
        role="dialog"
        aria-modal="true"
        class="fixed inset-0 z-[10000] flex items-center justify-center p-4"
        @click.self="closeOnBackdrop && closeModal()"
      >
        <div class="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px]" aria-hidden="true" />

        <div
          :class="[
            'integrity-modal-panel relative w-full rounded-xl border border-slate-200 dark:border-slate-800',
            'bg-white dark:bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]',
            sizeClass,
          ]"
        >
          <header
            v-if="title || subtitle || $slots.header"
            class="flex items-start justify-between gap-4 px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0"
          >
            <div class="min-w-0">
              <slot name="header">
                <h3 v-if="title" class="text-base font-semibold text-slate-900 dark:text-slate-50">
                  {{ title }}
                </h3>
                <p v-if="subtitle" class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {{ subtitle }}
                </p>
              </slot>
            </div>
            <button
              type="button"
              aria-label="Cerrar diálogo"
              class="rounded-lg p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
              @click="closeModal"
            >
              <Icon name="i-heroicons-x-mark" class="h-5 w-5" />
            </button>
          </header>

          <div class="px-6 py-5 overflow-y-auto scrollbar-thin flex-1">
            <slot />
          </div>

          <footer
            v-if="$slots.footer"
            class="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 shrink-0"
          >
            <slot name="footer" :close="closeModal" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.integrity-modal-enter-active,
.integrity-modal-leave-active {
  transition: opacity 0.2s ease;
}

.integrity-modal-enter-active .integrity-modal-panel,
.integrity-modal-leave-active .integrity-modal-panel {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.integrity-modal-enter-from,
.integrity-modal-leave-to {
  opacity: 0;
}

.integrity-modal-enter-from .integrity-modal-panel {
  transform: scale(0.96) translateY(-10px);
}

.integrity-modal-leave-to .integrity-modal-panel {
  transform: scale(0.96) translateY(10px);
}
</style>
