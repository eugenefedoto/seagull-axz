import Vue from 'vue'
import Router from 'vue-router'
import Map from '@/components/map/Map'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Map',
      component: Map
    }
  ]
})
