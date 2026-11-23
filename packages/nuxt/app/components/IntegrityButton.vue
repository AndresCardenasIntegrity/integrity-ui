<script setup lang="ts">
import { computed } from 'vue'
import type { IntegrityButtonSize, IntegrityButtonVariant } from '../types/ui'

const props = withDefaults(defineProps<{
  variant?: IntegrityButtonVariant
  size?: IntegrityButtonSize
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  block?: boolean
  icon?: string
  iconRight?: string
}>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
  loading: false,
  block: false,
  icon: undefined,
  iconRight: undefined,
})

const isDisabled = computed(() => props.disabled || props.loading)

const variantClass = computed(() => {
  const map: Record<IntegrityButtonVariant, string> = {
    primary: 'bg-accent text-white hover:bg-accent-hover shadow-subtle focus-visible:ring-accent',
    secondary: 'bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 focus-visible:ring-slate-400',
    outline: 'border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 focus-visible:ring-accent',
    ghost: 'bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus-visible:ring-slate-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-subtle focus-visible:ring-red-500',
  }
  return map[props.variant]
})

const sizeClass = computed(() => {
  const map: Record<IntegrityButtonSize, string> = {
    sm: 'h-8 px-3 text-xs gap-1.5 rounded-lg',
    md: 'h-9 px-4 text-sm gap-2 rounded-lg',
    lg: 'h-11 px-5 text-sm gap-2 rounded-xl',
  }
  return map[props.size]
})

const buttonClasses = computed(() => [
  'inline-flex items-center justify-center font-medium transition-colors whitespace-nowrap select-none',
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950',
  variantClass.value,
  sizeClass.value,
  props.block ? 'w-full' : '',
  isDisabled.value ? 'opacity-50 cursor-not-allowed pointer-events-none' : '',
])
</script>

<template>
  <button :type="type" :disabled="isDisabled" :class="buttonClasses">
    <span
      v-if="loading"
      class="h-4 w-4 shrink-0 rounded-full border-2 border-current border-t-transparent animate-spin"
      aria-hidden="true"
    />
    <Icon v-else-if="icon" :name="icon" class="h-4 w-4 shrink-0" />
    <slot />
    <Icon v-if="iconRight && !loading" :name="iconRight" class="h-4 w-4 shrink-0" />
  </button>
</template>
