// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

// import Dexie from 'dexie'
import VueIdb from 'vue-idb'

Vue.use(VueIdb)

export default new VueIdb({
  database: 'NextStop',
  schemas: [
    { connections: 'id, location_from, location_to, departure, arrival, all_others_info, created_at, updated_at' }
  ]
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
