<template>
  <b-container fluid class="map-table-container">
    <b-row no-gutters class="map-table-row">
      <b-col xl="9">
        <gmap-map ref="map" @bounds_changed="setZoom" :center="center" :zoom="3" style="height: 100%;">
          <google-cluster ref="networkClusters">
            <gmap-marker ref="networkMarkers" class="network-markers" :icon="networkMarkerIcon" :key="index" v-for="(networkMarker, index) in networkMarkers" :position="networkMarker.position" :clickable="true" :draggable="true" @click="createStationMarkers(networkMarker)"></gmap-marker>
            <gmap-marker class="station-markers" :icon="networkMarkerIcon" :key="index" v-for="(stationMarker, index) in stationMarkers" :position="m.position" :clickable="true" :draggable="true" @click="selectStation(station)"></gmap-marker>
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

export default {
  name: 'map',
  data () {
    return {
      center: { lat: 0, lng: 0 },
      networkMarkers: [],
      stationMarkers: [],
      networks: [],
      selectedNetwork: {},
      selectedStation: {},
      stations: [],
      clicked: false
    }
  },
  methods: {
    setZoom () {
      const map = this.$refs.map
      map.setZoom = map.zoom - 1
      if (map.zoom > 15) {
        map.setZoom(15)
      }
    },
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
        this.networkMarkers.push(marker)
      })
    },
    createStationMarkers (selectedNetworkMarker) {
      this.selectedNetwork = selectedNetworkMarker
      this.hideNetworkMarkers()
      this.centerNetworkFitBounds()
    },
    centerNetworkFitBounds () {
      const map = this.$refs.map
      console.log(map)
      const bounds = this.$refs.map.bounds
      for (let i = 0; i < this.stationMarkers.length; i++) {
        bounds.extend(this.stationMarkers[i].getPosition())
      }
      map.setCenter(bounds.getCenter())
    },
    hide () {
      this.clearMarkers()
    },
    hideNetworkMarkers () {
      for (let i = 0; i < this.networkMarkers.length; i++) {
        const marker = this.$refs.networkMarkers[i].$markerObject
        // console.log(marker)
        marker.setVisible(false)
      }
    },
    removeNetworkClusters () {
      const networkClusters = this.$refs.networkClusters.$clusterObject.clusters_
      for (let i = 0; i < networkClusters.length; i++) {
        const networkCluster = networkClusters[i]
        networkCluster.markerClusterer_.clearMarkers()
      }
    },
    showNetworkMarkers () {
      for (let i = 0; i < this.networkMarkers.length; i++) {
        const marker = this.$refs.networkMarkers[i].$markerObject
        marker.setVisible(true)
      }
    },
    selectStation (station) {
      this.selectedStation = station
    },
    getStations () {
      axios
        .get('/api/network/' + this.selectedNetwork.id)
        .then(res => {
          this.stations = res.stations
        })
        .catch(error => {
          console.log(error)
        })
    },
    addStationMarkers () {
      this.stations.forEach((station) => {
        const marker = {
          title: station.name,
          station,
          position: {
            lat: station.lat, lng: station.lng
          },
          id: station.id,
          empty: station.empty,
          free: station.free,
          safe: station.safe,
          open: station.open,
          time: station.time
        }
        this.stationMarkers.push(marker)
      })
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
