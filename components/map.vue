<template>
  <div style="height:100vh; width:100vw">
    <LMap
      ref="map"
      :zoom="zoom"
      :center="[47.21322, -1.559482]"
      :use-global-leaflet="false"
      @zoomend="onZoomUpdate"
      @moveend="onZoomUpdate"
      >
      <LTileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&amp;copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors"
        layer-type="base"
        name="OpenStreetMap"
        />

        <LGeoJson
          v-for="polygon in zones"
          :key="polygon.id"
          :geojson="polygon.geom"
          :options-style="{ color: selectedZone?.id === polygon.id ? '#ff0000' : '#3388ff' }"
          @click="() => emit('selectPolygon', polygon)"
          />
    </LMap>
  </div>
</template>

<script setup lang="ts">

import L from 'leaflet'
import { ref } from 'vue'
const { $api } = useNuxtApp()
const emit = defineEmits(['selectPolygon'])
const map = ref(null)

const getTileUrls = (bounds, zoom) => {
  const divide = 256
  var min = map.value.leafletObject.project(bounds.getNorthWest(), zoom).divideBy(divide).floor(),
    max = map.value.leafletObject.project(bounds.getSouthEast(), zoom).divideBy(divide).floor(),
    urls = [];

  for (var i = min.x; i <= max.x; i++) {
    for (var j = min.y; j <= max.y; j++) {
      var coords = new L.Point(i, j);
      coords.z = zoom;
      urls.push(coords)
    }
  }

  return urls;
}

const zoom = ref(12)
const zones = defineModel('zones', { type: Array })
const selectedZone = defineModel('selectedZone', { type: Object })


watch(selectedZone, (zone) => {
  if (!zone) return
  const coordinates = findZoneCenter(zone)
  if (coordinates?.length !== 2) return
  map.value.leafletObject.setView([coordinates[1], coordinates[0]], 15)
})

const onZoomUpdate = async(e) => {
  zoom.value = e.target.getZoom()
  let ids = []
  if (zoom.value < 13) return;
  const allUrls = getTileUrls(e.target.getBounds(), zoom.value)
  const currentTiles = allUrls.map(async(url) => {
    const { x, y, z } = url
    const data = await $api.findTile( x, y, z)
    if (!data) return
    return data
  })
  let cT = (await Promise.all(currentTiles)).flat()
  let filtered = []
  cT.forEach((tile) => {
    if (ids.includes(tile.id)) return
    ids.push(tile.id)
    filtered.push(tile)
  })

  zones.value = filtered.flat()
}
</script>
