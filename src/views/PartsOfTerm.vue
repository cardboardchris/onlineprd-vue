<template>
  <div>
    <h1>Parts of Term Administration for {{this.termName}}</h1>

    <b-breadcrumb :items="breadcrumbs"></b-breadcrumb>

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

        <template v-slot:bottom-row v-if="$can('create', subject.TERMS)">
          <b-td :colspan="fields.length">
            <div class="align-right">
            <b-button class="add-term-btn" @click="toggleAddTerm" variant="success">
              <b-icon-calendar2-plus></b-icon-calendar2-plus>Add Part of Term
            </b-button>
            </div>
            <b-card class="add-term-card" v-if="showAddTerm">
              <PartOfTermDetails
                  v-on:created:partOfTerm="partOfTermCreated"
                  v-on:error="displayErrors"
                  :term_id="term_id"
              ></PartOfTermDetails>
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
          </div>
        </template>

        <template v-slot:row-details="data">
          <b-card>
            <PartOfTermDetails
                :id="data.item.id"
                v-on:update:partOfTerm="updatePartOfTerm($event, data.item)"
                v-on:deleted:partOfTerm="partOfTermDeleted"
                v-on:error="displayErrors"
            ></PartOfTermDetails>
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
import { EventHandlerMixin } from '../mixins/EventHandlerMixin'
import PartOfTermDetails from '../components/PartOfTermDetails'
import { partsOfTermService } from '../services/partsOfTerm.service'

export default {
  name: 'PartsOfTerm',
  components: { PartOfTermDetails, DynamicTableWrapper, LoadingPlaceholder, BIconCalendar2Plus },
  mixins: [BreadcrumbManager, DynamicTableMixin, EventHandlerMixin],
  props: [ 'term_id' ],
  data: function () {
    return {
      termName: null,
      subject: PermissionSubject,
      sortBy: 'name',
      fields: [
        { label: 'Part of Term', key: 'name', sortable: true },
        { key: 'start_date', sortable: true },
        { key: 'end_date', sortable: true },
        { key: 'actions', label: 'Actions' }
      ],
      searchOptions: [
        { text: 'Part of Term', value: 'name' }
      ],
      searchOn: [
        'name'
      ],
      params: {
        term_id: this.term_id
      },
      showAddTerm: false
    }
  },

  mounted: async function () {
    try {
      const response = await termsService.getTerms({ id: this.term_id })
      this.termName = response.data.terms[0].name
      this.popBreadcrumb()
      this.pushBreadcrumb(this.termName)
    } catch (error) {
      this.displayError('The term name did not load.')
    }
  },

  methods: {

    myProvider: async function (ctx) {
      this.updateParams(ctx)

      try {
        const response = await partsOfTermService.getPartsOfTerm(this.params)
        this.totalRows = response.data.count // total to calculate pagination
        return response.data.parts_of_term
      } catch (error) {
        this.displayErrors(error)
        return []
      }
    },

    updatePartOfTerm: function (e, item) {
      item.name = e.name
      item.start_date = e.start_date
      item.end_date = e.end_date
      this.displaySuccess('Part of Term updated.')
    },

    partOfTermDeleted: function () {
      this.displaySuccess('Part of Term deleted')
      this.refreshTable()
    },

    toggleAddTerm: function () {
      this.showAddTerm = !this.showAddTerm
    },

    partOfTermCreated: function () {
      this.displaySuccess('Parts of Term created.')
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
