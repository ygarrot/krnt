import * as turf from "@turf/turf";
const findZoneCenter = (zone) => {
  let coordinate = []
  if (zone.geom.type === 'Polygon') {
    const bbox = turf.bbox(zone.geom)
    coordinate = [
      (bbox[1] + bbox[3]) / 2,
      (bbox[0] + bbox[2]) / 2
    ]
  } else if (zone.geom.type === 'MultiPolygon') {
    coordinate = zone.geom.coordinates[0][0][0]
  }
  return coordinate

}

export {findZoneCenter}
