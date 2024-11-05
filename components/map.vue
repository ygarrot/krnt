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
    v-for="polygon in polygons"
    :key="polygon.id"
    :geojson="polygon.geom"
    :style="{
      color: 'red',
      weight: 2,
      opacity: 1,
      fillColor: 'red',
      fillOpacity: 0.2
    }"
    />
    </LMap>
  </div>
</template>

<script setup>

import L from 'leaflet'
const map = ref(null)
if (typeof(Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  }
}

const getTileUrls = (bounds, tileLayer, zoom) => {
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

function getTileURL(lat, lon, zoom) {
    const x  = parseInt(Math.floor( (lon + 180) / 360 * (1<<zoom) ));
    const y = parseInt(Math.floor( (1 - Math.log(Math.tan(lat.toRad()) + 1 / Math.cos(lat.toRad())) / Math.PI) / 2 * (1<<zoom) ));
  return { x, y, z: zoom }
}
import { ref } from 'vue'
const zoom = ref(12)

const dataset = 'e0836fee-6379-49b0-aba7-35e5e01209de'

const polygons = ref(null)

const onZoomUpdate = async(e) => {
  zoom.value = e.target.getZoom()
  console.log(zoom.value)
  if (zoom.value < 13) return;
  const baseUrl = 'https://agri-geo-data-gate.karnott.fr/geometries/tiles/'
  const tileLayer = map.value.leafletObject._layers[0]
  const allUrls = getTileUrls(e.target.getBounds(), tileLayer, zoom.value)
  const currentTiles = allUrls.map(async(url) => {
    const { x, y, z } = url
    const data = await $fetch(`${baseUrl}${z}/${x}/${y}?dataset_ids=${dataset}`)
    if (!data) return
    return data
  })
  const cT = await Promise.all(currentTiles)
  polygons.value = cT.flat().filter((el) => el)
}

</script>
