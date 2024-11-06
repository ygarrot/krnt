<template>
<v-layout class="rounded rounded-md">
  <v-navigation-drawer location="left" width="300">
      <v-list>
        <v-list-item
          v-bind:class="{ 'bg-blue-500': zone?.id === selectedZone?.id }"
          v-for="zone in searchedZones" :key="zone.id" @click="setSelectedZone(zone)">
            <v-list-item-title
              v-bind:class="{ 'text-red': zone?.id === selectedZone?.id }"
              >{{ zone.name }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-navigation-drawer location="right" v-if="zoneWithDetail" width="300">
      <v-card>
        <v-card-title>{{ selectedZone.name }}</v-card-title>
        <v-card-item>
          <v-card-text>
            <p>
              {{zoneWithDetail.metadata.nom_culture}} - {{zoneWithDetail.metadata.surf_parc || parseInt(zoneWithDetail.metadata.area) / 10000}} ha
            </p>

          </v-card-text>
        </v-card-item>
      </v-card>
    </v-navigation-drawer>

    <v-app-bar >
      <v-col cols="4">
      <v-text-field v-model="search" label="Rechercher parmis les zones" />
      </v-col>
    </v-app-bar>

    <v-main class="d-flex align-center justify-center" style="min-height: 300px;">

      <Map v-model:zones="zones" v-model:selectedZone="selectedZone" @selectPolygon="setSelectedZone" />
    </v-main>
  </v-layout>
</template>

<script setup>
const { $api } = useNuxtApp()


const zones = ref([])
const search = ref('')
const zoneWithDetail = ref(null)
const selectedZone = ref(null)
 const setSelectedZone = async(zone) => {
   selectedZone.value = zone
   if (!zone) return
   zoneWithDetail.value = await $api.findZoneWithDetailById(zone.id)
 }

const searchedZones = computed(() => {
  return zones.value.filter(zone => zone?.name?.includes(search.value))
})

</script>
