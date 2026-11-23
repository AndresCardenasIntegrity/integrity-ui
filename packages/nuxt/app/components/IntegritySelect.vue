<script setup lang="ts">
import { computed, useId } from 'vue'
import type { IntegritySelectOption } from '../types/ui'

const model = defineModel<string>({ default: '' })

const props = withDefaults(defineProps<{
  label?: string
  options: IntegritySelectOption[]
  placeholder?: string
  hint?: string
  error?: string
  disabled?: boolean
  required?: boolean
  id?: string
}>(), {
  label: undefined,
  placeholder: undefined,
  hint: undefined,
  error: undefined,
  disabled: false,
  required: false,
  id: undefined,
})

const generatedId = useId()
const selectId = computed(() => props.id ?? generatedId)
</script>

<template>
  <div class="w-full">
    <label
      v-if="label"
      :for="selectId"
      class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-0.5">*</span>
    </label>

    <select
      :id="selectId"
      v-model="model"
      :disabled="disabled"
      :required="required"
      :aria-invalid="Boolean(error)"
      :class="[
        'block w-full rounded-lg border px-3 py-2 text-sm transition-colors',
        'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100',
        'focus:outline-none focus:ring-2 focus:ring-offset-0',
        error
          ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20 dark:border-red-700'
          : 'border-slate-300 dark:border-slate-700 focus:border-accent focus:ring-accent/20',
        disabled ? 'opacity-60 cursor-not-allowed bg-slate-50 dark:bg-slate-800/60' : '',
      ]"
    >
      <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
      <option
        v-for="opt in options"
        :key="opt.value"
        :value="opt.value"
        :disabled="opt.disabled"
      >
        {{ opt.label }}
      </option>
    </select>

    <p v-if="error" class="mt-1 text-xs text-red-600 dark:text-red-400">
      {{ error }}
    </p>
    <p v-else-if="hint" class="mt-1 text-xs text-slate-500 dark:text-slate-400">
      {{ hint }}
    </p>
  </div>
</template>
