<template>
  <sidebar>
    <gmap-map slot="pusher" :center="center" :zoom="3" style="height: 100%; width: 100%">
      <google-cluster>
        <gmap-marker :icon="'http://localhost:9090/bike.png'" :key="index" v-for="(m, index) in markers" :position="m.position" :clickable="true" :draggable="true" @click="getStations(m)"></gmap-marker>
      </google-cluster>
    </gmap-map>
    <div slot="sidebar" class="item">test aaaaaaa</div>
  </sidebar>
</template>

<script>
import * as VueGoogleMaps from 'vue2-google-maps';
import Vue from 'vue';
import axios from 'axios'
import { Mixin } from 'semantic-ui-vue2'
import Sidebar from './components/Sidebar.vue'

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
      networks: [],
      selectedNetwork: {},
      stations: []
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
        const marker = {
          title: network.name,
          icon: '/assets/bike.png',
          network,
          position: {
            lat: network.lat, lng: network.lng
          },
          id: network.id
        }
        this.markers.push(marker)
      });
    },
    getStations(marker) {
      this.center = marker.position
      this.network = marker.network
      axios
        .get("/api/network/" + this.network.id)
        .then(res => {
          this.selectedNetwork = res.data;
          this.stations = selectedNetwork.stations;
        })
        .catch(error => {
          console.log(error)
        });
    }
  },
  created() {
    this.getNetworks(this.createNetworkMarkers)
  },
  mixins: [Mixin],
  components:{Sidebar}
}
</script>

<style>
html,
body,
app {
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>