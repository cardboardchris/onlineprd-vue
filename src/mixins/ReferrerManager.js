import { mapMutations } from 'vuex'

export const ReferrerManager = {
  methods: {
    ...mapMutations('referrer', {
      setReferrer: 'set',
      emptyReferrer: 'empty'
    })
  },
  computed: {
    referrer () {
      return this.$store.state.referrer
    }
  }
}
