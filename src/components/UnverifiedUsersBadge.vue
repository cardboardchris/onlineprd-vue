<template>
  <AlertBadge
      :count="numberOfUnverifiedUsers"
      message="users need verification"
  ></AlertBadge>
</template>

<script>

import { userService } from '../services/user.service'
import AlertBadge from './AlertBadge'

export default {
  name: 'UnverifiedUsersBadge',
  components: { AlertBadge },
  data () {
    return {
      numberOfUnverifiedUsers: 0
    }
  },

  mounted: async function () {
    try {
      const response = await userService.getCountOfUnverified()
      this.numberOfUnverifiedUsers = response.data.count
    } catch (error) {
      this.$emit('error', error)
    }
  },

  computed: {
    showBadge: function () {
      return this.numberOfUnverifiedUsers !== 0
    }
  }
}
</script>

<style scoped>

</style>
