<template>
  <div>
    <b-breadcrumb :items="breadcrumbs"></b-breadcrumb>

    <LoadingPlaceholder v-if="loading"></LoadingPlaceholder>

    <div v-else>

      <h1>Appointment Letter for {{ employee.first_name }} {{ employee.last_name }}</h1>

      <div class="appointment-letter-preview-container" ref="preview">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff">
          <tr>
            <td align="center">
              <table width="650" border="0" cellspacing="0" cellpadding="0" style="width: 100% !important;
                min-width: 100% !important;">
                <tr>
                  <td
                    style="width:650px; min-width:650px; font-size:0pt; line-height:0pt; padding:0; margin:0; font-weight:normal;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <!-- logo image -->
                      <tr>
                        <td style="padding: 0px 0px 10px 0px;">
                          <img src="https://learn.uncg.edu/apps/images/UNCGO_logo.png" width="396" height="95"
                               border="0" alt="UNCGO logo"/></td>
                      </tr>
                      <tr>
                        <!-- letter text -->
                        <td bgcolor="#ffffff">
                          <table width="100%" border="0" cellspacing="0" cellpadding="0">
                            <tr>
                              <td style="padding: 10px 50px 30px 50px;">
                                <table width="100%" border="0" cellspacing="0" cellpadding="0">

                                  <tr>
                                    <!-- UNCGO address -->
                                    <td
                                      style="color:#131313; font-family:'Sofia Pro', Helvetica, Arial, sans-serif; font-size:14px; line-height:20px; padding-bottom:10px;"
                                      v-html="templates.address">
                                    </td>
                                  </tr>

                                  <tr>
                                    <!-- date -->
                                    <td
                                      style="color:#131313; font-family: serif; font-size:16px; line-height:24px; padding-bottom:10px;">
                                      {{ dateToday }}
                                    </td>
                                  </tr>

                                  <tr>
                                    <!-- salutation -->
                                    <td
                                      style="color:#131313; font-family: serif; font-size:16px; line-height:24px; padding-bottom:10px;">
                                      Dear {{ getOptionProperty(employee.prefix_id, 'prefix', 'name') }} {{
                                        employee.last_name
                                      }}:
                                    </td>
                                  </tr>

                                  <tr>
                                    <!-- opening -->
                                    <td
                                      style="color:#131313; font-family: serif; font-size:16px; line-height:24px; padding-bottom:10px;"
                                      v-html="templates.opening">
                                    </td>
                                  </tr>

                                  <tr>
                                    <!-- course assignments -->
                                    <td style="padding: 0px 30px 10px 30px;">
                                      <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                        <tr v-for="assignment in userAssignments.courseAssignments"
                                            :key="'course-assignment ' + assignment.id">
                                          <!-- opening -->
                                          <td
                                            style="width:50%; color:#131313; font-family: serif; font-size:16px; line-height:24px; font-style:italic;">
                                            {{
                                              getOptionProperty(assignment.offering.course.subject_id, 'subject',
                                                'abbreviation')
                                            }}
                                            {{ assignment.offering.course.number }}-{{ assignment.offering.section }}:
                                            {{ assignment.offering.title }}
                                          </td>
                                          <td
                                            style="width:6%; color:#131313; font-family: serif; font-size:16px; line-height:24px; font-style:italic;">
                                            ({{ assignment.offering.course.credit_hours }})
                                          </td>
                                          <td
                                            style="width:34%; color:#131313; font-family: serif; font-size:16px; line-height:24px; font-style:italic;">
                                            {{ assignment.offering.part_of_term.start_date.replaceAll('-', '/') }} - {{
                                              assignment.offering.part_of_term.end_date.replaceAll('-', '/')
                                            }}
                                          </td>
                                          <td
                                            style="width:20%; color:#131313; font-family: serif; font-size:16px; line-height:24px; font-style:italic;">
                                            ${{ assignment.stipend }}
                                          </td>
                                        </tr>

                                        <tr v-for="assignment in userAssignments.nonCourseAssignments"
                                            :key="'non-course-assignment' + assignment.id">
                                          <td
                                            style="width:50%; color:#131313; font-family: serif; font-size:16px; line-height:24px; font-style:italic;">
                                            {{ getOptionProperty(assignment.position_id, 'position', 'name') }}
                                          </td>
                                          <td style="width:6%;">
                                          </td>
                                          <td
                                            style="width:34%; color:#131313; font-family: serif; font-size:16px; line-height:24px; font-style:italic;">
                                            {{ assignment.start_date.replaceAll('-', '/') }} - {{
                                              assignment.end_date.replaceAll('-', '/')
                                            }}
                                          </td>
                                          <td
                                            style="width:20%; color:#131313; font-family: serif; font-size:16px; line-height:24px; font-style:italic;">
                                            ${{ assignment.stipend }}
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>

                                  <!-- remainder of letter -->
                                  <tr v-for="(templateText, index) in templates.body" :key="index">
                                    <td
                                      style="color:#131313; font-family: serif; font-size:16px; line-height:24px; padding-bottom:10px;"
                                      v-html="templateText"></td>
                                  </tr>

                                  <!-- final instructions -->
                                  <tr>
                                    <td
                                      style="color:#131313; font-family: serif; font-size:16px; line-height:24px;padding-bottom:10px;"
                                      v-html="templates.instructions"></td>
                                  </tr>

                                  <!-- questions contact -->
                                  <tr>
                                    <td
                                      style="color:#131313; font-family: serif; font-size:16px; line-height:24px;"
                                      v-html="templates.questionsContact"></td>
                                  </tr>

                                  <!-- closing -->
                                  <tr>
                                    <td
                                      style="color:#131313; font-family: serif; font-size:16px; line-height:24px;">
                                      Sincerely,
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <img src="https://learn.uncg.edu/apps/images/karen_bull_signature.png"
                                           alt="Karen Bull's signature">
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      style="color:#131313; font-family: serif; font-size:16px; line-height:24px; padding-bottom:10px;"
                                      v-html="templates.deanName">
                                    </td>
                                  </tr>

                                  <!-- employee id & email -->
                                  <tr>
                                    <td
                                      style="color:#131313; font-family: serif; font-size:16px; line-height:24px;"
                                      v-html="templates.initials"></td>
                                  </tr>
                                  <tr>
                                    <td
                                      style="color:#131313; font-family: serif; font-size:16px; line-height:24px;">
                                      {{ employee.spartan_id }}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      style="color:#131313; font-family: serif; font-size:16px; line-height:24px;">
                                      {{ employee.email }}
                                    </td>
                                  </tr>

                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>

      <b-row align-h="center">
        <b-col v-if="!mailSent" cols="auto">
          <b-button variant="success" @click="sendMail">Mail it</b-button>
        </b-col>
        <b-col v-else cols="auto">
          <span class="button-appearance-label">Letter sent!</span>
        </b-col>
        <b-col v-if="referrer.termId && referrer.departmentId && referrer.departmentName" cols="auto">
          <b-button :href="'/dashboard/assignments-by-department/' + referrer.termId + '/' + referrer.departmentId">Back to department of {{ referrer.departmentName }}</b-button>
        </b-col>
        <b-col v-else cols="auto">
          <b-button href="/dashboard">Back to dashboard</b-button>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import { mailService } from '@/services/mail.service'
