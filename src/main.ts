import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import '@/plugins/bootstrap-vue'
import App from './App.vue'
import router from './router'

import axios from 'axios'

import {
  BootstrapVue,
  BIconCheck,
  BIconX,
  BIconQuestion,
  BIconTrashFill,
  BIconClock,
  BIconBellFill,
  BIconPersonPlus,
  BIconCalendar2Plus,
  BIconChatSquare } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import '@/assets/styles.scss'

import { abilitiesPlugin } from '@casl/vue'
import store from './store'

Vue.use(BootstrapVue)
Vue.use(require('vue-moment'))

Vue.component('BIconCheck', BIconCheck)
Vue.component('BIconX', BIconX)
Vue.component('BIconQuestion', BIconQuestion)
Vue.component('BIconTrashFill', BIconTrashFill)
Vue.component('BIconClock', BIconClock)
Vue.component('BIconBellFill', BIconBellFill)
Vue.component('BIconPersonPlus', BIconPersonPlus)
Vue.component('BIconCalendar2Plus', BIconCalendar2Plus)
Vue.component('BIconChatSquare', BIconChatSquare)

Vue.config.productionTip = false

Vue.use(abilitiesPlugin, store.getters.ability)

new Vue({
  router,
  store,
  render: h => h(App),
  mounted: function () {
    // inspired by this post: https://codeburst.io/global-loader-component-using-vue-js-and-axios-interceptors-3880a136a4ac
    this.enableInterceptor()
  },
  methods: {
    enableInterceptor () {
      this.axiosInterceptor = axios.interceptors.request.use((config) => {
        return config
      }, (error) => {
        return Promise.reject(error)
      })

      axios.interceptors.response.use((response) => {
        return response
      }, function (error) {
        switch (error.response.status) {
          // Not authorized (not logged in) error
          case 401:
            store.dispatch('auth/logout').then(() => {
              router.push({ name: 'session-ended' })
            }).catch(reason => {
              alert('You were unable to end your session. Try again later or contact your system administrator if this issue continues. \n\n' + reason)
            })
            break
          default:
            return Promise.reject(error)
        }
      })
    },

    disableInterceptor () {
      axios.interceptors.request.eject(this.axiosInterceptor)
    }
  }
}).$mount('#app')
