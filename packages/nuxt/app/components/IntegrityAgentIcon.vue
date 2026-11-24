<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  variant?: 'fab' | 'avatar' | 'mark'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  pulse?: boolean
  ariaLabel?: string
}>(), {
  variant: 'mark',
  size: 'md',
  pulse: false,
  ariaLabel: 'Asistente IA Integrity',
})

const sizeMap = {
  sm: { shell: 28, mark: 16, watermark: 26, pulse: 'w-1.5 h-1.5 -top-0.5 -right-0.5', ai: 'text-[10px]' },
  md: { shell: 36, mark: 20, watermark: 34, pulse: 'w-2 h-2 -top-0.5 -right-0.5', ai: 'text-xs' },
  lg: { shell: 56, mark: 30, watermark: 52, pulse: 'w-2.5 h-2.5 -top-0.5 -right-0.5', ai: 'text-lg' },
  xl: { shell: 64, mark: 36, watermark: 60, pulse: 'w-3 h-3 -top-0.5 -right-0.5', ai: 'text-xl' },
} as const

const dims = computed(() => sizeMap[props.size])
const showPulse = computed(() => props.pulse || props.variant === 'fab')
const showAiLabel = computed(() => props.variant === 'fab')

const shellClass = computed(() => {
  if (props.variant === 'fab') return 'rounded-2xl shadow-lg shadow-brand-600/35'
  if (props.variant === 'avatar') return 'rounded-lg shadow-subtle'
  return 'rounded-xl shadow-subtle'
})
</script>

<template>
  <span
    class="relative inline-flex shrink-0 select-none bg-transparent"
    :style="{ width: `${dims.shell}px`, height: `${dims.shell}px` }"
    role="img"
    :aria-label="ariaLabel"
  >
    <span
      class="absolute inset-0 overflow-hidden flex items-center justify-center bg-accent text-white"
      :class="shellClass"
    >
      <IntegrityMark
        v-if="showAiLabel"
        class="absolute inset-0 m-auto pointer-events-none opacity-25 text-white"
        :style="{ width: `${dims.watermark}px`, height: `${dims.watermark}px` }"
      />

      <span
        v-if="showAiLabel"
        class="relative z-[1] font-bold tracking-tight text-white drop-shadow-sm leading-none"
        :class="dims.ai"
      >
        AI
      </span>
      <IntegrityMark
        v-else
        class="relative z-[1] text-white"
        :style="{ width: `${dims.mark}px`, height: `${dims.mark}px` }"
      />
    </span>

    <span
      v-if="showPulse"
      class="absolute z-[2] rounded-full bg-emerald-400 ring-2 ring-accent shadow-sm"
      :class="dims.pulse"
      aria-hidden="true"
    />
  </span>
</template>
