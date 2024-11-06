class Queries {
  baseUrl: string
  dataset: string
  constructor(baseUrl: string, dataset: string) {
    this.baseUrl = baseUrl
    this.dataset = dataset
  }

  findTile = async (x: number, y: number, z: number) => {
    const url = `${this.baseUrl}/geometries/tiles/${z}/${x}/${y}?dataset_ids=${this.dataset}`
    return $fetch(url)
  }

  findZoneWithDetailById = async (id: string) => {
    const url = `${this.baseUrl}/geometries/${id}`
    return $fetch(url)
  }
}

export default Queries
