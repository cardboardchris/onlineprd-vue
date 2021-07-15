import Vue from 'vue'
import Vuex from 'vuex'

import { auth } from './auth.module'
import { breadcrumbs } from './breadcrumbs.module'
import { referrer } from './referrer.module'
import { abilityPlugin } from '@/store/ability.plugin'
import { Ability } from '@casl/ability'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [abilityPlugin],
  getters: {
    ability () {
      const TYPE_KEY = Symbol.for('type')
      return new Ability([], {
        subjectName (subject) {
          return !subject || typeof subject === 'string'
            ? subject
            : subject[TYPE_KEY]
        }
      })
    }
  },
  modules: {
    auth, breadcrumbs, referrer
  }
})
