<script setup lang="ts">
import { shallowRef } from 'vue'

const props = defineProps<{
  title: string
  description?: string
  code?: string
}>()

const { success } = useIntegrityToast()
const showCode = shallowRef(false)

async function copyCode() {
  if (!props.code || !import.meta.client) return
  try {
    await navigator.clipboard.writeText(props.code)
    success('Código copiado al portapapeles.')
  } catch {
    // ignore clipboard fallback
  }
}
</script>

<template>
  <IntegrityCard :title="title" :subtitle="description" padding="none">
    <template v-if="code" #actions>
      <IntegrityButton
        size="sm"
        variant="ghost"
        :icon="showCode ? 'i-heroicons-eye-slash' : 'i-heroicons-code-bracket'"
        @click="showCode = !showCode"
      >
        {{ showCode ? 'Ocultar código' : 'Ver código' }}
      </IntegrityButton>
      <IntegrityButton
        size="sm"
        variant="outline"
        icon="i-heroicons-clipboard-document"
        @click="copyCode"
      >
        Copiar
      </IntegrityButton>
    </template>

    <div class="p-5 sm:p-6">
      <slot />
    </div>

    <div
      v-if="code && showCode"
      class="border-t border-slate-200 dark:border-slate-800 bg-slate-950 text-slate-100 p-4 overflow-x-auto scrollbar-thin rounded-b-xl"
    >
      <pre class="font-mono text-xs leading-relaxed"><code>{{ code }}</code></pre>
    </div>
  </IntegrityCard>
</template>
