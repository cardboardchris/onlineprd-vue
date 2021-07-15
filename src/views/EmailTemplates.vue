<template>
  <div>
    <b-breadcrumb :items="breadcrumbs"></b-breadcrumb>

    <h1>Email Templates Administration</h1>

    <div v-if="!$can('read', subject.ACCEPTANCE_LETTERS)">
      <h2>You do not have sufficient privileges to view this section</h2>
    </div>

    <DynamicTableWrapper
      v-if="$can('read', subject.ACCEPTANCE_LETTERS)"
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
        <template v-slot:table-busy>
          <LoadingPlaceholder></LoadingPlaceholder>
        </template>

        <template v-slot:cell(body)="data">
          <div :class="'template-content ' + data.item.name.replaceAll(' ','-') + '-content'" v-html="data.item.body"></div>
        </template>

        <template v-slot:cell(actions)="data">
          <div class="actions">
            <b-button @click="data.toggleDetails" size="sm">
              {{ data.detailsShowing ? 'Done' : ($can('update', subject.ACCEPTANCE_LETTERS) ? 'Edit' : 'View') }}
            </b-button>
          </div>
        </template>

        <template v-slot:row-details="data">
          <b-card>
            <email-template-details
              :template="{
                id: data.item.id,
                name: data.item.name,
                body: data.item.body
              }"
              @error="displayErrors"
              @deleted="[displaySuccess('Template deleted'), data.toggleDetails(), refreshTable()]"
              @saved="displaySuccess('Template updated successfully')"
              @done="[data.toggleDetails(), refreshTable()]"
            ></email-template-details>
          </b-card>
        </template>

        <template v-slot:bottom-row>
          <b-td :colspan="fields.length">
            <div class="align-right">
              <b-button v-if="$can('create', subject.ACCEPTANCE_LETTERS)" class="add-term-btn" @click="showAddTemplate = true" variant="success">
                <b-icon-card-text></b-icon-card-text>
                Add Template
              </b-button>
            </div>
            <b-card v-if="showAddTemplate">
              <email-template-details
                :template="{
                  id: null,
                  name: null,
                  body: null
                }"
                @error="displayErrors"
                @deleted="[displaySuccess('Template deleted'), showAddTemplate = false, refreshTable()]"
                @saved="displaySuccess('Template updated successfully')"
                @done="[showAddTemplate = false, refreshTable()]"
              ></email-template-details>
            </b-card>
          </b-td>
        </template>
      </b-table>
    </DynamicTableWrapper>
  </div>
</template>

<script>
import { BreadcrumbManager } from '../mixins/BreadcrumbManager'
import { EventHandlerMixin } from '../mixins/EventHandlerMixin'
import { emailTemplateService } from '../services/emailTemplate.service'
import LoadingPlaceholder from '../components/LoadingPlaceholder'
import { PermissionSubject } from '../permission-subject'
import { DynamicTableMixin } from '../mixins/DynamicTableMixin'
import DynamicTableWrapper from '../components/DynamicTable/DynamicTableWrapper'
import EmailTemplateDetails from '../components/EmailTemplateDetails'
import { BIconCardText } from 'bootstrap-vue'

export default {
  name: 'EmailTemplates',
  components: { LoadingPlaceholder, DynamicTableWrapper, EmailTemplateDetails, BIconCardText },
  mixins: [BreadcrumbManager, EventHandlerMixin, DynamicTableMixin, EventHandlerMixin],
  data: function () {
    return {
      subject: PermissionSubject,
      loading: true,
      fields: [
        { key: 'name', sortable: true },
        { key: 'body', label: 'Content' },
        { key: 'actions', label: 'Actions' }
      ],
      searchOptions: [
        { text: 'Name', value: 'name' },
        { text: 'Content', value: 'body' }
      ],
      searchOn: [
        'name',
        'body'
      ],
      sortBy: 'name',
      templates: [],
      showAddTemplate: false
    }
  },
  created () {
    this.initialize()
  },
  methods: {
    initialize: async function () {
      try {
        const response = await emailTemplateService.getTemplates()
        this.templates = response.data.email_templates
      } catch (error) {
        this.displayErrors(error)
        return []
      }
    },

    myProvider: async function (ctx) {
      this.updateParams(ctx)

      try {
        const response = await emailTemplateService.getTemplates()
        this.totalRows = response.data.count // total to calculate pagination
        return response.data.email_templates
      } catch (error) {
        this.displayErrors(error)
        return []
      }
    }
  }
}
</script>

<style scoped>

</style>
