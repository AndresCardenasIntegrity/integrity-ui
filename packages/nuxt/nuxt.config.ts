export default defineNuxtConfig({
  $meta: {
    name: 'integrity-ui',
  },
  compatibilityDate: '2025-07-15',
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
    cssPath: '@andrescardenasintegrity/integrity-tokens/css',
  },
})
