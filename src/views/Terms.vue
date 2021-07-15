<template>
  <div>
    <b-breadcrumb :items="breadcrumbs"></b-breadcrumb>

    <h1>Terms Administration</h1>

    <div v-if="!$can('read', subject.TERMS)">
      <h2>You do not have sufficient privileges to view this section</h2>
    </div>

    <DynamicTableWrapper
        v-if="$can('read', subject.TERMS)"
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
            <b-button class="add-term-btn" @click="toggleAddTerm" variant="success">
              <b-icon-calendar2-plus></b-icon-calendar2-plus>Add Term
            </b-button>
            </div>
            <b-card class="add-term-card" v-if="showAddTerm">
              <term-details
                  v-on:created:term="termCreated"
                  v-on:error="displayErrors"
              ></term-details>
            </b-card>
          </b-td>
        </template>

        <template v-slot:cell(start_date)="data">
          {{data.item.start_date | moment("dddd, MMMM Do YYYY")}}
        </template>

        <template v-slot:cell(end_date)="data">
          {{data.item.end_date | moment("dddd, MMMM Do YYYY")}}
        </template>

        <template v-slot:cell(actions)="data">
          <div class="actions">
            <b-button @click="data.toggleDetails" size="sm">
              {{ data.detailsShowing ? 'Hide' : ($can('update', subject.TERMS) ? 'Edit' : 'View') }} Details
            </b-button>
            <b-button :to="{ name: 'partsofterm', params: { term_id: data.item.id }}" size="sm">
              Go to Parts of Term
            </b-button>
          </div>
        </template>

        <template v-slot:row-details="data">
          <b-card>
            <term-details
                :id="data.item.id"
                v-on:update:term="updateTerm($event, data.item)"
                v-on:deleted:term="termDeleted"
                v-on:error="displayErrors" v-on:saved:term="displaySuccess('Term updated successfully')"
            ></term-details>
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

import { BreadcrumbManager } from '../mixins/BreadcrumbManager'
import LoadingPlaceholder from '../components/LoadingPlaceholder'
import { DynamicTableMixin } from '../mixins/DynamicTableMixin'
import DynamicTableWrapper from '../components/DynamicTable/DynamicTableWrapper'
import { BIconCalendar2Plus } from 'bootstrap-vue'
import { PermissionSubject } from '../permission-subject'
import { termsService } from '../services/terms.service'
import TermDetails from '../components/TermDetails'
import { EventHandlerMixin } from '../mixins/EventHandlerMixin'

export default {
  name: 'Terms',
  components: { TermDetails, DynamicTableWrapper, LoadingPlaceholder, BIconCalendar2Plus },
  mixins: [BreadcrumbManager, DynamicTableMixin, EventHandlerMixin],
  data: function () {
    return {
      subject: PermissionSubject,
      sortBy: 'name',
      fields: [
        { label: 'Term Name', key: 'name', sortable: true },
        { key: 'start_date', sortable: true },
        { key: 'end_date', sortable: true },
        { key: 'actions', label: 'Actions' }
      ],
      searchOptions: [
        { text: 'Term Name', value: 'name' },
        { text: 'Start Date', value: 'start_date' },
        { text: 'End Date', value: 'end_date' }
      ],
      searchOn: [
        'name',
        'start_date',
        'end_date'
      ],
      showAddTerm: false
    }
  },

  methods: {

    myProvider: async function (ctx) {
      this.updateParams(ctx)

      try {
        const response = await termsService.getTerms(this.params)
        this.totalRows = response.data.count // total to calculate pagination
        return response.data.terms
      } catch (error) {
        this.displayErrors(error)
        return []
      }
    },

    updateTerm: function (e, item) {
      item.name = e.name
      item.start_date = e.start_date
      item.end_date = e.end_date
      this.displaySuccess('Term updated.')
    },

    termDeleted: function () {
      this.displaySuccess('Term deleted.')
      this.refreshTable()
    },

    toggleAddTerm: function () {
      this.showAddTerm = !this.showAddTerm
    },

    termCreated: function () {
      this.displaySuccess('Term created.')
      this.toggleAddTerm()
      this.refreshTable()
    }

  } // methods
}

</script>

<style scoped>
  .actions button {
      margin: 5px;
  }

  .add-term-btn svg {
    margin-right: 10px;
  }

  .add-term-card {
    margin-top: 12px;
  }
</style>
