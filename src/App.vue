<template>
  <gmap-map :center="center" :zoom="7" style="height: 100%; width: 75%">
    <gmap-marker :key="index" v-for="(m, index) in markers" :position="m.position" :clickable="true" :draggable="true" @click="center=m.position"></gmap-marker>
  </gmap-map>
</template>

<script>
import * as VueGoogleMaps from 'vue2-google-maps';
import Vue from 'vue';
import axios from 'axios'

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyDDy5IUrvL4bVAdeQ_MBvcqsy1rgs5X3V4'
  }
});

export default {
  data() {
    return {
      center: { lat: 10.0, lng: 10.0 },
      markers: [],
      networks: []
    }
  },
  methods: {
    getNetworks(cb) {
      axios
        .get("/api/network")
        .then(res => {
          this.networks = res.data;
          cb()
        })
        .catch(error => {
          console.log(error)
        });
    },
    createNetworkMarkers() {
      this.networks.forEach((network) => {
        this.markers.push({ position: { lat: network.lat, lng: network.lng } })
      });
    }
  },
  created() {
    this.getNetworks(this.createNetworkMarkers)
  },
}
</script>

<style>
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>