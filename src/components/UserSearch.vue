<template>
  <div>
    <DynamicTableWrapper
        :search.sync="search"
        :searchOn.sync="searchOn"
        :searchOptions="searchOptions"
        :currentPage.sync="currentPage"
        :perPage.sync="perPage"
        :pageOptions="pageOptions"
        :totalRows="totalRows"
        v-on:update:searchOn="searchOnOptionsChange"
        v-on:refresh:table="refreshTable"
    >
      <b-table
          id="results-table"
          ref="table"
          :items="myProvider"
          :fields="fields"
          :current-page="currentPage"
          :per-page="perPage"
          :responsive="true"
          :bordered="true"
          :hover="true"
          head-variant="light"
          :no-local-sorting="true"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :filter="search"
          :show-empty="true"
      >
        <template v-slot:table-busy><LoadingPlaceholder></LoadingPlaceholder></template>

        <template v-slot:cell(email)="data">
          <a :href="`mailto:${data.item.email}`">{{data.item.email}}</a>
        </template>

        <template v-slot:cell(actions)="data">
          <b-button size="sm" @click="selectUser(data.item)">
            Select User
          </b-button>
        </template>

        <template v-slot:bottom-row>
          <b-td :colspan="fields.length">
            <div class="align-right">
              <b-button variant="success" @click="showAddUser =! showAddUser">
                <b-icon-person-plus></b-icon-person-plus> Add User
              </b-button>
            </div>
            <b-card class="add-user-card" title="New User" v-if="showAddUser">
              <user-details
                  v-on:created:user="userCreated"
                  v-on:error="displayErrors"
              ></user-details>
            </b-card>
          </b-td>
        </template>
      </b-table>
    </DynamicTableWrapper>

  </div>
</template>

<script>

import { userService } from '@/services/user.service'
import LoadingPlaceholder from '../components/LoadingPlaceholder'
import { DynamicTableMixin } from '@/mixins/DynamicTableMixin'
import DynamicTableWrapper from '../components/DynamicTable/DynamicTableWrapper'
import { BIconPersonPlus } from 'bootstrap-vue'
import UserDetails from '@/components/UserDetails'
import { EventHandlerMixin } from '@/mixins/EventHandlerMixin'

export default {
  name: 'UserSearch',
  components: { UserDetails, DynamicTableWrapper, LoadingPlaceholder, BIconPersonPlus },
  mixins: [DynamicTableMixin, EventHandlerMixin],
  data: function () {
    return {
      sortBy: 'last_name',
      fields: [
        { key: 'last_name', sortable: true },
        { key: 'first_name', sortable: true },
        'email',
        'spartan_id',
        { key: 'actions', label: 'Action' }
      ],
      searchOptions: [
        { text: 'Last Name', value: 'last_name' },
        { text: 'First Name', value: 'first_name' },
        { text: 'Email', value: 'email' },
        { text: 'Spartan Id', value: 'spartan_id' }
      ],
      searchOn: [
        'last_name',
        'first_name',
        'email',
        'spartan_id'
      ],
      showAddUser: false
    }
  },

  methods: {

    myProvider: async function (ctx) {
      this.updateParams(ctx)

      try {
        const response = await userService.getUsers(this.params)
        this.totalRows = response.data.count // total to calculate pagination
        return response.data.users
      } catch (error) {
        this.$emit('error', error)
        return []
      }
    },

    selectUser: function (user) {
      this.$emit('user-selected', user)
    },

    userCreated: function (user) {
      this.showAddUser = false
      this.refreshTable()
      this.displaySuccess('User (' + user.first_name + ' ' + user.last_name + ') created successfully.  Search table to select created user.')
    }

  } // methods
}

</script>

<style scoped>
.add-user-card {
  margin-top: 12px;
}
</style>
