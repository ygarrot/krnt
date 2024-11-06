// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  typescript: {
    typeCheck: true
  },
  vite: {
    server: {
      watch: {
        usePolling: true
      }
    }
  },
  ssr: true,
  modules: ['vuetify-nuxt-module', '@nuxtjs/leaflet'],
  devtools: {enabled: true},
  vuetify: {moduleOptions: {       /* module specific options */}, vuetifyOptions: {       /* vuetify options */}},
  compatibilityDate: '2024-11-06'
})
