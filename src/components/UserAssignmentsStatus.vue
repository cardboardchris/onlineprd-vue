<template>
  <div>
    <loading-placeholder v-if="loading"></loading-placeholder>
    <div v-else>
      <b-table
        striped
        :fields="fields"
        :items="items"
      >
        <template v-slot:cell(status)="data">

          <b-badge variant="warning" v-if="!data.item.status.confirmed">
            Unconfirmed
          </b-badge>

          <b-badge variant="success" v-if="data.item.status.verified">
            <b-icon-check></b-icon-check>
            Verified
          </b-badge>
          <b-badge variant="warning" v-if="data.item.status.confirmed && !data.item.status.verified">
            <b-icon-question></b-icon-question>
            Verified
          </b-badge>

          <span style="display: inline-block; width: .5em;"></span>
          <b-badge variant="success" v-if="data.item.status.stipend_verified">
            <b-icon-check></b-icon-check>
            Stipend
          </b-badge>
          <b-badge variant="warning" v-if="data.item.status.verified && !data.item.status.stipend_verified">
            <b-icon-question></b-icon-question>
            Stipend
          </b-badge>

          <span v-if="data.item.status.notified"
                style="display: inline-block; width: .5em;"></span>
          <b-badge variant="success" v-if="data.item.status.notified">
            <b-icon-check></b-icon-check>
            Notified
          </b-badge>

        </template>
      </b-table>
      <b-row align-h="around">
        <b-col cols="auto">
          <b-button v-if="anyReadyAssignments" variant="info" size="sm" @click="letterPreview">Preview appointment letter for {{ employee.first_name }} {{ employee.last_name }}'s verified assignments</b-button>
          <p v-else>No assignments are ready to issue letters or a letter has been sent for all verified assignments.</p>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import { userService } from '../services/user.service'
import LoadingPlaceholder from './LoadingPlaceholder'
import { SelectOptions } from '../mixins/SelectOptionsMixin'
import { EventHandlerMixin } from '../mixins/EventHandlerMixin'
import { emailTemplateService } from '../services/emailTemplate.service'

export default {
  name: 'UserAssignmentsStatus',
  components: { LoadingPlaceholder },
  mixins: [SelectOptions, EventHandlerMixin],
  props: {
    userId: Number,
    formOptions: Object,
    termId: Number
  },
  data () {
    return {
      employee: {},
      userAssignments: [],
      fields: [
        'assignment',
        'hiring_department',
        'status'
      ],
      items: [],
      params: {
        with: 'assignments.offering.course.department,nonCourseAssignments.department'
      },
      messageContent: null,
      logoImagePath: '/static/images/UNCGO_logo.png',
      templates: [],
      loading: true
    }
  },
  computed: {
    currentUser () {
      return this.$store.state.auth.user
    },
    anyReadyAssignments () {
      let ready = false
      _.forEach(this.items, (itemObject) => {
        if (itemObject.status.verified && itemObject.status.stipend_verified && !itemObject.status.notified) {
          ready = true
        }
      })
      return ready
    }
  },
  mounted () {
    this.initialize()
  },
  methods: {
    initialize: async function () {
      try {
        // get the necessary data from server
        const response = await userService.getUserById(this.$props.userId, this.params)
        this.employee = response.data.user
        let userAssignments = [...response.data.user.assignments, ...response.data.user.non_course_assignments]

        // prepare the assignment items for the table
        _.forEach(userAssignments, (assignmentObject) => {
          // only include assignments in the current term
          let termId
          if (assignmentObject.hasOwnProperty('offering')) {
            termId = assignmentObject.offering.course.term_id
          } else {
            termId = assignmentObject.term_id
          }
          if (termId === this.termId) {
            let itemString = this.getTextValueFromOptions(assignmentObject.position_id, this.formOptions.positions)
            if (assignmentObject.offering_id) {
              itemString += ' for Section ' + assignmentObject.offering.section +
                ' of ' +
                this.getTextValueFromOptions(assignmentObject.offering.course.subject_id, this.formOptions.subjects) +
                ' ' + assignmentObject.offering.course.number
            }
            let deptString
            if (!assignmentObject.department) {
              deptString = assignmentObject.offering.course.department.name
            } else {
              deptString = assignmentObject.department.name
            }
            this.items.push({
              assignment: itemString,
              hiring_department: deptString,
              status: {
                confirmed: assignmentObject.confirmed !== null,
                verified: assignmentObject.verified !== null,
                stipend_verified: assignmentObject.stipend_verified !== null,
                notified: assignmentObject.notified !== null
              }
            })
          } // end if term_id matches
        })

        // prepare the letter
        const response2 = await emailTemplateService.getTemplates()
        this.templates = response2.data.email_templates
        this.messageContent = this.templates[3]
        this.loading = false
      } catch (error) {
        this.displayErrors(error)
      }
    },
    letterPreview: function () {
      this.$router.push({
        name: 'letterpreview',
        params: {
          term_id: String(this.$props.termId),
          user_id: String(this.currentUser.id)
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
