<template>
  <div>
      <b-breadcrumb :items="breadcrumbs"></b-breadcrumb>

      <h1>Courses & Assignments by Department <AlertBadge v-if="$can('update', subject.ASSIGNMENTS)" :count="activeTerm.actionable_items"></AlertBadge></h1>

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
          :items="items"
          :fields="fields"
          :current-page="currentPage"
          :per-page="perPage"
          :responsive="true"
          :bordered="true"
          :hover="true"
          head-variant="light"
          :no-local-sorting="false"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :filter="search"
          :show-empty="true"
          :busy="isBusy"
        >
          <template v-slot:table-busy>
            <LoadingPlaceholder></LoadingPlaceholder>
          </template>

          <template v-slot:cell(actions)="data">
            <b-button
                size="sm"
                :to="{ name: 'assignmentsbydepartment', params: { term_id: term_id, department_id: String(data.item.id) } }"
            >View assignments
            </b-button>
          </template>

          <template v-slot:cell(actionable_items)="data">
            <AlertBadge :count="data.item.actionable_items"></AlertBadge>
          </template>

        </b-table>
      </DynamicTableWrapper>
    </div>
  </div>
</template>

<script>

import { BreadcrumbManager } from '@/mixins/BreadcrumbManager'
import { ReferrerManager } from '@/mixins/ReferrerManager'
import LoadingPlaceholder from '../components/LoadingPlaceholder'
import { DynamicTableMixin } from '@/mixins/DynamicTableMixin'
import DynamicTableWrapper from '../components/DynamicTable/DynamicTableWrapper'
import { PermissionSubject } from '@/permission-subject'
import { departmentService } from '@/services/department.service'
import { EventHandlerMixin } from '@/mixins/EventHandlerMixin'
import { termsService } from '@/services/terms.service'
import AlertBadge from '../components/AlertBadge'
import { Term } from '@/models/term'

export default {
  name: 'DepartmentList',
  components: { AlertBadge, DynamicTableWrapper, LoadingPlaceholder },
  mixins: [BreadcrumbManager, DynamicTableMixin, EventHandlerMixin, ReferrerManager],
  props: {
    term_id: String
  },
  data: function () {
    return {
      subject: PermissionSubject,
      sortBy: 'actionable_items',
      sortDesc: true,
      activeTerm: new Term({}),
      fields: [
        { key: 'name', label: 'Department', sortable: true },
        { key: 'actionable_items', label: 'Actionable Items', sortable: true },
        'Actions'
      ],
      searchOptions: [
        { text: 'Name', value: 'name' }
      ],
      searchOn: [
        'name'
      ],
      items: [],
      isBusy: false
    }
  },
  created () {
    this.initialize()
  },
  methods: {

    initialize: async function () {
      this.emptyReferrer()
      try {
        // save the current department in local storage
        this.toggleBusy()

        // get the active term
        const response = await termsService.getTerms({
          id: this.$props.term_id,
          actionable_items_count: true
        })

        this.activeTerm = response.data.terms[0]

        this.replaceBreadcrumb({
          find: 'Term loading...',
          replace: { text: this.activeTerm.name, to: { name: 'dashboard' }, params: { term_id: this.$props.term_id } }
        })

        await this.loadTerms()

        this.toggleBusy()
      } catch (error) {
        this.toggleBusy()
        this.displayErrors(error)
      }
    },

    loadTerms: async function () {
      this.params.actionable_items_by_term_id = this.$props.term_id
      this.params.sort_by = 'name'
      this.params.sort_direction = 'asc'

      const response = await departmentService.getDepartments(this.params)
      this.totalRows = response.data.count
      this.items = response.data.departments
    },

    refreshTable: async function () {
      try {
        this.toggleBusy()
        await this.loadTerms()
        this.toggleBusy()
      } catch (error) {
        this.toggleBusy()
        this.displayErrors(error)
      }
    },

    toggleBusy: function () {
      this.isBusy = !this.isBusy
    }

  } // methods
}

</script>

<style scoped>

</style>
