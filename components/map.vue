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

type XYZ = { x: number, y: number, z: number }

const getTileXYZ = (bounds: L.LatLngBounds, zoom: number): XYZ[] => {
  const divide = 256
  if (!map?.value?.leafletObject) return
  let min = map.value.leafletObject.project(bounds.getNorthWest(), zoom).divideBy(divide).floor(),
    max = map.value.leafletObject.project(bounds.getSouthEast(), zoom).divideBy(divide).floor(),
    urls = [];

  for (let i = min.x; i <= max.x; i++) {
    for (let j = min.y; j <= max.y; j++) {
      let coords: XYZ = {
        ...new L.Point(i, j),
        z: zoom
      }
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

const filterDuplicates = (array: any[]) => {
  let ids: number[] = []
  return array.filter((item) => {
    if (ids.includes(item.id)) return false
    ids.push(item.id)
    return true
  })
}

const onZoomUpdate = async(e: L.LeafletEvent) => {
  zoom.value = e.target.getZoom()
  if (zoom.value < 13) return;
  const tileXYZ = getTileXYZ(e.target.getBounds(), zoom.value)
  const currentTiles = tileXYZ.map(async(url) => {
    const { x, y, z } = url
    const data = await $api.findTile( x, y, z)
    if (!data) return
    return data
  })
  let cT = (await Promise.all(currentTiles)).flat()

  zones.value = filterDuplicates(cT)
}
</script>
