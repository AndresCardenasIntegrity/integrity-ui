<script setup lang="ts">
import { computed, onBeforeUnmount, shallowRef, watch } from 'vue'
import type { IntegrityConfirmType } from '../types/ui'

const { state, handleConfirm, handleCancel } = useIntegrityConfirm()

const secondsLeft = shallowRef(0)
let timer: ReturnType<typeof setInterval> | null = null

const confirmLocked = computed(() => secondsLeft.value > 0)

const typeStyles: Record<IntegrityConfirmType, { bg: string; icon: string; iconName: string; btn: string }> = {
  info: {
    bg: 'bg-brand-50 dark:bg-brand-950/70',
    icon: 'text-brand-600 dark:text-brand-300',
    iconName: 'i-heroicons-question-mark-circle',
    btn: 'bg-accent hover:bg-accent-hover text-white',
  },
  warning: {
    bg: 'bg-amber-100 dark:bg-amber-950/70',
    icon: 'text-amber-600 dark:text-amber-400',
    iconName: 'i-heroicons-exclamation-triangle',
    btn: 'bg-amber-600 hover:bg-amber-700 text-white',
  },
  danger: {
    bg: 'bg-red-100 dark:bg-red-950/70',
    icon: 'text-red-600 dark:text-red-400',
    iconName: 'i-heroicons-exclamation-triangle',
    btn: 'bg-red-600 hover:bg-red-700 text-white',
  },
}

const currentStyle = computed(() => typeStyles[state.value.type])

function clearTimer() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

watch(
  () => [state.value.isOpen, state.value.confirmDelaySeconds] as const,
  ([isOpen, delaySeconds]) => {
    clearTimer()
    const delay = isOpen ? Math.max(0, Number(delaySeconds) || 0) : 0
    secondsLeft.value = delay
    if (!import.meta.client || delay <= 0) return

    timer = setInterval(() => {
      if (secondsLeft.value <= 1) {
        secondsLeft.value = 0
        clearTimer()
        return
      }
      secondsLeft.value -= 1
    }, 1000)
  },
  { immediate: true },
)

onBeforeUnmount(() => clearTimer())

function onAccept() {
  if (confirmLocked.value) return
  handleConfirm()
}
</script>

<template>
  <Teleport to="body">
    <Transition name="integrity-confirm">
      <div
        v-if="state.isOpen"
        role="alertdialog"
        aria-modal="true"
        class="fixed inset-0 z-[11000] flex items-center justify-center p-4"
        @click.self="handleCancel"
      >
        <div class="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px]" aria-hidden="true" />

        <div
          class="integrity-confirm-panel relative w-full max-w-md rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl"
        >
          <div class="flex items-start gap-4 p-6 pb-4">
            <div
              class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
              :class="currentStyle.bg"
            >
              <Icon :name="currentStyle.iconName" class="h-6 w-6" :class="currentStyle.icon" />
            </div>

            <div class="min-w-0 flex-1">
              <h3 class="text-base font-semibold text-slate-900 dark:text-slate-50 mb-1.5">
                {{ state.title }}
              </h3>
              <p class="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                {{ state.message }}
              </p>
            </div>
          </div>

          <div
            v-if="state.dangerNote"
            class="mx-6 mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-800 dark:border-red-900 dark:bg-red-950/60 dark:text-red-200"
          >
            {{ state.dangerNote }}
          </div>

          <div class="flex items-center gap-3 px-6 pb-6 pt-2">
            <button
              type="button"
              class="flex-1 rounded-lg bg-slate-100 dark:bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              @click="handleCancel"
            >
              {{ state.cancelText }}
            </button>
            <button
              type="button"
              :disabled="confirmLocked"
              :class="[
                'flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors',
                currentStyle.btn,
                confirmLocked ? 'opacity-50 cursor-not-allowed' : '',
              ]"
              @click="onAccept"
            >
              <template v-if="confirmLocked">Espera {{ secondsLeft }}s…</template>
              <template v-else>{{ state.confirmText }}</template>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.integrity-confirm-enter-active,
.integrity-confirm-leave-active {
  transition: opacity 0.2s ease;
}

.integrity-confirm-enter-active .integrity-confirm-panel,
.integrity-confirm-leave-active .integrity-confirm-panel {
  transition: transform 0.2s ease;
}

.integrity-confirm-enter-from,
.integrity-confirm-leave-to {
  opacity: 0;
}

.integrity-confirm-enter-from .integrity-confirm-panel {
  transform: scale(0.95) translateY(-12px);
}

.integrity-confirm-leave-to .integrity-confirm-panel {
  transform: scale(0.95) translateY(12px);
}
</style>
