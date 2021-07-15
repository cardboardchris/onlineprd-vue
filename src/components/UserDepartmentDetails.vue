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
      <b-table
          :items="departmentUsers"
          :fields="[{ key: 'user', label: colHeaderText }, 'action']"
          :responsive="true"
          class="user-department-table"
      >
        <template v-slot:cell(user)="data">
          {{data.item.first_name}} {{data.item.last_name}}<br>
          <a :href="`mailto:${data.item.email}`">{{data.item.email}}</a>
        </template>

        <template v-slot:cell(action)="data">
          <b-button variant="danger" size="sm" @click="confirmDelete(data.item)"><b-icon-person-dash></b-icon-person-dash> Remove User</b-button>
        </template>
      </b-table>
      <b-button variant="success" size="sm" @click="modalUserShow = !modalUserShow"><b-icon-person-plus></b-icon-person-plus>
        Add User</b-button>
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
import { departmentUserRoleService } from '@/services/departmentUserRole.service'

export default {
  name: 'UserDepartmentDetails',
  components: { UserSearch, BIconPersonPlus, BIconPersonDash },
  props: {
    department_id: {
      default: null
    },
    role_id: {
      default: null
    }
  },
  data: function () {
    return {
      departmentUsers: [],
      modalUserShow: false,
      colHeaderText: 'Users',
      wait: false
    }
  },
  mounted: function () {
    this.init()
  },
  methods: {
    init: function () {
      switch (this.role_id) {
        case 3: // approver role
          this.colHeaderText = 'Approvers'
          this.addBtnText = 'Add approver'
          break
        case 4: // scheduler role
          this.colHeaderText = 'Schedulers'
          this.addBtnText = 'Add scheduler'
          break
      }

      try {
        if (this.department_id !== null) {
          this.getDepartmentUsers()
        }
      } catch (error) {
        this.$emit('error', error)
      }
    },
    getDepartmentUsers: async function () {
      const response = await departmentUserRoleService.getDepartmentUserRoles({
        with: 'user',
        department_id: this.department_id,
        role_id: this.role_id
      })

      if (response.data.department_user_roles[0]) {
        this.departmentUsers = response.data.department_user_roles.map(obj => {
          obj.user.department_user_roles_id = obj.id
          return obj.user
        })
      }
    },

    addUser: async function (user) {
      this.$bvModal.hide('add-user-modal')
      try {
        this.toggleWait()
        // if user is not in department users, add user
        if (!this.departmentUsers.some(depUser => depUser.id === user.id)) {
          const response = await this.addUserToDepartment(user)
          user.department_user_roles_id = response.data.department_user_role.id
          this.departmentUsers.push(user)
          this.toggleWait()
          this.$emit('created:department-user-role', response.data.department_user_role)

        // if user is in department users, emit message
        } else {
          this.cancelWait()
          this.$emit('message', 'The selected user has already been added to the department.')
        }
      } catch (error) {
        this.cancelWait()
        this.$emit('error', error)
      }
    },

    addUserToDepartment: function (user) {
      return departmentUserRoleService.createDepartmentUserRole({
        department_id: this.department_id,
        user_id: user.id,
        role_id: this.role_id
      })
    },

    confirmDelete: async function (item) {
      try {
        const answer = await this.$bvModal.msgBoxConfirm(`Please confirm that you want to remove the user "${item.first_name} ${item.last_name}" from this department.`, {
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
          await departmentUserRoleService.deleteDepartmentUserRole(item.department_user_roles_id)
          this.departmentUsers = this.departmentUsers.filter(obj => obj.department_user_roles_id !== item.department_user_roles_id)
          this.$emit('deleted:department-user-role', item)
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
