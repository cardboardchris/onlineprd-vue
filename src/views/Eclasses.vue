<template>
  <div>
    <b-breadcrumb :items="breadcrumbs"></b-breadcrumb>

    <h1>Eclass Administration</h1>

    <div v-if="!$can('read', subject.ECLASSES)">
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
              <b-button class="add-eclass-btn" @click="toggleAddEclass" variant="success">
                <b-icon-plus-circle></b-icon-plus-circle>Add Eclass
              </b-button>
            </div>
            <b-card class="add-eclass-card" v-if="showAddEclass">
              <eclass-details
                  v-on:created:eclass="eclassCreated"
                  v-on:error="displayErrors"
              ></eclass-details>
            </b-card>
          </b-td>
        </template>

        <template v-slot:cell(full_time)="data">
          <span v-if="Number(data.item.full_time) === 1"> Yes</span>
          <span v-else>No</span>
        </template>

        <template v-slot:cell(category)="data">
          {{ data.item.category.replace('_', ' ') }}
        </template>

        <template v-slot:cell(active)="data">
          <span v-if="Number(data.item.active) === 1"><b-icon-check-circle-fill variant="success"></b-icon-check-circle-fill> Active</span>
          <span v-else><b-icon-x-circle-fill variant="danger"></b-icon-x-circle-fill> Inactive</span>
        </template>

        <template v-slot:cell(actions)="data">
          <b-button size="sm" @click="data.toggleDetails">
            {{ data.detailsShowing ? 'Hide' : ($can('update', 'EclassForm') ? 'Edit' : 'View') }} Details
          </b-button>
        </template>

        <template v-slot:row-details="data">
          <b-card :id="data.item.id">
            <eclass-details
                :id="data.item.id"
                v-on:update:eclass="updateEclass($event, data.item)"
                v-on:deleted:eclass="eclassDeleted"
                v-on:error="displayErrors" v-on:saved:eclass="displaySuccess('Eclass updated successfully')"
            ></eclass-details>
            <b-button size="sm" @click="data.toggleDetails">Hide Details</b-button>
          </b-card>
        </template>
      </b-table>
    </DynamicTableWrapper>
  </div>
</template>

<script>

import { BreadcrumbManager } from '../mixins/BreadcrumbManager'
import LoadingPlaceholder from '../components/LoadingPlaceholder'
import { DynamicTableMixin } from '../mixins/DynamicTableMixin'
import DynamicTableWrapper from '../components/DynamicTable/DynamicTableWrapper'
import { BIconPlusCircle, BIconCheckCircleFill, BIconXCircleFill } from 'bootstrap-vue'
import { PermissionSubject } from '../permission-subject'
import { eClassesService } from '../services/eclasses.service'
import { EventHandlerMixin } from '../mixins/EventHandlerMixin'
import EclassDetails from '../components/EclassDetails'

export default {
  name: 'Eclasses',
  components: { EclassDetails, DynamicTableWrapper, LoadingPlaceholder, BIconPlusCircle, BIconCheckCircleFill, BIconXCircleFill },
  mixins: [BreadcrumbManager, DynamicTableMixin, EventHandlerMixin],
  data: function () {
    return {
      subject: PermissionSubject,
      sortBy: 'description',
      fields: [
        { key: 'abbreviation', sortable: true },
        { key: 'description', sortable: true },
        { key: 'full_time', sortable: true },
        { key: 'category', sortable: true },
        'student',
        'active',
        { key: 'actions', label: 'Actions' }
      ],
      searchOptions: [
        { text: 'Abbreviation', value: 'abbreviation' },
        { text: 'Description', value: 'description' }
      ],
      searchOn: [
        'abbreviation',
        'description'
      ],
      showAddEclass: false
    }
  },

  methods: {

    myProvider: async function (ctx) {
      this.updateParams(ctx)

      try {
        const response = await eClassesService.getEClasses(this.params)
        this.totalRows = response.data.count // total to calculate pagination
        return response.data.eclasses
      } catch (error) {
        this.displayErrors(error)
        return []
      }
    },

    updateEclass: function (e, item) {
      item.abbreviation = e.abbreviation
      item.description = e.description
      item.category = e.category
      item.full_time = e.full_time
      item.active = e.active
      item.student = e.student
      this.displaySuccess('Eclass updated.')
    },

    eclassDeleted: function () {
      this.displaySuccess('Eclass deleted.')
      this.refreshTable()
    },

    toggleAddEclass: function () {
      this.showAddEclass = !this.showAddEclass
    },

    eclassCreated: function () {
      this.displaySuccess('Eclass created.')
      this.toggleAddEclass()
      this.refreshTable()
    }

  } // methods
}

</script>

<style scoped>
  .actions button {
    margin: 5px;
  }

  .add-eclass-btn svg {
    margin-right: 10px;
  }

  .add-eclass-card {
    margin-top: 12px;
  }
</style>
