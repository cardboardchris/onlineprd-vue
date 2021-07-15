<template>
  <div>
    <b-overlay
        :show="wait"
        :rounded="true"
        opacity="0.6"
        :spinner-small="true"
        spinner-variant="primary"
        class="d-inline-block"
    >
      <b-button v-if="user_id" variant="danger" size="sm" @click="confirmDelete()"><b-icon-person-dash></b-icon-person-dash>
        {{ remove_button_text }}</b-button> <b-button variant="success" size="sm" @click="modalUserShow = !modalUserShow"><b-icon-person-plus></b-icon-person-plus>
        {{ add_button_text }}</b-button>
    </b-overlay>

    <b-modal
          id="add-user-modal"
          size="xl"
          v-model="modalUserShow"
          title="Add Department Scheduler"
          :ok-only="true"
          ok-title="Close"
      >
      <user-search v-on:user-selected="addUser"></user-search>
    </b-modal>
  </div>
</template>

<script>

import { BIconPersonPlus, BIconPersonDash } from 'bootstrap-vue'
import UserSearch from './UserSearch'

export default {
  name: 'UserSelectButton',
  components: { UserSearch, BIconPersonPlus, BIconPersonDash },
  props: {
    user_id: {
      default: null
    },
    removal_confirm_message: {
      default: 'Please confirm that you want to remove the user.'
    },
    add_button_text: {
      default: 'Add User'
    },
    remove_button_text: {
      default: 'Remove User'
    }
  },
  data: function () {
    return {
      modalUserShow: false,
      colHeaderText: 'Users',
      wait: false
    }
  },
  methods: {
    addUser: async function (user) {
      this.$bvModal.hide('add-user-modal')
      if (user.id !== this.user_id) {
        this.$emit('update:user', user)
      }
    },

    confirmDelete: async function () {
      try {
        const answer = await this.$bvModal.msgBoxConfirm(this.removal_confirm_message, {
          title: 'Please Confirm',
          size: 'sm',
          buttonSize: 'sm',
          okVariant: 'danger',
          okTitle: 'YES',
          cancelTitle: 'NO',
          footerClass: 'p-2',
          hideHeaderClose: false,
          centered: true
        })

        if (answer === true) {
          this.toggleWait()
          this.$emit('deleted:user')
          this.toggleWait()
        }
      } catch (error) {
        this.cancelWait()
        this.$emit('error', error)
      }
    },

    toggleWait: function () {
      this.wait = !this.wait
    },

    cancelWait: function () {
      this.wait = false
    }
  }
}
</script>

<style scoped>

</style>
