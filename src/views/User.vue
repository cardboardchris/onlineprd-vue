<template>
  <div>
    <b-breadcrumb :items="breadcrumbs"></b-breadcrumb>

    <h1>User Details</h1>

    <UserDetails
        v-if="$can('read', subject.USERS)"
        :id="id"
        :user.sync="user"
        v-on:loaded:user="updateBreadcrumbs"
        v-on:update:user="userSaved"
        v-on:error="displayErrors"
    >
    </UserDetails>

  </div>
</template>

<script>

import { BreadcrumbManager } from '../mixins/BreadcrumbManager'
import UserDetails from '../components/UserDetails'
import { PermissionSubject } from '../permission-subject'
import { EventHandlerMixin } from '../mixins/EventHandlerMixin'

export default {
  name: 'User',
  props: [ 'id' ],
  mixins: [BreadcrumbManager, EventHandlerMixin],
  data: function () {
    return {
      subject: PermissionSubject,
      user: {}
    }
  },
  components: { UserDetails },
  methods: {
    updateBreadcrumbs: function (user) {
      this.popBreadcrumb()
      this.pushBreadcrumb({ text: user.first_name + ' ' + user.last_name })
    },

    userSaved: function (user) {
      this.updateBreadcrumbs(user)
      this.displaySuccess()
    }
  }
}

</script>

<style scoped>

</style>
