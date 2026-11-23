export default defineNuxtConfig({
  extends: ['@andrescardenasintegrity/integrity-ui-nuxt'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
    head: {
      title: 'Integrity UI/UX — Sistema de Diseño',
      meta: [
        { name: 'description', content: 'Sistema de diseño estandarizado, tokens, componentes y plantillas de Integrity.' },
      ],
    },
  },
  icon: {
    clientBundle: {
      scan: true,
    },
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: [
        '/',
        '/foundations',
        '/components',
        '/data',
        '/templates',
        '/templates/dashboard',
        '/templates/login',
      ],
    },
  },
})
