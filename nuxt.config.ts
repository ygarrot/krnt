// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  modules: ['vuetify-nuxt-module', '@nuxtjs/leaflet'],
  compatibilityDate: '2024-04-03',
  devtools: {enabled: true},
  vuetify: {moduleOptions: {       /* module specific options */}, vuetifyOptions: {       /* vuetify options */}}
})
