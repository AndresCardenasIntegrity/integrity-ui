export default defineNuxtConfig({
  extends: ['@andrescardenasintegrity/integrity-ui-nuxt'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    head: {
      title: 'Integrity UI/UX — Sistema de Diseño',
      meta: [
        { name: 'description', content: 'Sistema de diseño estandarizado, tokens, componentes y plantillas de Integrity.' },
      ],
    },
  },
})
