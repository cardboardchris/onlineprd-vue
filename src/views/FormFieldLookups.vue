<template>
  <div>
    <h1>Form Field Lookups Administration <UnverifiedUsersBadge v-on:error="displayErrors"></UnverifiedUsersBadge></h1>

    <b-breadcrumb :items="breadcrumbs"></b-breadcrumb>

    <div v-if="!$can('read', subject.USERS)">
      <h2>You do not have sufficient privileges to view this section</h2>
    </div>

    <DynamicTableWrapper
        v-else
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

        <template v-slot:bottom-row>
          <b-td :colspan="fields.length" class="align-right">
            <b-button :to="{ name: 'add-user' }" variant="success">
              <b-icon-person-plus></b-icon-person-plus> Add User
            </b-button>
          </b-td>
        </template>

        <template v-slot:cell(email)="data">
          <a :href="`mailto:${data.item.email}`">{{data.item.email}}</a>
        </template>

        <template v-slot:cell(eclass)="data">
          {{data.item.eclass.description}}
        </template>

        <template v-slot:cell(verified)="data">
          <span v-if="Number(data.item.verified) === 1"><b-icon-check-circle-fill variant="success"></b-icon-check-circle-fill> Yes</span>
          <span v-else><b-icon-x-circle-fill variant="danger"></b-icon-x-circle-fill> No</span>
        </template>

        <template v-slot:cell(actions)="data">
          <b-button :to="{ name: 'user', params: { id: data.item.id }}" size="sm">
            {{ data.detailsShowing ? 'Hide' : ($can('update', subject.USERS) ? 'Edit' : 'View') }} Details
          </b-button>
        </template>
      </b-table>
    </DynamicTableWrapper>

  </div>
</template>

<script>

import { BreadcrumbManager } from '../mixins/BreadcrumbManager'
import { userService } from '../services/user.service'
import LoadingPlaceholder from '../components/LoadingPlaceholder'
import { DynamicTableMixin } from '../mixins/DynamicTableMixin'
import DynamicTableWrapper from '../components/DynamicTable/DynamicTableWrapper'
import { PermissionSubject } from '../permission-subject'
import { EventHandlerMixin } from '../mixins/EventHandlerMixin'
import { BIconCheckCircleFill, BIconXCircleFill } from 'bootstrap-vue'
import UnverifiedUsersBadge from '../components/UnverifiedUsersBadge'

export default {
  name: 'Users',
  components: { UnverifiedUsersBadge, DynamicTableWrapper, LoadingPlaceholder, BIconCheckCircleFill, BIconXCircleFill },
  mixins: [BreadcrumbManager, DynamicTableMixin, EventHandlerMixin],
  data: function () {
    return {
      subject: PermissionSubject,
      sortBy: 'last_name',
      fields: [
        { key: 'last_name', sortable: true },
        { key: 'first_name', sortable: true },
        'email',
        'spartan_id',
        { key: 'eclass', label: 'eClass' },
        { key: 'verified', sortable: true },
        { key: 'actions', label: 'Actions' }
      ],
      params: {
        with: 'eclass'
      },
      searchOptions: [
        { text: 'Last Name', value: 'last_name' },
        { text: 'First Name', value: 'first_name' },
        { text: 'Email', value: 'email' },
        { text: 'Spartan Id', value: 'spartan_id' },
        { text: 'eClass', value: 'eclass.description' }
      ],
      searchOn: [
        'last_name',
        'first_name',
        'email',
        'spartan_id',
        'eclass.description'
      ]
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
        this.displayErrors(error)
        return []
      }
    }

  } // methods
}

</script>

<style scoped>

</style>
