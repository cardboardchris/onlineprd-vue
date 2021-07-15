<template>
  <div>
    <b-breadcrumb :items="breadcrumbs"></b-breadcrumb>
    <b-card v-if="loggedIn && currentUser">

      <loading-placeholder v-if="loading"></loading-placeholder>

      <div v-else>
        <h3>Select Term</h3>
        <b-row v-for="term in terms" :key="term.id">
          <b-col>
            <router-link
              :to="{ name: 'dashboard', params: { term_id: String(term.id) } }">
              {{ term.name }}</router-link> <AlertBadge v-if="$can('update', subject.ASSIGNMENTS)" :count="term.actionable_items"></AlertBadge>
          </b-col>
        </b-row>
      </div>

      <hr>

      <h5>Administration</h5>
      <ul>
        <li v-if="$can('read', subject.USERS)">
          <router-link :to="{ name: 'users' }">Users</router-link> <UnverifiedUsersBadge v-on:error="displayErrors"></UnverifiedUsersBadge>
        </li>
        <li v-if="$can('read', subject.ECLASSES)">
          <router-link :to="{ name: 'eclassesform' }">Eclasses</router-link>
        </li>
        <li v-if="$can('read', subject.DEPARTMENTS)">
          <router-link :to="{ name: 'departments' }">Departments</router-link>
        </li>
        <li v-if="$can('read', subject.TERMS)">
          <router-link :to="{ name: 'termlist' }">Terms & Parts of Term</router-link>
        </li>
        <li v-if="$can('read', subject.ACCEPTANCE_LETTERS)">
          <router-link :to="{ name: 'emailtemplates' }">Acceptance Letter Templates</router-link>
        </li>
      </ul>
    </b-card>
  </div>
</template>

<script>

import { AuthMixin } from '../mixins/AuthMixin'
import { PermissionSubject } from '../permission-subject'
import UnverifiedUsersBadge from '../components/UnverifiedUsersBadge'
import { EventHandlerMixin } from '../mixins/EventHandlerMixin'
import { termsService } from '../services/terms.service'
import LoadingPlaceholder from '../components/LoadingPlaceholder'
import AlertBadge from '../components/AlertBadge'
import { BreadcrumbManager } from '../mixins/BreadcrumbManager'

export default {
  name: 'DashboardTermSelect',
  components: { AlertBadge, UnverifiedUsersBadge, LoadingPlaceholder },
  mixins: [AuthMixin, EventHandlerMixin, BreadcrumbManager],
  data () {
    return {
      subject: PermissionSubject,
      terms: [],
      loading: true
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
        // get all terms
        const response = await termsService.getTerms({
          actionable_items_count: true
        })

        this.terms = response.data.terms

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
