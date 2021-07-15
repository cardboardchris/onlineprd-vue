<template>
    <div class="login text-center">
        <h1>{{message}}</h1>
    </div>
</template>

<script>
import { AuthMixin } from '../mixins/AuthMixin'

export default {
  name: 'login',
  mixins: [AuthMixin],
  components: {},
  data: function () {
    return {
      message: 'Logging in... You will be redirected momentarily.'
    }
  },
  mounted: function () {
    if (this.loggedIn) {
      this.$router.push({ name: 'dashboard-term-select' })
    } else {
      this.$store.dispatch('auth/login').then(() => {
        this.$router.push({ name: 'dashboard-term-select' })
      }).catch(() => {
        this.message = 'A login error has occurred.  Please contact the system administrator'
      })
    }
  }
}
</script>
