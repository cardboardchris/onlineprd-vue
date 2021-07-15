<template>
  <div>
    <b-breadcrumb :items="breadcrumbs"></b-breadcrumb>

    <h1>Departments Administration</h1>

    <div v-if="!$can('read', subject.DEPARTMENTS)">
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
          <b-td :colspan="fields.length">
            <div class="align-right">
              <b-button class="add-department-btn" @click="toggleAddDepartment" variant="success">
                <b-icon-house-door></b-icon-house-door>Add Department
              </b-button>
            </div>
            <b-card class="add-department-card" v-if="showAddDepartment">
              <DepartmentDetails
                  v-on:created:department="departmentCreated"
                  v-on:created:user="userCreated"
                  v-on:error="displayErrors"
              ></DepartmentDetails>
            </b-card>
          </b-td>
        </template>

        <template v-slot:cell(contact_user)="data">
          <div v-if="data.item.contact_user">
          {{data.item.contact_user.first_name}} {{data.item.contact_user.last_name}}<br>
          <a :href="`mailto:${data.item.contact_user.email}`">{{data.item.contact_user.email}}</a>
          </div>
        </template>

        <template v-slot:cell(actions)="data">
          <div class="actions">
            <b-button @click="data.toggleDetails" size="sm">
              {{ data.detailsShowing ? 'Hide' : ($can('update', subject.DEPARTMENTS) ? 'Edit' : 'View') }} Details
            </b-button>
          </div>
        </template>

        <template v-slot:row-details="data">
          <b-card>
            <DepartmentDetails
                :id="data.item.id"
                v-on:update:department="updateDepartment($event, data.item)"
                v-on:error="displayErrors"
                v-on:saved:department="displaySuccess('Department updated successfully')"
            ></DepartmentDetails>
            <hr>
            <b-button @click="data.toggleDetails" size="sm">
              Hide Details
            </b-button>
          </b-card>
        </template>
      </b-table>
    </DynamicTableWrapper>
  </div>
</template>

<script>

import { BreadcrumbManager } from '@/mixins/BreadcrumbManager'
import LoadingPlaceholder from '@/components/LoadingPlaceholder'
import { DynamicTableMixin } from '@/mixins/DynamicTableMixin'
import DynamicTableWrapper from '../components/DynamicTable/DynamicTableWrapper'
import { BIconHouseDoor } from 'bootstrap-vue'
import { PermissionSubject } from '@/permission-subject'
import { departmentService } from '@/services/department.service'
import { EventHandlerMixin } from '@/mixins/EventHandlerMixin'
import DepartmentDetails from '../components/DepartmentDetails'

export default {
  name: 'Departments',
  components: { DepartmentDetails, DynamicTableWrapper, LoadingPlaceholder, BIconHouseDoor },
  mixins: [BreadcrumbManager, DynamicTableMixin, EventHandlerMixin],
  data: function () {
    return {
      subject: PermissionSubject,
      sortBy: 'name',
      fields: [
        { key: 'org_number', sortable: true },
        { key: 'name', sortable: true },
        { key: 'abbreviation', sortable: true },
        'chair',
        { key: 'contact_user', label: 'Contact' },
        { key: 'actions', label: 'Actions' }
      ],
      searchOptions: [
        { text: 'Org Number', value: 'org_number' },
        { text: 'Name', value: 'name' },
        { text: 'Abbreviation', value: 'abbreviation' }
      ],
      searchOn: [
        'org_number',
        'abbreviation',
        'name'
      ],
      params: {
        with: 'contactUser'
      },
      showAddDepartment: false
    }
  },

  methods: {

    myProvider: async function (ctx) {
      this.updateParams(ctx)

      try {
        const response = await departmentService.getDepartments(this.params)
        this.totalRows = response.data.count // total to calculate pagination
        return response.data.departments
      } catch (error) {
        this.displayErrors(error)
        return []
      }
    },

    updateDepartment: function (e, item) {
      item.name = e.name
      item.org_number = e.org_number
      item.abbreviation = e.abbreviation
      item.chair = e.chair

      if (e.contact_user_id !== null) {
        item.contact_user = {}
        item.contact_user.first_name = e.contact_user.first_name
        item.contact_user.last_name = e.contact_user.last_name
        item.contact_user.email = e.contact_user.email
      } else {
        item.contact_user = {}
        item.contact_user.first_name = null
        item.contact_user.last_name = null
        item.contact_user.email = null
      }
      this.displaySuccess('Department updated.')
    },

    toggleAddDepartment: function () {
      this.showAddDepartment = !this.showAddDepartment
    },

    departmentCreated: function () {
      this.displaySuccess('Department created successfully.')
      this.toggleAddDepartment()
      this.refreshTable()
    },

    displayErrors: function (error) {
      console.log('got here')
      console.log(error)
    }

  } // methods
}

</script>

<style scoped>
  .actions button {
    margin: 5px;
  }

  .add-department-btn svg {
    margin-right: 10px;
  }

  .add-department-card {
    margin-top: 12px;
  }
</style>
