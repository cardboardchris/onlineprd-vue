<template>
  <div>
    <b-breadcrumb :items="breadcrumbs"></b-breadcrumb>

    <loading-placeholder v-if="loading"></loading-placeholder>

    <div v-if="failedToLoad">
      <h1>Term not found. Return to the <router-link :to="{ name: 'dashboard-term-select' }">dashboard</router-link> and select a term.</h1>
    </div>

    <b-card v-else-if="loggedIn && currentUser && !loading">

      <h5>Assignments</h5>
      <p>
        <router-link :to="{ name: 'acceptanceform', params: { term_id: String(activeTerm.id), user_id: String(currentUser.id) } }">View/Accept</router-link>
      </p>

      <departments-list-by-user
        :user-id="currentUser.id"
        :term-id="activeTerm.id"
      ></departments-list-by-user>

      <hr>

      <div v-if="$can('read', this.subject.VERIFICATION_TAGS)">
        <h5>Assignment Dashboards</h5>
        <ul>
          <li>
            <router-link :to="{ name: 'departmentlist', params: { term_id: String(activeTerm.id) } }">Registration</router-link> <AlertBadge v-if="$can('update', subject.ASSIGNMENTS)" :count="activeTerm.actionable_items"></AlertBadge>
          </li>
          <li>
            <router-link :to="{ name: 'assignmentsbyuser', params: { term_id: String(activeTerm.id) }  }">Finance</router-link>
          </li>
        </ul>
      </div>
    </b-card>
  </div>
</template>

<script>

import DepartmentsListByUser from '../components/DepartmentsListByUser'
import { AuthMixin } from '../mixins/AuthMixin'
import { PermissionSubject } from '../permission-subject'
import { EventHandlerMixin } from '../mixins/EventHandlerMixin'
import { termsService } from '../services/terms.service'
import LoadingPlaceholder from '../components/LoadingPlaceholder'
import AlertBadge from '../components/AlertBadge'
import { Term } from '../models/term'
import { BreadcrumbManager } from '../mixins/BreadcrumbManager'

export default {
  name: 'HomeDashboard',
  components: { AlertBadge, DepartmentsListByUser, LoadingPlaceholder },
  mixins: [AuthMixin, EventHandlerMixin, BreadcrumbManager],
  props: {
    term_id: String
  },
  data () {
    return {
      subject: PermissionSubject,
      activeTerm: new Term({}),
      loading: true,
      failedToLoad: false
    }
  },
  created () {
    this.initialize()
  },
  methods: {
    /**
     * make API calls to get saved data
     */
    initialize: async function () {
      try {
        // get the active term object
        const response = await termsService.getTerms({
          id: this.$props.term_id,
          actionable_items_count: true
        })

        this.popBreadcrumb()

        if (response.data.terms.length > 0) {
          this.activeTerm = response.data.terms[0]
          this.pushBreadcrumb(
            { text: this.activeTerm.name }
          )
        } else {
          this.failedToLoad = true
          this.pushBreadcrumb(
            { text: 'Term not found' }
          )
        }

        this.loading = false
      } catch (error) {
        this.displayErrors(error)
      }
    }
  }
}

</script>

<style scoped>

</style>
