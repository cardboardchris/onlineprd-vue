export const referrer = {
  namespaced: true,
  state: {
    // objects like {department_id: X}
    referrer: {}
  },
  mutations: {
    set (state, referrerObject) {
      state.referrer = referrerObject
    },
    empty (state) {
      state.referrer = {}
    }
  }
}
