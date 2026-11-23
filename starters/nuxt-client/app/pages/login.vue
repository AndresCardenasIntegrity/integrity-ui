<script setup lang="ts">
import { shallowRef } from 'vue'

definePageMeta({ layout: false })

const { success } = useIntegrityToast()
const email = shallowRef('')
const password = shallowRef('')
const loading = shallowRef(false)

async function onSubmit() {
  loading.value = true
  await new Promise(resolve => setTimeout(resolve, 400))
  loading.value = false
  success('Inicio de sesión de demostración completado.')
  await navigateTo('/')
}
</script>

<template>
  <main class="min-h-screen flex items-center justify-center bg-[#fafafa] dark:bg-[#0a0a0a] px-4 py-12">
    <div class="w-full max-w-sm space-y-6">
      <div class="flex flex-col items-center text-center gap-3">
        <IntegrityMark class="h-11 w-11" />
        <div>
          <h1 class="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Iniciar sesión
          </h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Accede con tus credenciales corporativas de Integrity.
          </p>
        </div>
      </div>

      <IntegrityCard>
        <form class="space-y-4" @submit.prevent="onSubmit">
          <IntegrityInput
            v-model="email"
            type="email"
            label="Correo electrónico"
            placeholder="usuario@integrity-la.com"
            icon="i-heroicons-envelope"
            required
          />
          <IntegrityInput
            v-model="password"
            type="password"
            label="Contraseña"
            placeholder="••••••••"
            icon="i-heroicons-lock-closed"
            required
          />
          <IntegrityButton type="submit" block :loading="loading">
            Ingresar
          </IntegrityButton>
        </form>
      </IntegrityCard>
    </div>
  </main>
</template>
