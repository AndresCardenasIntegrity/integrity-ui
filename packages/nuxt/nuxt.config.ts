const baseUrl = (process.env.NUXT_APP_BASE_URL || '/').replace(/\/?$/, '/')

export default defineNuxtConfig({
  $meta: {
    name: 'integrity-ui',
  },
  compatibilityDate: '2025-07-15',
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: `${baseUrl}favicon.svg` },
      ],
    },
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    '@nuxt/icon',
  ],
  googleFonts: {
    families: {
      Inter: [400, 500, 600, 700],
      'JetBrains Mono': [400, 500, 600],
    },
    display: 'swap',
  },
  icon: {
    serverBundle: 'local',
  },
  tailwindcss: {
    cssPath: '@integritysoftwarela/integrity-tokens/css',
  },
})
