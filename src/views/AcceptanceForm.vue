<template>
  <div>
    <b-breadcrumb :items="breadcrumbs"></b-breadcrumb>

    <LoadingPlaceholder v-if="loading"></LoadingPlaceholder>

    <div v-else>

      <h2>Assignments for {{ currentUser.first_name }} {{ currentUser.last_name }}</h2>

      <b-row v-if="oldAssignments">
        <b-col>
          <p>You have accepted the following assignments.</p>
        </b-col>
      </b-row>

      <b-table v-if="oldAssignments"
               ref="acceptedTable"
               :items="acceptedAssignments"
               :fields="fields"
               :responsive="true"
               :bordered="true"
               head-variant="light"
               :no-local-sorting="true"
               :show-empty="true"
      >
        <template v-slot:table-busy>
          <LoadingPlaceholder></LoadingPlaceholder>
        </template>

        <template v-slot:cell(course)="data">
          <span v-if="data.item.offering">{{ getTextFromOptionValue('subject', data.item.offering.course.subject_id) }} {{data.item.offering.course.number}}</span>
        </template>

        <template v-slot:cell(section)="data">
          <span v-if="data.item.offering">{{ data.item.offering.section }}</span>
        </template>

        <template v-slot:cell(startDate)="data">
          <span v-if="data.item.offering">{{ partOfTermDate(data.item.offering.part_of_term_id, 'start') }}</span>
          <span v-else>{{ data.item.start_date }}</span>
        </template>

        <template v-slot:cell(endDate)="data">
          <span v-if="data.item.offering">{{ partOfTermDate(data.item.offering.part_of_term_id, 'end') }}</span>
          <span v-else>{{ data.item.end_date }}</span>
        </template>

        <template v-slot:cell(campus)="data">
          <span v-if="data.item.offering">{{ getTextFromOptionValue('campus', data.item.offering.campus_id) }}</span>
          <span v-else>{{ getTextFromOptionValue('campus', data.item.campus_id) }}</span>
        </template>

        <template v-slot:cell(position)="data">
          {{ getTextFromOptionValue('position', data.item.position_id) }}
        </template>

        <template v-slot:cell(stipend)="data">
          ${{ data.item.stipend }}
        </template>

        <template v-slot:cell(accept_assignment)="data">
          <span v-if="data.item.accept_assignment">Accepted</span>
          <span v-else>Declined</span>
        </template>

        <template v-slot:cell(accept_pro-rate)="data">
          <span v-if="data.item.offering && data.item.prorate_accepted">Accepted</span>
          <span v-if="data.item.offering && !data.item.prorate_accepted">Declined</span>
        </template>

        <template v-slot:cell(minimum_enrollment)="data">
          {{ data.item.minimum_enrollment }}
        </template>

        <template v-slot:row-details="data">
          You <span v-if="data.item.accept_assignment">accepted</span><span v-else>declined</span> this assignment on {{
          data.item.accepted }}
        </template>
      </b-table>

      <div v-if="newAssignments">
        <b-row>
          <b-col v-if="anyProrated">
            <h4>Summer Session Appointment and Pro-Rate Acceptance</h4>
            <p>
              To be paid a full stipend, minimum enrollment is 15 students for undergraduate courses and 10 for graduate
              courses. Undergraduate courses with fewer than nine students enrolled or graduate courses with fewer than
              five stu­dents will be cancelled with no further obligation to you. If a course has fewer students than
              for
              a full stipend, you may elect a pro-rate option for that course. You must accept or decline the pro-rate
              option at this time.
            </p>
            <p>
              In the table below, choose whether you accept the assignment for each course, and whether you will accept
              pro-rated pay if fewer than 15 students (for undergraduate courses) or fewer than 10 students (for
              graduate
              courses) enroll. Then enter the minimum number of students you are willing to teach in that course. The
              minimum pro-rated salary for the number of students you select will be reflected in the Minimum stipend
              column. Pro-rated salary for a course cannot exceed the original stipend amount stated in your appointment
              letter.
            </p>
          </b-col>
          <b-col v-else>
            <h4>Summer Session Appointment Acceptance</h4>
            <p>
              In the table below, choose whether you accept each assignment.
            </p>
          </b-col>
        </b-row>

        <validation-observer ref="form" v-slot="{ handleSubmit }">
          <b-form @submit.prevent="handleSubmit(saveAcceptance)">
            <b-table
              id="results-table"
              ref="table"
              :items="assignmentsToAccept"
              :fields="fields"
              :responsive="true"
              :bordered="true"
              head-variant="light"
              :no-local-sorting="true"
              :show-empty="true"
            >
              <template v-slot:table-busy>
                <LoadingPlaceholder></LoadingPlaceholder>
              </template>

              <template v-slot:cell(course)="data">
                <span v-if="data.item.offering">{{ getTextFromOptionValue('subject', data.item.offering.course.subject_id) }} {{data.item.offering.course.number}}</span>
              </template>

              <template v-slot:cell(section)="data">
                <span v-if="data.item.offering">{{ data.item.offering.section }}</span>
              </template>

              <template v-slot:cell(startDate)="data">
                <span v-if="data.item.offering">{{ partOfTermDate(data.item.offering.part_of_term_id, 'start') }}</span>
                <span v-else>{{ data.item.start_date }}</span>
              </template>

              <template v-slot:cell(endDate)="data">
                <span v-if="data.item.offering">{{ partOfTermDate(data.item.offering.part_of_term_id, 'end') }}</span>
                <span v-else>{{ data.item.end_date }}</span>
              </template>

              <template v-slot:cell(campus)="data">
              <span
                v-if="data.item.offering">{{ getTextFromOptionValue('campus', data.item.offering.campus_id) }}</span>
                <span v-else>{{ getTextFromOptionValue('campus', data.item.campus_id) }}</span>
              </template>

              <template v-slot:cell(position)="data">
                {{ getTextFromOptionValue('position', data.item.position_id) }}
              </template>

              <template v-slot:cell(stipend)="data">
                ${{ data.item.stipend }}
              </template>

              <template v-slot:cell(accept_assignment)="data">
                <validation-provider vid="accept_assignment" rules="required" v-slot="validationContext">
                  <b-form-radio-group
                    v-model="data.item.accept_assignment"
                    :aria-describedby="createUniqueId('accept-feedback')"
                    :state="getValidationState(validationContext)"
                    :name="data.item.type + '-' + data.item.id + '-accept'"
                    :disabled="saving"
                  >
                    <b-form-radio value="1">Accept</b-form-radio>
                    <b-form-radio value="0">Reject</b-form-radio>
                  </b-form-radio-group>
                  <form-errors :id="createUniqueId('accept-feedback')" :errors="validationContext.errors"></form-errors>
                </validation-provider>
              </template>

              <template v-slot:cell(accept_pro-rate)="data">
                <validation-provider vid="accept_prorate" rules="required" v-slot="validationContext">
                  <b-form-radio-group
                    v-if="data.item.offering"
                    v-model="data.item.accept_prorate"
                    :aria-describedby="createUniqueId('prorate-feedback')"
                    :state="getValidationState(validationContext)"
                    :name="data.item.type + '-' + data.item.id + '-prorate-accept'"
                    :disabled="saving"
                  >
                    <b-form-radio value="1">Accept</b-form-radio>
                    <b-form-radio value="0">Reject</b-form-radio>
                  </b-form-radio-group>
                  <form-errors :id="createUniqueId('prorate-feedback')" :errors="validationContext.errors"></form-errors>
                </validation-provider>
              </template>

              <template v-slot:cell(minimum_enrollment)="data">
                <validation-provider vid="minimum_enrollment" rules="required" v-slot="validationContext">
                  <b-form-select v-if="data.item.offering"
                                 :id="data.item.type + '-' + data.item.id + '-min-enrollment'"
                                 :name="data.item.type + '-' + data.item.id + '-min-enrollment'"
                                 v-model="data.item.minimum_enrollment"
                                 :aria-describedby="createUniqueId('enrollment-feedback')"
                                 :state="getValidationState(validationContext)"
                                 :options="minimumEnrollmentOptions(data.item)"
                                 :disabled="saving"
                  ></b-form-select>
                  <form-errors :id="createUniqueId('enrollment-feedback')" :errors="validationContext.errors"></form-errors>
                </validation-provider>
              </template>
            </b-table>

            <b-row v-if="newAssignments && !saved">

              <b-col cols="auto">
                Signature:
              </b-col>

              <b-col cols="auto">
                <validation-provider vid="signature" rules="signature" v-slot="validationContext">
                  <b-form-input type="text"
                                :id="createUniqueId('signature')"
                                :state="getValidationState(validationContext)"
                                :aria-describedby="createUniqueId('signature-feedback')"
                                v-model="signature"
                  ></b-form-input>
                  <form-errors :id="createUniqueId('signature-feedback')" :errors="validationContext.errors"></form-errors>
                </validation-provider>
              </b-col>

              <b-col cols="auto">
                Date
              </b-col>

              <b-col cols="auto">
                <b-form-input type="text"
                              id="signature-date"
                              :value="dateNow"
                              :disabled=true
                ></b-form-input>
              </b-col>

              <b-col cols="auto">
                <b-button variant="success" type="submit">Submit</b-button>
              </b-col>

            </b-row>
          </b-form>
        </validation-observer>
      </div>
      <b-row v-else align-h="center">
        <b-col cols="auto">
          You have no new assignments to accept. You're all set!
        </b-col>
      </b-row>

    </div>

  </div>
