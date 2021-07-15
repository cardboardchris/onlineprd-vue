import Vue from 'vue'
import VueRouter from 'vue-router'
import { routes } from './routes'
import store from '../store'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: routes
})

// update breadcrumbs based on each route
router.beforeEach((to, from, next) => {
  store.commit('breadcrumbs/set', to.meta.breadcrumbs)
  next()
})

export default router
