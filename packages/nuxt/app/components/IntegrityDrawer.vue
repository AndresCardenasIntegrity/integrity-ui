<script setup lang="ts">
import { computed, onBeforeUnmount, useId, watch } from 'vue'

const open = defineModel<boolean>('open', { default: false })

const props = withDefaults(defineProps<{
  title?: string
  subtitle?: string
  side?: 'right' | 'left'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  closeOnBackdrop?: boolean
}>(), {
  title: undefined,
  subtitle: undefined,
  side: 'right',
  size: 'md',
  closeOnBackdrop: true,
})

const emit = defineEmits<{
  close: []
}>()

const titleId = useId()

const widthClass = computed(() => {
  const map = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-xl',
    xl: 'max-w-2xl',
  } as const
  return map[props.size]
})

function closeDrawer() {
  open.value = false
  emit('close')
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && open.value) {
    closeDrawer()
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
    <Transition :name="side === 'left' ? 'integrity-drawer-left' : 'integrity-drawer-right'">
      <div
        v-if="open"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="title ? titleId : undefined"
        :class="[
          'fixed inset-0 z-[10000] flex',
          side === 'left' ? 'justify-start' : 'justify-end',
        ]"
        @click.self="closeOnBackdrop && closeDrawer()"
      >
        <div
          class="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px]"
          aria-hidden="true"
          @click="closeOnBackdrop && closeDrawer()"
        />

        <aside
          :class="[
            'integrity-drawer-panel relative z-10 flex h-full w-full flex-col bg-white dark:bg-slate-900 shadow-2xl',
            side === 'left'
              ? 'border-r border-slate-200 dark:border-slate-800'
              : 'border-l border-slate-200 dark:border-slate-800',
            widthClass,
          ]"
        >
          <header
            v-if="title || subtitle || $slots.header"
            class="flex items-start justify-between gap-4 px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0"
          >
            <div class="min-w-0">
              <slot name="header">
                <h3 v-if="title" :id="titleId" class="text-base font-semibold text-slate-900 dark:text-slate-50">
                  {{ title }}
                </h3>
                <p v-if="subtitle" class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {{ subtitle }}
                </p>
              </slot>
            </div>
            <button
              type="button"
              aria-label="Cerrar panel"
              class="rounded-lg p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
              @click="closeDrawer"
            >
              <Icon name="i-heroicons-x-mark" class="h-5 w-5" />
            </button>
          </header>

          <div class="flex-1 overflow-y-auto scrollbar-thin px-6 py-5">
            <slot />
          </div>

          <footer
            v-if="$slots.footer"
            class="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 shrink-0"
          >
            <slot name="footer" :close="closeDrawer" />
          </footer>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.integrity-drawer-right-enter-active,
.integrity-drawer-right-leave-active,
.integrity-drawer-left-enter-active,
.integrity-drawer-left-leave-active {
  transition: opacity 0.22s ease;
}

.integrity-drawer-right-enter-active .integrity-drawer-panel,
.integrity-drawer-right-leave-active .integrity-drawer-panel,
.integrity-drawer-left-enter-active .integrity-drawer-panel,
.integrity-drawer-left-leave-active .integrity-drawer-panel {
  transition: transform 0.24s cubic-bezier(0.22, 1, 0.36, 1);
}

.integrity-drawer-right-enter-from,
.integrity-drawer-right-leave-to,
.integrity-drawer-left-enter-from,
.integrity-drawer-left-leave-to {
  opacity: 0;
}

.integrity-drawer-right-enter-from .integrity-drawer-panel,
.integrity-drawer-right-leave-to .integrity-drawer-panel {
  transform: translateX(100%);
}

.integrity-drawer-left-enter-from .integrity-drawer-panel,
.integrity-drawer-left-leave-to .integrity-drawer-panel {
  transform: translateX(-100%);
}
</style>
