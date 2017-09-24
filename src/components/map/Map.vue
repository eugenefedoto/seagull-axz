<template>
  <b-container fluid class="map-table-container">
    <b-row no-gutters class="map-table-row">
      <b-col xl="9">
        <gmap-map :center="center" :zoom="3" style="height: 100%;">
          <google-cluster>
            <gmap-marker class="network-markers" :icon="networkMarkerIcon" :key="index" v-for="(marker, index) in markers" :position="marker.position" :clickable="true" :draggable="true" @click="getStations(marker)"></gmap-marker>
          </google-cluster>
          <google-cluster>
            <gmap-marker class="station-markers" :key="index" v-for="(station, index) in stations" :position="m.position" :clickable="true" :draggable="true" @click="selectStation(station)"></gmap-marker>
          </google-cluster>
        </gmap-map>
      </b-col>
      <b-col>
        <sidebar :selectedStation="selectedStation"></sidebar>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import * as VueGoogleMaps from 'vue2-google-maps'
import Vue from 'vue'
import axios from 'axios'
import BootstrapVue from 'bootstrap-vue'
import Sidebar from '@/components/sidebar/Sidebar.vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyDDy5IUrvL4bVAdeQ_MBvcqsy1rgs5X3V4'
  }
})

Vue.component('google-cluster', VueGoogleMaps.Cluster)

const items = [
  { isActive: true, age: 40, first_name: 'Dickerson', last_name: 'Macdonald' },
  { isActive: false, age: 21, first_name: 'Larsen', last_name: 'Shaw' },
  { isActive: false, age: 89, first_name: 'Geneva', last_name: 'Wilson' },
  { isActive: true, age: 38, first_name: 'Jami', last_name: 'Carney' }
]

export default {
  name: 'map',
  data () {
    return {
      center: { lat: 0, lng: 0 },
      markers: [],
      networks: [],
      selectedNetwork: {},
      stations: [],
      items: items,
      selectedStation: {}
    }
  },
  methods: {
    getNetworks (cb) {
      axios
        .get('/api/network')
        .then(res => {
          this.networks = res.data
          cb()
        })
        .catch(error => {
          console.log(error)
        })
    },
    createNetworkMarkers () {
      this.networks.forEach((network) => {
        const marker = {
          title: network.name,
          network,
          position: {
            lat: network.lat, lng: network.lng
          },
          id: network.id
        }
        this.markers.push(marker)
      })
    },
    getStations (marker) {
      this.center = marker.position
      this.network = marker.network
      axios
        .get('/api/network/' + this.network.id)
        .then(res => {
          this.selectedNetwork = res.data
          this.stations = this.selectedNetwork.stations
          this.createStationMarkers()
        })
        .catch(error => {
          console.log(error)
        })
    },
    createStationMarkers () {
      axios
        .get('/api/network/' + this.network.id)
        .then(res => {
          this.selectedNetwork = res.data
          this.stations = this.selectedNetwork.stations
          // this.createStationMarkers()
        })
        .catch(error => {
          console.log(error)
        })
    },
    selectStation (station) {
      this.selectedStation = station
    }
  },
  created () {
    this.getNetworks(this.createNetworkMarkers)
  },
  components: { Sidebar },
  computed: {
    networkMarkerIcon () {
      return require('./bike.png')
    }
  }
}
</script>

<style>
html,
body,
#app,
.map-table-container,
.map-table-row {
  height: 100%;
}
</style>