import LoadingPlaceholder from '../components/LoadingPlaceholder'
import { BreadcrumbManager } from '@/mixins/BreadcrumbManager'
import { ReferrerManager } from '@/mixins/ReferrerManager'
import { emailTemplateService } from '@/services/emailTemplate.service'
import { userService } from '@/services/user.service'
import { EventHandlerMixin } from '@/mixins/EventHandlerMixin'
import { lookupFieldsService } from '@/services/lookupFields.service'
import { assignmentService } from '@/services/assignment.service'

export default {
  name: 'AppointmentLetterPreview',
  components: { LoadingPlaceholder },
  mixins: [BreadcrumbManager, EventHandlerMixin, ReferrerManager],
  props: {
    user_id: String,
    term_id: String
  },
  data () {
    return {
      employee: {},
      userAssignments: {
        courseAssignments: [],
        nonCourseAssignments: []
      },
      messageContent: {},
      formOptions: {},
      templates: {
        body: []
      },
      params: {
        with: 'assignments.offering.course,assignments.offering.part_of_term,nonCourseAssignments'
      },
      loading: true,
      mailSent: false,
      months: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ]
    }
  },
  computed: {
    currentUser () {
      return this.$store.state.auth.user
    },
    referrer () {
      return this.$store.state.referrer.referrer
    },
    timeNow () {
      return this.$moment().format('YYYY-MM-DD HH:mm:ss')
    },
    dateToday () {
      let today = new Date()
      let day = today.getDate()
      let year = today.getFullYear()
      let month = this.months[today.getMonth()]
      return month + ' ' + day + ', ' + year
    }
  },
  mounted () {
    this.initialize()
  },
  methods: {
    initialize: async function () {
      let acceptanceUrl = process.env.VUE_APP_BASE_URL + 'dashboard/assignments/' + this.$props.term_id + '/' + this.$props.user_id
      try {
        // get saved templates and organize them for the preview
        const response = await emailTemplateService.getTemplates()
        let savedTemplates = response.data.email_templates
        this.templates.address = savedTemplates.find((templateObject) => {
          return templateObject.name === 'UNCGO address'
        }).body.replaceAll('<p>', '<p style="margin-bottom:0px;">')
        this.templates.opening = savedTemplates.find((templateObject) => {
          return templateObject.name === 'opening'
        }).body.replaceAll('<p>', '<p style="margin-bottom:0px;">')
        this.templates.instructions = savedTemplates.find((templateObject) => {
          return templateObject.name === 'instructions'
        }).body.replaceAll('<p>', '<p style="margin-bottom:0px;">').replace('[acceptance_form_url]', '<a href="acceptanceUrl">' + acceptanceUrl + '</a>')
        this.templates.questionsContact = savedTemplates.find((templateObject) => {
          return templateObject.name === 'questions contact'
        }).body.replaceAll('<p>', '<p style="margin-bottom:0px;">')
        this.templates.deanName = savedTemplates.find((templateObject) => {
          return templateObject.name === 'dean name'
        }).body.replaceAll('<p>', '<p style="margin-bottom:0px;">')
        this.templates.initials = savedTemplates.find((templateObject) => {
          return templateObject.name === 'initials'
        }).body.replaceAll('<p>', '<p style="margin-bottom:0px;">')

        // get the employee's assignments
        const response2 = await userService.getUserById(Number(this.$props.user_id), this.params)
        this.employee = response2.data.user
        if (this.employee.assignments && this.employee.assignments.length > 0) {
          _.forEach(this.employee.assignments, (assignmentObject) => {
            if (assignmentObject.verified && assignmentObject.stipend_verified && !assignmentObject.notified) {
              this.userAssignments.courseAssignments.push(assignmentObject)
            }
          })
          _.forEach(this.employee.non_course_assignments, (assignmentObject) => {
            if (assignmentObject.verified && assignmentObject.stipend_verified && !assignmentObject.notified) {
              this.userAssignments.nonCourseAssignments.push(assignmentObject)
            }
          })
        }

        // check whether any conditional paragraphs should be included
        let showAdPay = false
        let teaching = false
        if (this.userAssignments.courseAssignments.length > 0) {
          teaching = true
        }
        _.forEach(this.userAssignments.courseAssignments, (assignmentObject) => {
          if (this.employee.eclass_id !== assignmentObject.eclass_id) {
            showAdPay = true
          }
        })
        _.forEach(this.userAssignments.nonCourseAssignments, (assignmentObject) => {
          if (this.employee.eclass_id !== assignmentObject.eclass_id) {
            showAdPay = true
          }
        })

        // if any assignments are ad-pay (eClass mismatch), include ad-pay disclaimer
        if (showAdPay) {
          this.templates.body.push(savedTemplates.find((templateObject) => {
            return templateObject.name === 'ad-pay'
          }).body.replaceAll('p>', 'div>'))
        }

        // if any assignments are teaching positions, include enrollment disclaimer
        if (teaching) {
          this.templates.body.push(savedTemplates.find((templateObject) => {
            return templateObject.name === 'enrollment disclaimer'
          }).body.replaceAll('p>', 'div>'))
        }

        // get form field objects from form_field_lookups table
        const response3 = await lookupFieldsService.getLookupFields()
        let lookupsObject = response3.data.form_field_lookups
        this.formOptions.subject = lookupsObject.filter((lookupObject) => {
          return lookupObject.field === 'subject'
        })
        this.formOptions.prefix = lookupsObject.filter((lookupObject) => {
          return lookupObject.field === 'prefix'
        })
        this.formOptions.position = lookupsObject.filter((lookupObject) => {
          return lookupObject.field === 'position'
        })
        //
        // // get term name
        // const response4 = await termsService.getTermById(this.$props.term_id)
        // this.termName = response4.data.term.name

        this.loading = false
      } catch (error) {
        this.displayErrors(error)
        console.log(error)
      }
    },

    getOptionProperty: function (id, field, property) {
      return this.formOptions[field].find((optionObject) => {
        return optionObject.id === id
      })[property]
    },

    sendMail: async function () {
      let assignmentIds = []
      _.forEach(this.userAssignments.courseAssignments, (assignmentObject) => {
        assignmentIds.push(Number(assignmentObject.id))
      })
      let nonCourseAssignmentIds = []
      _.forEach(this.userAssignments.nonCourseAssignments, (assignmentObject) => {
        nonCourseAssignmentIds.push(Number(assignmentObject.id))
      })
      let params = {
        term_id: Number(this.$props.term_id),
        user_id: Number(this.$props.user_id),
        from_user_id: Number(this.currentUser.id),
        body: this.$refs.preview.innerHTML,
        assignment_ids: assignmentIds,
        non_course_assignment_ids: nonCourseAssignmentIds
      }
      try {
        const response = await mailService.sendMail(params)
        if (response.data.error === false) {
          this.mailSent = true
        }
      } catch (error) {
        this.displayErrors(error)
        console.log(error)
      }
    },

    updateAssignment: async function (assignmentObject) {
      await assignmentService.updateAssignment(assignmentObject.id, { notified: this.timeNow })
    }
  }
}
</script>

<style scoped>

</style>
