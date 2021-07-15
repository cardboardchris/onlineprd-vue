<template>
  <div>
    <b-breadcrumb :items="breadcrumbs"></b-breadcrumb>

    <h1>Add User</h1>

    <div v-if="!$can('create', subject.USERS)">
      <h2>You do not have sufficient privileges to view this section.</h2>
    </div>

    <UserDetails
        v-if="$can('create', subject.USERS)"
        v-on:created:user="userCreated"
        v-on:error="displayErrors"
    >
    </UserDetails>

  </div>
</template>

<script>

import { BreadcrumbManager } from '@/mixins/BreadcrumbManager'
import UserDetails from '../components/UserDetails'
import { PermissionSubject } from '@/permission-subject'
import { EventHandlerMixin } from '@/mixins/EventHandlerMixin'

export default {
  name: 'UserAdd',
  props: [ 'id' ],
  data: function () {
    return {
      subject: PermissionSubject,
      user: {}
    }
  },
  components: { UserDetails },
  mixins: [BreadcrumbManager, EventHandlerMixin],
  methods: {
    userCreated: function (user) {
      if (user.id) {
        this.$router.push({ name: 'user', params: { id: user.id } })
      }
    }
  }
}

</script>

<style scoped>

</style>
