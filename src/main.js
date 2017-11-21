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
  database: 'test',
  schemas: [
    { tests: 'id, label, created_at, updated_at' },
    { connections: 'id, location_from, location_to, departure, arrival, created_at, updated_at' }
  ]
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
