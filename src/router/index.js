import Vue from 'vue'
import Router from 'vue-router'
import HomeView from '@/components/HomeView'
import AddView from '@/components/AddView'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/add',
      name: 'add',
      component: AddView
    }
  ]
})
