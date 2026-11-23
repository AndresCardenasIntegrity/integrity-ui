<script setup lang="ts">
import { computed, shallowRef, useId } from 'vue'
import { formatEmailList, parseEmailList, validateEmailList } from '../utils/emailList'

const model = defineModel<string[]>({ default: () => [] })

const props = withDefaults(defineProps<{
  label?: string
  placeholder?: string
  hint?: string
  error?: string
  disabled?: boolean
  required?: boolean
  maxItems?: number
  id?: string
}>(), {
  label: undefined,
  placeholder: 'Escribe o pega correos separados por ; o Enter',
  hint: undefined,
  error: undefined,
  disabled: false,
  required: false,
  maxItems: undefined,
  id: undefined,
})

const emit = defineEmits<{
  invalid: [entries: string[]]
}>()

const generatedId = useId()
const inputId = computed(() => props.id ?? generatedId)
const draft = shallowRef('')
const localWarning = shallowRef('')

const formattedSemicolon = computed(() => formatEmailList(model.value, '; '))

function commitEntries(raw: string) {
  if (props.disabled) return
  const tokens = parseEmailList(raw)
  if (!tokens.length) {
    draft.value = ''
    return
  }

  const { valid, invalid } = validateEmailList(tokens)
  const existing = new Set(model.value.map(item => item.toLowerCase()))
  const added: string[] = []
  const duplicated: string[] = []

  for (const email of valid) {
    if (existing.has(email)) {
      duplicated.push(email)
      continue
    }
    if (props.maxItems !== undefined && model.value.length + added.length >= props.maxItems) {
      localWarning.value = `Límite máximo alcanzado (${props.maxItems} correos).`
      break
    }
    existing.add(email)
    added.push(email)
  }

  if (added.length) {
    model.value = [...model.value, ...added]
  }

  if (invalid.length) {
    emit('invalid', invalid)
    localWarning.value = `Correo inválido: ${invalid.join(', ')}`
    draft.value = invalid.join('; ')
    return
  }

  if (duplicated.length && !added.length) {
    localWarning.value = `Ya agregado: ${duplicated.join(', ')}`
  } else {
    localWarning.value = ''
  }

  draft.value = ''
}

function onKeydown(event: KeyboardEvent) {
  if (props.disabled) return
  if (event.key === 'Enter' || event.key === ';' || event.key === ',') {
    if (draft.value.trim()) {
      event.preventDefault()
      commitEntries(draft.value)
    }
  } else if (event.key === 'Backspace' && !draft.value && model.value.length) {
    model.value = model.value.slice(0, -1)
    localWarning.value = ''
  }
}

function onPaste(event: ClipboardEvent) {
  if (props.disabled) return
  const text = event.clipboardData?.getData('text') ?? ''
  if (/[;,\n\r\t ]/.test(text)) {
    event.preventDefault()
    commitEntries(`${draft.value} ${text}`)
  }
}

function removeEmail(email: string) {
  if (props.disabled) return
  model.value = model.value.filter(item => item !== email)
  localWarning.value = ''
}

function clearAll() {
  if (props.disabled) return
  model.value = []
  draft.value = ''
  localWarning.value = ''
}
</script>

<template>
  <div class="w-full">
    <div v-if="label" class="flex items-center justify-between gap-2 mb-1.5">
      <label :for="inputId" class="block text-xs font-medium text-slate-700 dark:text-slate-300">
        {{ label }}
        <span v-if="required" class="text-red-500 ml-0.5">*</span>
      </label>
      <div class="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
        <span v-if="model.length" class="tabular-nums">
          {{ model.length }}<template v-if="maxItems"> / {{ maxItems }}</template>
        </span>
        <button
          v-if="model.length && !disabled"
          type="button"
          class="text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          @click="clearAll"
        >
          Limpiar
        </button>
      </div>
    </div>

    <div
      :class="[
        'flex flex-wrap items-center gap-1.5 rounded-lg border px-2.5 py-2 text-sm transition-colors',
        'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100',
        'focus-within:ring-2 focus-within:ring-offset-0',
        error || localWarning
          ? 'border-red-400 focus-within:border-red-500 focus-within:ring-red-500/20 dark:border-red-700'
          : 'border-slate-300 dark:border-slate-700 focus-within:border-accent focus-within:ring-accent/20',
        disabled ? 'opacity-60 cursor-not-allowed bg-slate-50 dark:bg-slate-800/60' : '',
      ]"
    >
      <span
        v-for="email in model"
        :key="email"
        class="inline-flex items-center gap-1 max-w-full rounded-md border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 font-mono text-xs text-slate-800 dark:text-slate-100"
      >
        <span class="truncate">{{ email }}</span>
        <button
          v-if="!disabled"
          type="button"
          :aria-label="`Eliminar ${email}`"
          class="rounded p-0.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          @click="removeEmail(email)"
        >
          <Icon name="i-heroicons-x-mark" class="h-3 w-3" />
        </button>
      </span>

      <input
        :id="inputId"
        v-model="draft"
        type="text"
        inputmode="email"
        autocomplete="off"
        :disabled="disabled"
        :placeholder="model.length ? 'Agregar otro correo…' : placeholder"
        :aria-invalid="Boolean(error || localWarning)"
        class="flex-1 min-w-[12rem] border-0 bg-transparent p-0 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-0"
        @keydown="onKeydown"
        @paste="onPaste"
        @blur="commitEntries(draft)"
      />
    </div>

    <p v-if="error" class="mt-1 text-xs text-red-600 dark:text-red-400">
      {{ error }}
    </p>
    <p v-else-if="localWarning" class="mt-1 text-xs text-amber-700 dark:text-amber-400">
      {{ localWarning }}
    </p>
    <p v-else-if="hint" class="mt-1 text-xs text-slate-500 dark:text-slate-400">
      {{ hint }}
    </p>

    <p
      v-if="model.length && !error"
      class="mt-1.5 font-mono text-[11px] text-slate-400 dark:text-slate-500 truncate"
      :title="formattedSemicolon"
    >
      Salida (;): {{ formattedSemicolon }}
    </p>
  </div>
</template>
