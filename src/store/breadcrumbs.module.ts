// https://mauricius.dev/handling-breadcrumbs-with-vuex-in-a-vuejs-single-page-application/

export const breadcrumbs = {
  namespaced: true,
  state: {
    // array of breadcrumb objects, in the form of VueRouter
    // descriptors (see https://router.vuejs.org/api/#to)
    breadcrumbs: []
  },
  mutations: {
    set (state, breadcrumbs) {
      state.breadcrumbs = [...breadcrumbs]
    },
    push (state, breadcrumb) {
      state.breadcrumbs.push(breadcrumb)
    },
    pop (state) {
      state.breadcrumbs.pop()
    },
    replace (state, payload) {
      const index = state.breadcrumbs.findIndex((breadcrumb) => {
        return breadcrumb.text === payload.find
      })

      if (index) {
        state.breadcrumbs.splice(index, 1, payload.replace)
      }
    },
    empty (state) {
      state.breadcrumbs = []
    }
  }
}
