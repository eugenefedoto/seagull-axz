<template>
    <img :src="thumbnail320wSrc" alt="station at street level" :srcset="getSrcset" :href="photoPageUrl">
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      thumbnail320wSrc: '',
      thumbnail640wSrc: '',
      thumbnail1024wSrc: '',
      thumbnail2048wSrc: '',
      lat: this.selectedStation.lat,
      lng: this.selectedStation.lng
    }
  },
  props: ['selectedStation'],
  methods: {
    getStationImages () {
      axios
                .get(this.imageUrl())
                .then(res => {
                  const key = res.features[0].key
                  this.getImagesSrc(key)
                })
                .catch(error => {
                  console.log(error)
                })
    }
  },
  getImagesSrc (key) {
    this.thumbnail320wSrc = `https://d1cuyjsrcm0gby.cloudfront.net/${key}/thumb-320.jpg`
    this.thumbnail640wSrc = `https://d1cuyjsrcm0gby.cloudfront.net/${key}/thumb-320.jpg`
    this.thumbnail1024wSrc = `https://d1cuyjsrcm0gby.cloudfront.net/${key}/thumb-320.jpg`
    this.thumbnail2048wSrc = `https://d1cuyjsrcm0gby.cloudfront.net/${key}/thumb-320.jpg`
  },
  computed: {
    getSrcset () {
      const srcSet = this.thumbnail640wSrc + ' 640w, ' + this.thumbnail1024wSrc + ' 1024w, ' + this.thumbnail2048wSrc + ' 2048w'
      return srcSet
    },
    imageUrl () {
      const baseUrl = 'https://a.mapillary.com/v3/images?'
      const clientId = 'client_id=SHNGU2JaY3Z4M3hEMWd5eW1CNElhQTowM2FhZjZhZWIyYmVkOTY0'
      const lookAt = "'&lookat=' + lat + ',' + lng"
      const finalUrl = baseUrl + clientId + lookAt
      return finalUrl
    },
    photoPageUrl () {
      return `https://www.mapillary.com/app/?focus=photo&pKey=${this.key}`
    }
  },
  created () {
    this.getStationImages
  }
}
</script>

<style scoped>

</style>


