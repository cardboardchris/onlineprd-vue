<template>
  <div class="text-center">
    <b-button
        v-show="!loggedIn"
        size="lg"
        variant="primary"
        v-on:click="authorize">Login
    </b-button>
    <b-button
        v-show="loggedIn"
        size="lg"
        variant="primary"
        v-on:click="redirect">Go to Dashboard
    </b-button>
  </div>
</template>

<script>
import { AuthService } from '../services/auth-service'
import { AuthMixin } from '../mixins/AuthMixin'

export default {
  name: 'LoginButton',
  mixins: [AuthMixin],
  methods: {
    authorize: function () {
      let authService = new AuthService()
      authService.authorize()
    },
    redirect: function () {
      this.$router.push({ name: 'dashboard-term-select' })
    }
  }
}
</script>
