<template>
  <div>
    <loading-placeholder v-if="loading"></loading-placeholder>

    <b-card v-else :class="{ 'red-border': redBorder }">

      <b-overlay :show="updating" rounded="sm">
        <validation-observer v-if="!loading" ref="form" v-slot="{ handleSubmit }">
          <b-form @submit.prevent="handleSubmit(confirm)">

            <b-form-row align-h="between">

              <b-col>
                <h4>{{ sectionName }}
                  <b-badge v-if="(!offeringEdited && !offeringVerified) && userCanVerify"
                           variant="warning">New
                  </b-badge>
                  <b-badge v-else-if="(offeringEdited) && userCanVerify"
                           variant="warning">Edited
                  </b-badge>
                </h4>
              </b-col>

              <b-col cols="auto">
                <offering-assignment-buttons
                  :user-can-verify="userCanVerify"
                  :user-can-verify-stipend=false
                  type="offering"
                  :parent-confirmed=true
                  :parent-verified=true
                  :complete="offeringComplete"
                  :saved="saved"
                  :stipend-saved=true
                  :confirmed="offeringConfirmed"
                  :verified="offeringVerified"
                  :stipend-verified=true
                  :edited="offeringEdited"
                  :state-changed="stateChanged"
                  :stipend-changed=false
                  :inputs-disabled="inputsDisabled"
                  :updating="updating"
                  :uid="uid"
                  @save="saveOffering()"
                  @verify="verify()"
                  @unSave="unSave()"
                  @cancel="revert()"
                >
                </offering-assignment-buttons>
              </b-col>

              <b-col cols="auto">
                <b-button variant="outline-danger"
                          @mouseover="redBorder = true"
                          @mouseout="redBorder = false"
                          @click="deleteOffering">
                  <b-icon-trash-fill></b-icon-trash-fill>
                  Delete
                </b-button>
              </b-col>
            </b-form-row>

            <br>

            <b-row>

              <b-col cols="8">
                <b-form-group label="Title">
                  <span class="disabled-wrapper" :id="'disabled-title-input-wrapper-' + uid">
                    <validation-provider vid="title" rules="required" v-slot="validationContext">
                      <b-form-input type="text"
                                    :key="'offering-' + offering.id + '-title'"
                                    :name="'offering-' + offering.id + '-title'"
                                    :id="'offering-' + offering.id + '-title'"
                                    :disabled="inputsDisabled"
                                    placeholder="Course Title"
                                    v-model="currentOffering.title"
                                    :aria-describedby="createUniqueId('title-feedback')"
                                    :state="getValidationState(validationContext)"
                                    @keyup="unSave">
                      </b-form-input>
                      <form-errors :id="createUniqueId('title-feedback')"
                                   :errors="validationContext.errors"></form-errors>
                    </validation-provider>
                  </span>
                  <b-tooltip v-if="inputsDisabled"
                             :target="'disabled-title-input-wrapper-' + uid">
                    {{ disabledMessage() }}
                  </b-tooltip>
                </b-form-group>
              </b-col>

              <b-col cols="auto">
                <label :for="'offering-' + offering.id + '-wi'">WI</label>
                <span class="disabled-wrapper" :id="'disabled-wi-input-wrapper-' + uid">
              <b-form-checkbox
                :id="'offering-' + offering.id + '-wi'"
                :name="'offering-' + offering.id + '-wi'"
                v-model="currentOffering.wi"
                value=1
                unchecked-value=0
                :disabled="inputsDisabled"
                @change="unSave"
              >
              </b-form-checkbox>
              <b-tooltip v-if="inputsDisabled"
                         :target="'disabled-wi-input-wrapper-' + uid">
                {{ disabledMessage() }}
              </b-tooltip>
            </span>
              </b-col>

              <b-col cols="auto">
                <label :for="'offering-' + offering.id + '-si'">SI</label>
                <span class="disabled-wrapper" :id="'disabled-si-input-wrapper-' + uid">
              <b-form-checkbox
                :id="'offering-' + offering.id + '-si'"
                :name="'offering-' + offering.id + '-si'"
                v-model="currentOffering.si"
                value=1
                unchecked-value=0
                :disabled="inputsDisabled"
                @change="unSave"
              >
              </b-form-checkbox>
              <b-tooltip v-if="inputsDisabled"
                         :target="'disabled-si-input-wrapper-' + uid">
                {{ disabledMessage() }}
              </b-tooltip>
            </span>
              </b-col>

            </b-row>

            <b-row>

              <b-col cols="auto">
                <b-form-group label="Part of Term">
                  <span class="disabled-wrapper" :id="'disabled-term-input-wrapper-' + uid">
                    <validation-provider vid="part_of_term_id" rules="required" v-slot="validationContext">
                      <b-form-select :id="'offering-' + offering.id + '-part_of_term_id'"
                                     :name="'offering-' + offering.id + '-part_of_term_id'"
                                     :key="'offering-' + offering.id + '-part_of_term_id'"
                                     :disabled="inputsDisabled"
                                     v-model="currentOffering.part_of_term_id"
                                     :options="formOptions.partsOfTerm"
                                     :aria-describedby="createUniqueId('part-of-term-feedback')"
                                     :state="getValidationState(validationContext)"
                                     @change="unSave"
                      ></b-form-select>
                      <form-errors :id="createUniqueId('part-of-term-feedback')"
                                   :errors="validationContext.errors"></form-errors>
                    </validation-provider>
                  </span>
                  <b-tooltip v-if="inputsDisabled"
                             :target="'disabled-term-input-wrapper-' + uid">
                    {{ disabledMessage() }}
                  </b-tooltip>
                </b-form-group>
              </b-col>

              <b-col cols="auto">
                <b-form-group label="Campus">
                  <span class="disabled-wrapper" :id="'disabled-campus-input-wrapper-' + uid">
                    <validation-provider vid="campus_id" rules="required" v-slot="validationContext">
                      <b-form-select :id="'offering-' + offering.id + '-campus_id'"
                                     :name="'offering-' + offering.id + '-campus_id'"
                                     :key="'offering-' + offering.id + '-campus_id'"
                                     :disabled="inputsDisabled"
                                     v-model="currentOffering.campus_id"
                                     :options="formOptions.campuses"
                                     :aria-describedby="createUniqueId('campus-feedback')"
                                     :state="getValidationState(validationContext)"
                                     @change="unSave">
                      </b-form-select>
                      <form-errors :id="createUniqueId('campus-feedback')"
                                   :errors="validationContext.errors"></form-errors>
                    </validation-provider>
                  </span>
                  <b-tooltip v-if="inputsDisabled"
                             :target="'disabled-campus-input-wrapper-' + uid">
                    {{ disabledMessage() }}
                  </b-tooltip>
                </b-form-group>
              </b-col>

              <b-col cols="auto">
                <b-form-group label="Course Type">
                  <span class="disabled-wrapper" :id="'disabled-type-input-wrapper-' + uid">
                    <validation-provider vid="type_id" rules="required" v-slot="validationContext">
                      <b-form-select :id="'offering-' + offering.id + '-type_id'"
                                     :name="'offering-' + offering.id + '-type_id'"
                                     :key="'offering-' + offering.id + '-type_id'"
                                     :disabled="inputsDisabled"
                                     v-model="currentOffering.type_id"
                                     :options="formOptions.courseTypes"
                                     :aria-describedby="createUniqueId('type-feedback')"
                                     :state="getValidationState(validationContext)"
                                     @change="unSave">
                      </b-form-select>
                      <form-errors :id="createUniqueId('type-feedback')"
                                   :errors="validationContext.errors"></form-errors>
                    </validation-provider>
                  </span>
                  <b-tooltip v-if="inputsDisabled"
                             :target="'disabled-type-input-wrapper-' + uid">
                    {{ disabledMessage() }}
                  </b-tooltip>
                </b-form-group>
              </b-col>

              <b-col cols="auto" v-if="userCanVerify || offeringVerified || offeringEdited"
                     class="section-col">
                <b-form-group label="Section">
                  <span class="disabled-wrapper" :id="'disabled-section-input-wrapper-' + uid">
                    <validation-provider vid="section" rules="required" v-slot="validationContext">
                      <b-form-input type="text"
                                    :key="'offering-' + offering.id + '-section'"
                                    :name="'offering-' + offering.id + '-section'"
                                    :id="'offering-' + offering.id + '-section'"
                                    :disabled="inputsDisabled"
                                    placeholder="00"
                                    v-model="currentOffering.section"
                                    :aria-describedby="createUniqueId('section-feedback')"
                                    :state="getValidationState(validationContext)"
                                    @keyup="unSave">
                      </b-form-input>
                      <form-errors :id="createUniqueId('section-feedback')"
                                   :errors="validationContext.errors"></form-errors>
                    </validation-provider>
                  </span>
                  <b-tooltip v-if="inputsDisabled"
                             :target="'disabled-section-input-wrapper-' + uid">
                    {{ disabledMessage() }}
                  </b-tooltip>
                </b-form-group>
              </b-col>

              <b-col cols="auto" v-if="userCanVerify || offeringVerified || offeringEdited" class="crn-col">
                <b-form-group label="CRN">
                  <span class="disabled-wrapper" :id="'disabled-crn-input-wrapper-' + uid">
                    <b-form-input type="text"
                                  :key="'offering-' + offering.id + '-crn'"
                                  :name="'offering-' + offering.id + '-crn'"
                                  :id="'offering-' + offering.id + '-crn'"
                                  :disabled="inputsDisabled"
                                  placeholder="00000"
                                  maxlength="5"
                                  v-model="currentOffering.crn"
                                  @keyup="unSave">
                    </b-form-input>
                  </span>
                  <b-tooltip v-if="inputsDisabled"
                             :target="'disabled-crn-input-wrapper-' + uid">
                    {{ disabledMessage() }}
                  </b-tooltip>
                </b-form-group>
              </b-col>

            </b-row>

            <b-row>

              <b-col cols="auto">
                <label :for="'offering-' + offering.id + '-days'">Meeting Days</label>
                <span class="disabled-wrapper" :id="'disabled-days-input-wrapper-' + uid">
                  <b-form-checkbox-group
                    :id="'offering-' + offering.id + '-days'"
                    :name="'offering-' + offering.id + '-days'"
                    v-model="daysArray"
                    :options="dayOptions"
                    :disabled="inputsDisabled"
                    @change="getDaysString"
                  >
                  </b-form-checkbox-group>
                  <b-tooltip v-if="inputsDisabled"
                             :target="'disabled-days-input-wrapper-' + uid">
                    {{ disabledMessage() }}
                  </b-tooltip>
                </span>
              </b-col>

              <b-col cols="auto">
                <b-form-group label="Meeting Time">
              <span class="disabled-wrapper" :id="'disabled-times-input-wrapper-' + uid">
                <b-form-select :id="'offering-' + offering.id + '-times_id'"
                               :name="'offering-' + offering.id + '-times_id'"
                               :key="'offering-' + offering.id + '-times_id'"
                               :disabled="inputsDisabled"
                               v-model="currentOffering.start_end_times_id"
                               :options="formOptions.startEndTimes"
                               @change="unSave">
                </b-form-select>
              </span>
                  <b-tooltip v-if="inputsDisabled"
                             :target="'disabled-times-input-wrapper-' + uid">
                    {{ disabledMessage() }}
                  </b-tooltip>
                </b-form-group>
              </b-col>

              <b-col cols="2">
                <b-form-group label="Seats">
                  <span class="disabled-wrapper" :id="'disabled-seats-input-wrapper-' + uid">
                    <validation-provider vid="maximum_enrollment" rules="required" v-slot="validationContext">
                      <b-form-input type="number"
                                    :key="'offering-' + offering.id + '-seats'"
                                    :name="'offering-' + offering.id + '-seats'"
                                    :id="'offering-' + offering.id + '-seats'"
                                    :disabled="inputsDisabled"
                                    placeholder="000"
                                    v-model="currentOffering.maximum_enrollment"
                                    :aria-describedby="createUniqueId('seats-feedback')"
                                    :state="getValidationState(validationContext)"
                                    @keyup="unSave">
                      </b-form-input>
                      <form-errors :id="createUniqueId('seats-feedback')"
                                   :errors="validationContext.errors"></form-errors>
                    </validation-provider>
                  </span>
                  <b-tooltip v-if="inputsDisabled"
                             :target="'disabled-seats-input-wrapper-' + uid">
                    {{ disabledMessage() }}
                  </b-tooltip>
                </b-form-group>
              </b-col>

            </b-row>
            <!-- /.offering-inputs -->
          </b-form>
        </validation-observer>
        <!-- last tag info -->
        <b-row>
          <b-col>
            <offering-assignment-last-tag-info
              v-if="offeringConfirmed"
              ref="lastTagInfo"
              :parent-object="currentOffering"
            ></offering-assignment-last-tag-info>
          </b-col>
        </b-row>

        <!-- comments -->
        <comments
          :comments="currentOffering.comments"
          :uid="uid"
          :parent-id="currentOffering.id"
          parent-type="offering"
          :user-id="currentUser.id"
        ></comments>

        <!-- assignments -->
        <div v-if="activeAssignments" class="assignments-block">
          <transition-group name="fade">
            <assignment-row v-for="(assignment, index) in activeAssignments"
                            :key="index"
                            :formOptions="formOptions"
                            :assignment="assignment"
                            :term-id="termId"
                            :user-can-verify="userCanVerify"
                            :user-can-verify-stipend="userCanVerifyStipend"
                            :parent-confirmed="offeringConfirmed"
                            :parent-verified="offeringVerified"
                            @deleteAssignment="deleteAssignment($event)"
            ></assignment-row>
          </transition-group>
        </div>

        <b-row align-h="center">
          <b-col cols="auto">
            <b-button class="new-assignment-button" variant="outline-primary" @click="addAssignment">
              Assign instructor to this section
            </b-button>
          </b-col>
        </b-row>

      </b-overlay>
    </b-card>
  </div>
