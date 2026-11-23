<script setup lang="ts">
import { computed, useId } from 'vue'

const model = defineModel<string>({ default: '' })

const props = withDefaults(defineProps<{
  label?: string
  placeholder?: string
  type?: string
  hint?: string
  error?: string
  icon?: string
  disabled?: boolean
  required?: boolean
  id?: string
}>(), {
  label: undefined,
  placeholder: '',
  type: 'text',
  hint: undefined,
  error: undefined,
  icon: undefined,
  disabled: false,
  required: false,
  id: undefined,
})

const generatedId = useId()
const inputId = computed(() => props.id ?? generatedId)
</script>

<template>
  <div class="w-full">
    <label
      v-if="label"
      :for="inputId"
      class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-0.5">*</span>
    </label>

    <div class="relative">
      <Icon
        v-if="icon"
        :name="icon"
        class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
      />
      <input
        :id="inputId"
        v-model="model"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :aria-invalid="Boolean(error)"
        :class="[
          'block w-full rounded-lg border text-sm transition-colors',
          'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500',
          'focus:outline-none focus:ring-2 focus:ring-offset-0',
          icon ? 'pl-9 pr-3 py-2' : 'px-3 py-2',
          error
            ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20 dark:border-red-700'
            : 'border-slate-300 dark:border-slate-700 focus:border-accent focus:ring-accent/20',
          disabled ? 'opacity-60 cursor-not-allowed bg-slate-50 dark:bg-slate-800/60' : '',
        ]"
      />
    </div>

    <p v-if="error" class="mt-1 text-xs text-red-600 dark:text-red-400">
      {{ error }}
    </p>
    <p v-else-if="hint" class="mt-1 text-xs text-slate-500 dark:text-slate-400">
      {{ hint }}
    </p>
  </div>
</template>
