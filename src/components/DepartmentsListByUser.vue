<template>
  <div>
    <loading-placeholder v-if="loading"></loading-placeholder>

    <!-- scheduler links -->
    <div v-if="userRoles.hasOwnProperty('Scheduler')">
      <h5>Schedule Courses for Department</h5>

      <ul>
        <li v-for="department in userRoles['Scheduler']" :key="department.id">
          <router-link :to="{
            name: 'courselist',
            params: { term_id: String(termId), department_id: String(department.id) }
          }">
            {{ department.name }}
          </router-link>
        </li>
      </ul>
    </div>

    <!-- approver links -->
    <div v-if="userRoles.hasOwnProperty('Approver')">
      <h5>Approve Assignments for Department</h5>

      <ul>
        <li v-for="department in userRoles['Approver']" :key="department.id">
          <router-link :to="{
            name: 'courselist',
            params: { term_id: String(termId), department_id: String(department.id) }
          }">
            {{ department.name }}
          </router-link>
        </li>
      </ul>
    </div>

  </div>
</template>

<script>

import { departmentUserRoleService } from '../services/departmentUserRole.service'
import { EventHandlerMixin } from '../mixins/EventHandlerMixin'
import LoadingPlaceholder from './LoadingPlaceholder'

export default {
  name: 'DepartmentsListByUser',
  components: { LoadingPlaceholder },
  mixins: [EventHandlerMixin],
  props: {
    termId: Number,
    userId: Number
  },
  data () {
    return {
      userRoles: {},
      params: {
        user_id: this.$props.userId,
        with: 'role,department'
      },
      loading: true
    }
  },
  created () {
    this.initialize()
  },
  methods: {
    initialize: async function () {
      try {
        // get all roles for all departments for the given user
        const response = await departmentUserRoleService.getDepartmentUserRoles(this.params)
        let userDepartmentRoles = response.data.department_user_roles

        // collect roles, get department(s) for each role
        _.forEach(userDepartmentRoles, (userDepartmentRoleObject) => {
          if (!this.userRoles.hasOwnProperty(userDepartmentRoleObject.role.name)) {
            this.userRoles[userDepartmentRoleObject.role.name] = []
            this.userRoles[userDepartmentRoleObject.role.name].push(userDepartmentRoleObject.department)
          } else {
            this.userRoles[userDepartmentRoleObject.role.name].push(userDepartmentRoleObject.department)
          }
        })
        // console.log(this.userRoles)
        this.loading = false
      } catch (error) {
        this.displayErrors(error)
        console.log(error)
      }
    }
  }
}

</script>

<style scoped>

</style>