</template>

<script>
import AssignmentRow from './AssignmentRow'
import OfferingAssignmentButtons from './OfferingAssignmentButtons'
import OfferingAssignmentLastTagInfo from './OfferingAssignmentLastTagInfo'
import { Assignment } from '../models/assignment'
import { FormHelperMixin } from '../mixins/FormHelperMixin'
import { EventHandlerMixin } from '../mixins/EventHandlerMixin'
import LoadingPlaceholder from './LoadingPlaceholder'
import Comments from './Comments'
import { commentService } from '../services/comment.service'
import { offeringService } from '../services/offering.service'
import { assignmentService } from '../services/assignment.service'
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate'
import FormErrors from '../components/FormErrors'
import { required } from 'vee-validate/dist/rules'

export default {
  name: 'OfferingRow',
  components: {
    AssignmentRow,
    OfferingAssignmentButtons,
    OfferingAssignmentLastTagInfo,
    LoadingPlaceholder,
    Comments,
    ValidationProvider,
    ValidationObserver,
    FormErrors
  },
  mixins: [FormHelperMixin, EventHandlerMixin],
  props: {
    termId: Number,
    offering: Object,
    formOptions: Object,
    nonCourse: Boolean,
    userCanVerify: Boolean,
    userCanVerifyStipend: Boolean
  },
  data () {
    return {
      currentOffering: {},
      daysArray: [],
      dayOptions: [
        { text: 'M', value: 'M' },
        { text: 'T', value: 'T' },
        { text: 'W', value: 'W' },
        { text: 'R', value: 'R' },
        { text: 'F', value: 'F' }
      ],
      redBorder: false,
      params: {
        with: 'comments'
      },
      saved: true,
      updating: false
    }
  },
  computed: {
    offeringComplete () {
      if (this.userCanVerify) {
        return !!(this.currentOffering.part_of_term_id &&
          this.currentOffering.campus_id &&
          this.currentOffering.title &&
          this.currentOffering.type_id &&
          this.currentOffering.maximum_enrollment &&
          this.currentOffering.crn &&
          this.currentOffering.section)
      } else {
        return !!(this.currentOffering.part_of_term_id &&
          this.currentOffering.title &&
          this.currentOffering.type_id &&
          this.currentOffering.maximum_enrollment &&
          this.currentOffering.campus_id)
      }
    },
    offeringConfirmed () {
      return this.currentOffering.confirmed !== null
    },
    offeringVerified () {
      return this.currentOffering.verified !== null
    },
    offeringEdited () {
      return this.currentOffering.edited !== null
    },
    inputsDisabled () {
      return (this.offeringVerified && this.saved && !this.userCanVerify) ||
        (this.offeringConfirmed && this.saved && !this.userCanVerify) ||
        (this.offeringVerified && this.saved)
    },
    stateChanged: function () {
      return this.didStateChange(this.currentOffering)
    },
    currentUser () {
      return this.$store.state.auth.user
    },
    sectionName () {
      let output = ''
      if (!this.currentOffering.section) {
        output += 'New '
      }
      output += 'Section'
      if (this.currentOffering.section) {
        output += ' ' + this.currentOffering.section
      }
      return output
    },
    activeAssignments () {
      if (this.userCanVerify) {
        return this.currentOffering.assignments.filter((obj) => {
          return (obj.confirmed !== null)
        })
      } else {
        return this.currentOffering.assignments
      }
    },
    timeNow () {
      return this.$moment().format('YYYY-MM-DD HH:mm:ss')
    }
  },
  mounted () {
    extend('required', {
      ...required,
      message: 'This field is required.'
    })

    this.initialize()
  },
  methods: {
    /**
     * set all the data variables from props
     */
    initialize: async function () {
      this.currentOffering = _.cloneDeep(this.$props.offering)
      this.saveCurrentState(this.currentOffering)
      if (this.daysArray.length > 0) {
        this.daysArray = this.currentOffering.meeting_days.split('')
      }
      this.loading = false
    },

    /**
     * creates a new assignment with empty values in the assignments object
     */
    addAssignment: async function () {
      let newAssignment = new Assignment({})
      newAssignment.offering_id = this.currentOffering.id
      if (this.userCanVerify) {
        newAssignment.confirmed = this.timeNow
      }
      try {
        const response = await assignmentService.saveNewAssignment(newAssignment)
        newAssignment.id = response.data.assignment.id
      } catch (error) {
        this.displayErrors(error)
        console.log(error)
      }
      this.currentOffering.assignments.push(newAssignment)
    },

    getDaysString: function () {
      this.currentOffering.meeting_days = String(this.daysArray.join(''))
      this.unSave()
    },

    /**
     * get tooltip text
     */
    disabledMessage: function (defaultMessage = null) {
      if (this.offeringVerified) {
        return 'Click "Edit" to change a verified offering.'
      } else if (this.offeringConfirmed) {
        return 'Offerings cannot be edited while they are pending.'
      } else {
        return defaultMessage
      }
    },

    confirm: async function () {
      this.currentOffering.confirmed = this.timeNow
      await this.updateOffering()
    },

    unSave: function () {
      this.saved = false
    },

    saveOffering: async function () {
      this.updating = true
      if (this.offeringVerified) {
        // remove verified timestamp
        this.currentOffering.verified = null
        // add edited timestamp
        this.currentOffering.edited = this.timeNow
      }
      if (this.currentOffering.id) {
        await this.updateOffering()
      } else {
        await this.saveNewOffering()
      }
      this.saveCurrentState(this.currentOffering)
      if (this.offeringConfirmed) {
        this.$refs.lastTagInfo.initialize()
      }
      this.updating = false
    },

    verify: async function () {
      this.updating = true
      // add verified timestamp
      this.currentOffering.verified = this.timeNow
      if (this.offeringEdited) {
        // remove edited timestamp
        this.currentOffering.edited = null
      }
      if (this.currentOffering.id) {
        await this.updateOffering()
      } else {
        await this.saveNewOffering()
      }
      this.saveCurrentState(this.currentOffering)
      if (this.offeringConfirmed) {
        this.$refs.lastTagInfo.initialize()
      }
      this.saved = true
      this.updating = false
    },

    revert: function () {
      this.currentOffering = _.cloneDeep(this.currentState)
      this.saved = true
    },

    /**
     * create new offering in the db
     */
    saveNewOffering: async function () {
      try {
        const response = await offeringService.saveNewOffering(this.currentOffering)
        this.currentOffering.id = response.data.offering.id
      } catch (error) {
        this.displayErrors(error)
        console.log(error)
      }
    },

    /**
     * updates the current offering
     */
    updateOffering: async function () {
      let data = this.returnChangedParams(this.currentOffering)
      try {
        await offeringService.updateOffering(this.currentOffering.id, data)
        this.saveCurrentState(this.currentOffering)
        this.saved = true
      } catch (error) {
        this.displayErrors(error)
      }
    },

    deleteAssignment: async function (assignmentId) {
      let deletedAssignment = this.currentOffering.assignments.find((assignmentObject) => {
        return assignmentObject.id === assignmentId
      })
      this.currentOffering.assignments = this.currentOffering.assignments.filter((assignmentObject) => {
        return assignmentObject.id !== assignmentId
      })

      try {
        await assignmentService.deleteAssignment(deletedAssignment.id)
        await this.deleteComments(deletedAssignment, 'assignment')
      } catch (error) {
        this.displayErrors(error)
      }
    },

    deleteOffering: async function () {
      if (this.currentOffering.assignments.length > 0) {
        _.forEach(this.currentOffering.assignments, (assignmentObject) => {
          this.deleteAssignment(assignmentObject.id)
        })
      }
      try {
        await offeringService.deleteOffering(this.currentOffering.id)
        this.$emit('deleteOffering', this.currentOffering.id)
        await this.deleteComments(this.currentOffering, 'offering')
      } catch (error) {
        this.displayErrors(error)
      }
    },

    deleteComments: async function (commentableObject, objectType) {
      try {
        const response = await commentService.getCommentsByCommentableObject({
          commentable_id: commentableObject.id,
          commentable_type: 'App\\Models\\' + _.upperFirst(objectType)
        })
        if (response.data.comments.length > 0) {
          _.forEach(response.data.comments, async function (commentObject) {
            await commentService.deleteComment(commentObject.id)
          })
        }
      } catch (error) {
        this.displayErrors(error)
      }
    }
  }
}
</script>