</template>

<script>
import { BreadcrumbManager } from '../mixins/BreadcrumbManager'
import { userService } from '../services/user.service'
import { lookupFieldsService } from '../services/lookupFields.service'
import { SelectOptions } from '../mixins/SelectOptionsMixin'
import { termsService } from '../services/terms.service'
import LoadingPlaceholder from '../components/LoadingPlaceholder'
import { EventHandlerMixin } from '../mixins/EventHandlerMixin'
import { assignmentService } from '../services/assignment.service'
import { nonCourseAssignmentService } from '../services/nonCourseAssignment.service'
import { partsOfTermService } from '../services/partsOfTerm.service'
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate'
import FormErrors from '../components/FormErrors'
import { required } from 'vee-validate/dist/rules'
import { FormHelperMixin } from '../mixins/FormHelperMixin'

export default {
  name: 'AcceptanceForm',
  mixins: [BreadcrumbManager, SelectOptions, EventHandlerMixin, FormHelperMixin],
  components: { LoadingPlaceholder, FormErrors, ValidationProvider, ValidationObserver },
  props: {
    user_id: String,
    term_id: String
  },
  data () {
    return {
      user: null,
      positionOptions: null,
      campusOptions: null,
      subjectOptions: null,
      part_of_termOptions: null,
      partsOfTerm: null,
      part_of_term_ids: [],
      signature: null,
      params: {
        with: 'nonCourseAssignments,assignments.offering.course'
      },
      fields: [
        'course',
        'section',
        'startDate',
        'endDate',
        'campus',
        'position',
        'stipend',
        'accept_assignment',
        'accept_pro-rate',
        'minimum_enrollment'
      ],
      anyProrated: false,
      loading: true,
      confirmedAssignments: [],
      assignmentsToAccept: [],
      acceptedAssignments: [],
      saving: false,
      saved: false
    }
  },
  computed: {
    newAssignments () {
      return this.assignmentsToAccept.length > 0
    },
    oldAssignments () {
      return this.acceptedAssignments.length > 0
    },
    timeNow () {
      return this.$moment().format('YYYY-MM-DD HH:mm:ss')
    },
    dateNow () {
      return this.$moment().format('YYYY-MM-DD')
    }
  },
  mounted () {
    extend('required', {
      ...required,
      message: 'This field is required.'
    })

    extend('signature', {
      ...required,
      message: 'You must enter your name as a digital signature to proceed.'
    })

    this.initialize()
  },
  methods: {
    initialize: async function () {
      try {
        // get the user from user_id in URL
        const response1 = await userService.getUserById(this.$props.user_id)
        this.currentUser = response1.data.user

        // get the active term object
        const response2 = await termsService.getTermById(Number(this.$props.term_id))
        this.activeTerm = response2.data.term

        this.replaceBreadcrumb({
          find: 'Term loading...',
          replace: { text: this.activeTerm.name, to: { name: 'dashboard' }, params: { term_id: this.$props.term_id } }
        })

        // get select options
        const response3 = await lookupFieldsService.getLookupFields()
        let dataObject = response3.data.form_field_lookups
        this.subjectOptions = this.getOptions('field', 'subject', dataObject)
        this.campusOptions = this.getOptions('field', 'campus', dataObject)
        this.positionOptions = this.getOptions('field', 'position', dataObject)

        // get part of term options from parts_of_term table
        const response4 = await partsOfTermService.getPartsOfTerm({ term_id: this.$props.term_id })
        this.partsOfTerm = response4.data.parts_of_term
        this.part_of_termOptions = this.getOptions('field', 'partOfTerm', this.partsOfTerm, false)
        this.part_of_term_ids = []
        _.forEach(this.partsOfTerm, (partObject) => {
          this.part_of_term_ids.push(partObject.id)
        })

        // get all assignments for user
        const response5 = await userService.getUserById(this.$props.user_id, this.params)

        // get confirmed course assignments
        let confirmedCourseAssignments = []
        if (response5.data.user.assignments.length > 0) {
          // filter assignments to return only confirmed ones
          confirmedCourseAssignments = response5.data.user.assignments.filter((assignmentObject) => {
            return assignmentObject.confirmed !== null
          })
        }

        let userCourseAssignments = []
        let acceptedUserCourseAssignments = []
        if (confirmedCourseAssignments.length > 0) {
          // collect course assignments from the response that are in the active term
          // and both verified and stipend-verified
          userCourseAssignments = confirmedCourseAssignments.filter((assignmentObject) => {
            return (this.part_of_term_ids.includes(assignmentObject.offering.part_of_term_id) &&
              assignmentObject.verified !== null &&
              assignmentObject.stipend_verified !== null)
          })
          // set aside any assignments that are already accepted
          acceptedUserCourseAssignments = userCourseAssignments.filter((assignmentObject) => {
            return assignmentObject.accept_assignment !== null
          })
          // get any assignments that have not been accepted yet
          userCourseAssignments = userCourseAssignments.filter((assignmentObject) => {
            return assignmentObject.accept_assignment === null
          })
          // give each of these assignment objects the type 'course-assignment'
          _.forEach(userCourseAssignments, (assignmentObject) => {
            assignmentObject.type = 'course-assignment'
          })
          // if any course assignments have been found, set anyProrated to true
          if (userCourseAssignments.length > 0) {
            this.anyProrated = true
          }
        }

        // get non-course assignments that are in the current term and verified into an array
        let confirmedNonCourseAssignments = []
        if (response5.data.user.non_course_assignments.length > 0) {
          // filter assignments to return only confirmed ones
          confirmedNonCourseAssignments = response5.data.user.non_course_assignments.filter((assignmentObject) => {
            return assignmentObject.confirmed !== null
          })
        }
        let userNonCourseAssignments = []
        let acceptedUserNonCourseAssignments = []
        if (confirmedNonCourseAssignments.length > 0) {
          // collect non-course assignments from the response that are in the active term
          // and both verified and stipend-verified
          userNonCourseAssignments = response5.data.user.non_course_assignments.filter((assignmentObject) => {
            return (assignmentObject.term_id === Number(this.$props.term_id) &&
              assignmentObject.verified !== null &&
              assignmentObject.stipend_verified !== null)
          })
          // set aside any non-course assignments that are already accepted
          acceptedUserNonCourseAssignments = userNonCourseAssignments.filter((assignmentObject) => {
            return assignmentObject.accepted !== null
          })
          // get any non-course assignments that have not been accepted yet
          userNonCourseAssignments = userNonCourseAssignments.filter((assignmentObject) => {
            return assignmentObject.accepted === null
          })
          // give each of these non-course assignment objects the type 'non-course-assignment'
          _.forEach(userNonCourseAssignments, (assignmentObject) => {
            assignmentObject.type = 'non-course-assignment'
          })
        }

        this.assignmentsToAccept = [...userCourseAssignments, ...userNonCourseAssignments]
        this.acceptedAssignments = [...acceptedUserCourseAssignments, ...acceptedUserNonCourseAssignments]
        // all accepted assignments need to have _showDetails set to true so the accepted date can show
        _.forEach(this.acceptedAssignments, (assignmentObject) => {
          assignmentObject._showDetails = true
        })

        this.loading = false
      } catch (error) {
        this.displayErrors(error)
      }
    },

    /**
     * get enrollment range options based on course number (grad or undergrad)
     */
    minimumEnrollmentOptions (assignment) {
      let options = []
      options.push({ value: null, text: '-select-' })
      if (Number(assignment.offering.course.number) < 500) {
        for (let i = 9; i < 15; i++) {
          options.push({ value: i, text: i + ' undergraduate students' })
        }
      } else {
        for (let i = 5; i < 10; i++) {
          options.push({ value: i, text: i + ' graduate students' })
        }
      }
      return options
    },

    /**
     * get the course subject abbreviation from the course id and subject select options
     */
    getTextFromOptionValue (optionType, value) {
      if (value) {
        let option = this[optionType + 'Options'].find(function (obj) {
          return obj.value === value
        })
        return option.text
      }
    },

    partOfTermDate: function (part_id, dateName) {
      // console.log(this.partsOfTerm)
      let partOfTerm = this.partsOfTerm.find((partObject) => {
        return partObject.id === part_id
      })
      return partOfTerm[dateName + '_date']
    },

    toggleSaving () {
      this.saving = !this.saving
    },

    /**
     * save all changes to this form
     */
    saveAcceptance: async function () {
      this.toggleSaving()
      // check each assignment to see if it has been responded to
      _.forEach(this.assignmentsToAccept, (assignmentObject) => {
        assignmentObject.responded = false
        // check the radio buttons in the accept_assignment group to see if any have been activated
        let acceptRadioButtons = document.getElementsByName(assignmentObject.type + '-' + assignmentObject.id + '-accept')
        _.forEach(acceptRadioButtons, (button) => {
          // if any radio button in the group is checked, then the assignment has a response
          if (button.checked) {
            assignmentObject.responded = true
          }
        })
      })
      for (let i = 0; i < this.assignmentsToAccept.length; i++) {
        // if the assignment has a response, set up the data for updating
        if (this.assignmentsToAccept[i].responded) {
          let table
          let data = {
            accept_assignment: this.assignmentsToAccept[i].accept_assignment,
            accepted: this.timeNow,
            signature: this.signature,
            signature_timestamp: this.timeNow
          }
          if (this.assignmentsToAccept[i].minimum_enrollment) {
            data.minimum_enrollment = this.assignmentsToAccept[i].minimum_enrollment
          }
          if (this.assignmentsToAccept[i].accept_prorate) {
            data.accept_prorate = this.assignmentsToAccept[i].accept_prorate
            data.prorate_accepted = this.timeNow
            try {
              const response = await assignmentService.updateAssignment(this.assignmentsToAccept[i].id, data)
              this.$emit('saved', response)
              this.saved = true
              console.log(response)
            } catch (error) {
              this.displayErrors(error)
              console.log(error)
            }
          } else {
            try {
              const response = await nonCourseAssignmentService.updateNonCourseAssignment(this.assignmentsToAccept[i].id, data)
              this.$emit('saved', response)
              this.saved = true
              console.log(response)
            } catch (error) {
              this.displayErrors(error)
              console.log(error)
            }
          }
        }
      }
      this.toggleSaving()
    }
  }
}
</script>

<style scoped>

</style>
