import { mapMutations } from 'vuex'

export const BreadcrumbManager = {
  methods: {
    ...mapMutations('breadcrumbs', {
      setBreadcrumbs: 'set',
      pushBreadcrumb: 'push',
      popBreadcrumb: 'pop',
      replaceBreadcrumb: 'replace',
      emptyBreadcrumbs: 'empty'
    })
  },
  computed: {
    breadcrumbs () {
      return this.$store.state.breadcrumbs.breadcrumbs
    }
  }
}
