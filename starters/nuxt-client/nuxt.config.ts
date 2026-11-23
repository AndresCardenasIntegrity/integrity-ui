export default defineNuxtConfig({
  extends: ['@andrescardenasintegrity/integrity-ui-nuxt'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    head: {
      title: 'Portal Cliente — Integrity',
      meta: [
        { name: 'description', content: 'Aplicación web construida sobre Integrity UI/UX.' },
      ],
    },
  },
})
