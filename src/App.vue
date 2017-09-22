<template>
  <gmap-map :center="center" :zoom="3" style="height: 100%; width: 75%">
    <google-cluster>
      <gmap-marker :key="index" v-for="(m, index) in markers" :position="m.position" :clickable="true" :draggable="true" @click="center=m.position"></gmap-marker>
    </google-cluster>
  </gmap-map>
</template>

<script>
import * as VueGoogleMaps from 'vue2-google-maps';
import Vue from 'vue';
import axios from 'axios'
import MarkerClusterer from './markerclusterer'

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyDDy5IUrvL4bVAdeQ_MBvcqsy1rgs5X3V4'
  }
});

Vue.component('google-cluster', VueGoogleMaps.Cluster);

export default {
  data() {
    return {
      center: { lat: 0, lng: 0 },
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
  }
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