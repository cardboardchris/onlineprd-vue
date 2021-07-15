<template>
  <div>
    <b-navbar toggleable="lg" type="light" class="shadow-sm" fixed="top">
      <b-container>
        <b-navbar-brand href="/dashboard">UNCG Online Forms</b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>

          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto" v-if="loggedIn && currentUser">
            <img class="avatar" v-bind:src="currentUser.avatar" alt="">
            <b-nav-item-dropdown right>
              <template slot="button-content">{{currentUser.firstName}} {{currentUser.lastName}}</template>
              <b-dropdown-item :to="{ name: 'employeeform', params: {user_id: String(currentUser.id) } }">My Profile</b-dropdown-item>
              <b-dropdown-item href="#" v-on:click="logout">Log Out</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-container>
    </b-navbar>
  </div>
</template>

<script>

import { AuthMixin } from '@/mixins/AuthMixin'

export default {
  name: 'Navbar',
  mixins: [AuthMixin],
  methods: {
    logout: function () {
      this.$store.dispatch('auth/logout').then(() => {
        this.$router.push({ name: 'home' })
      }).catch(reason => {
        alert('You were unable to end your session. Try again later or contact your system administrator if this issue continues. \n\n' + reason)
      })
    }
  }
}
</script>

<style scoped>

</style>
