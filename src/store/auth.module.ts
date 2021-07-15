// based on tutorial from https://bezkoder.com/jwt-vue-vuex-authentication/

import { AuthService } from '@/services/auth-service'
import { userService } from '@/services/user.service'
import { User } from '@/models/user'
import Utils from '@/utils/utils'

const user = JSON.parse(localStorage.getItem('user'))
const initialState = user
  ? { status: { loggedIn: true }, user, rules: user.rules }
  : { status: {}, user: null, rules: [] }

const authService = new AuthService()

export const auth = {
  namespaced: true,
  state: initialState,
  actions: {
    login ({ commit }) {
      return authService.login().then(
        accessToken => {
          // blank user since profile has not been retrieved
          let user = new User({ accessToken: accessToken })

          // store user in order to use accessToken for service calls
          localStorage.setItem('user', JSON.stringify(user))

          // get user profile and create new User with updated profile
          return userService.getCurrentUser().then(response => {
            if (response) {
              // change response from snake case to camel case
              let userResponse = Utils.keysToCamel(response.data.user)
              let updatedUser = new User(userResponse)

              updatedUser.accessToken = user.accessToken
              updatedUser.rules = response.data.rules

              // set updated user
              localStorage.setItem('user', JSON.stringify(updatedUser))

              commit('loginSuccess', updatedUser)

              return Promise.resolve(updatedUser)
            } else {
              return Promise.reject(new Error('response was empty'))
            }
          }, reason => {
            commit('loginFailure')
            return Promise.reject(reason)
          })
        },
        error => {
          commit('loginFailure')
          return Promise.reject(error.response.data)
        }
      )
    },

    logout ({ commit }) {
      return authService.logout().then(response => {
        localStorage.removeItem('user')
        commit('logout')
        return Promise.resolve(response)
      }, reason => {
        return Promise.reject(reason)
      })
    }
  },
  mutations: {
    loginSuccess (state, user) {
      state.status = { loggedIn: true }
      state.rules = user.rules
      state.user = user
    },
    loginFailure (state) {
      state.status = {}
      state.user = null
      state.rules = []
    },
    logout (state) {
      state.status = {}
      state.user = null
      state.rules = []
    }
  }
}
