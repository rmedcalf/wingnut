import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: require('@/components/Dashboard').default
    },
    {
      path: '*',
      redirect: '/'
    },
    {
      path: '/importer',
      name: 'importer',
      component: require('@/components/Importer').default
    }
  ]
})
