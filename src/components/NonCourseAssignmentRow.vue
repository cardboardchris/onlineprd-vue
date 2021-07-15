<template>
  <div class="non-course-assignment-row">
    <loading-placeholder v-if="loading"></loading-placeholder>

    <b-card v-else :class="{ 'red-border': redBorder }">

      <b-overlay :show="updating" rounded="sm">
        <validation-observer v-if="!loading" ref="form" v-slot="{ handleSubmit }">
          <b-form @submit.prevent="handleSubmit(confirm)">

            <b-row align-h="between">
              <b-col>
                <h4>Assignment: <span v-if="saved">{{ activePositionName }}</span>
                  <b-badge v-if="(!assignmentEdited && !assignmentVerified) && userCanVerify"
                           variant="warning">New
                  </b-badge>
                  <b-badge v-else-if="(assignmentEdited) && userCanVerify"
                           variant="warning">Edited
                  </b-badge>
                </h4>
              </b-col>

              <b-col cols="auto">
                <b-button variant="outline-danger"
                          @mouseover="redBorder = true"
                          @mouseout="redBorder = false"
                          @click="deleteAssignment">
                  <b-icon-trash-fill></b-icon-trash-fill>
                  Delete
                </b-button>
              </b-col>
            </b-row>

            <br>

            <b-row>
              <b-col cols="4">
                <b-form-group label="Position">
              <span class="disabled-wrapper" :id="'disabled-position-input-wrapper-' + uid">
                <validation-provider vid="position_id" rules="required" v-slot="validationContext">
                  <b-form-select :id="'assignment-' + uid + '-position'"
                                 v-model="currentAssignment.position_id"
                                 :options="formOptions.positions"
                                 :disabled="inputsDisabled"
                                 :aria-describedby="createUniqueId('position-feedback')"
                                 :state="getValidationState(validationContext)"
                                 @change="unSave"
                  ></b-form-select>
                  <form-errors :id="createUniqueId('position-feedback')"
                               :errors="validationContext.errors"></form-errors>
                </validation-provider>
              </span>
                  <b-tooltip v-if="inputsDisabled"
                             :target="'disabled-position-input-wrapper-' + uid">
                    {{ disabledMessage() }}
                  </b-tooltip>
                </b-form-group>
              </b-col>

              <b-col cols="4">
                <b-form-group label="Employee eClass">
              <span class="disabled-wrapper" :id="'disabled-eclass-input-wrapper-' + uid">
                <validation-provider vid="eclass_id" rules="required" v-slot="validationContext">
                <b-form-select :id="'assignment-' + uid + '-eClass'"
                               v-model="currentAssignment.eclass_id"
                               :options="formOptions.eClasses"
                               :disabled="inputsDisabled"
                               :aria-describedby="createUniqueId('eclass-feedback')"
                               :state="getValidationState(validationContext)"
                               @change="unSave"
                ></b-form-select>
                  <form-errors :id="createUniqueId('eclass-feedback')"
                               :errors="validationContext.errors"></form-errors>
                </validation-provider>
              </span>
                  <b-tooltip v-if="inputsDisabled"
                             :target="'disabled-eclass-input-wrapper-' + uid">
                    {{ disabledMessage() }}
                  </b-tooltip>
                </b-form-group>
              </b-col>

              <b-col cols="1">
                <b-form-group label="Hrs/Wk">
                  <b-input-group>
                <span class="disabled-wrapper" :id="'disabled-hours-input-wrapper-' + uid">
                  <validation-provider vid="hours_worked" rules="required" v-slot="validationContext">
                    <b-form-input type="text"
                                  :id="'assignment-' + uid + '-hours_worked'"
                                  placeholder="0"
                                  v-model="currentAssignment.hours_worked"
                                  :disabled="inputsDisabled"
                                  :aria-describedby="createUniqueId('hours-feedback')"
                                  :state="getValidationState(validationContext)"
                                  @change="unSave"
                    ></b-form-input>
                    <form-errors :id="createUniqueId('hours-feedback')"
                                 :errors="validationContext.errors"></form-errors>
                  </validation-provider>
                </span>
                    <b-tooltip v-if="inputsDisabled"
                               :target="'disabled-hours-input-wrapper-' + uid">
                      {{ disabledMessage() }}
                    </b-tooltip>
                  </b-input-group>
                </b-form-group>
              </b-col>

            </b-row>

            <b-row>
              <b-col cols="auto">
                <b-form-group label="Campus">
              <span class="disabled-wrapper" :id="'disabled-campus-input-wrapper-' + uid">
                <validation-provider vid="campus_id" rules="required" v-slot="validationContext">
                  <b-form-select :id="'assignment-' + uid + '-campus_id'"
                                 :name="'assignment-' + uid + '-campus_id'"
                                 :key="'assignment-' + uid + '-campus_id'"
                                 :disabled="inputsDisabled"
                                 v-model="currentAssignment.campus_id"
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
                <b-form-group
                  :id="createUniqueId('input-group-start-date')"
                  label="Start Date"
                  :label-for="createUniqueId('start-date')"
                >
              <span class="disabled-wrapper" :id="'disabled-hours-input-wrapper-' + uid">
                <validation-provider vid="start_date" rules="required" v-slot="validationContext">
                  <b-form-datepicker
                    :id="createUniqueId('start-date')"
                    v-model="currentAssignment.start_date"
                    :disabled="inputsDisabled"
                    :aria-describedby="createUniqueId('start-date-feedback')"
                    :state="getValidationState(validationContext)"
                    required
                  ></b-form-datepicker>
                  <form-errors :id="createUniqueId('start-date-feedback')"
                               :errors="validationContext.errors"></form-errors>
                </validation-provider>
              </span>
                </b-form-group>
              </b-col>

              <b-col cols="auto">
                <b-form-group
                  :id="createUniqueId('input-group-end-date')"
                  label="End Date"
                  :label-for="createUniqueId('end-date')"
                >
                  <validation-provider vid="end_date" rules="required" v-slot="validationContext">
                    <b-form-datepicker
                      :id="createUniqueId('end-date')"
                      v-model="currentAssignment.end_date"
                      :aria-describedby="createUniqueId('end-date-feedback')"
                      :disabled="inputsDisabled"
                      required
                    ></b-form-datepicker>
                    <FormErrors :id="createUniqueId('end-date-feedback')"
                                :errors="validationContext.errors"></FormErrors>
                  </validation-provider>
                </b-form-group>
              </b-col>

              <b-col class="no-label-col">
                <offering-assignment-buttons
                  :user-can-verify="userCanVerify"
                  :user-can-verify-stipend="userCanVerifyStipend"
                  type="assignment"
                  :parent-confirmed=true
                  :parent-verified=true
                  :complete="assignmentComplete"
                  :saved="saved"
                  :stipend-saved="stipendSaved"
                  :confirmed="assignmentConfirmed"
                  :verified="assignmentVerified"
                  :stipend-verified="stipendVerified"
                  :edited="assignmentEdited"
                  :state-changed="stateChanged"
                  :stipend-changed="stipendChanged"
                  :inputs-disabled="inputsDisabled"
                  :updating="updating"
                  :uid="uid"
                  @save="save()"
                  @verify="verify()"
                  @unSave="unSave()"
                  @cancel="revert()"
                >
                </offering-assignment-buttons>
              </b-col>

            </b-row>

            <b-row>

              <b-col cols="auto" class="no-label-col">
                <b-button
                  variant="success"
                  :disabled="inputsDisabled"
                  @click="modalAddEmployeeShow = !modalAddEmployeeShow"
                >
                  <b-icon-person-plus></b-icon-person-plus>
                  Assign Employee
                </b-button>
              </b-col>

              <b-col cols="4">
                <label>Assigned Employee</label>
                <div class="form-control disabled-appearance"
                     v-b-tooltip.hover.top
                     title="Use &quot;Assign Employee&quot; button to assign employee">
                <span v-if="currentAssignment.user">
                  {{ currentAssignment.user.first_name }}
                  {{ currentAssignment.user.last_name }}
                </span>
                </div>
              </b-col>

              <b-col cols="2">
                <b-form-group label="Stipend">
                  <span class="disabled-wrapper" :id="'disabled-stipend-input-wrapper-' + uid">
                    <validation-provider vid="stipend" rules="required" v-slot="validationContext">
                      <b-input-group prepend="$">
                          <b-form-input type="text"
                                        :id="'assignment-' + uid + '-stipend'"
                                        placeholder="0.00"
                                        v-model="currentAssignment.stipend"
                                        :disabled="stipendDisabled"
                                        :aria-describedby="createUniqueId('stipend-feedback')"
                                        :state="getValidationState(validationContext)"
                                        @change="unSaveStipend"
                          ></b-form-input>
                      </b-input-group>
                      <form-errors :id="createUniqueId('stipend-feedback')"
                                   :errors="validationContext.errors"></form-errors>
                    </validation-provider>
                  </span>
                  <b-tooltip v-if="inputsDisabled"
                             :target="'disabled-stipend-input-wrapper-' + uid">
                    {{ disabledMessage() }}
                  </b-tooltip>
                </b-form-group>
              </b-col>

              <!--          <b-col cols="12" lg="4">-->
              <!--            <b-form-group v-if="!assignmentConfirmed && fullTime" label="Annual Salary">-->
              <!--              <b-input-group prepend="$">-->
              <!--                <b-form-input type="text"-->
              <!--                              :id="'assignment-' + this.uid + '-employee_salary'"-->
              <!--                              placeholder="0.00"-->
              <!--                              v-model="currentAssignment.salary"-->
              <!--                              @change="updateField('salary')"-->
              <!--                ></b-form-input>-->
              <!--              </b-input-group>-->
              <!--            </b-form-group>-->
              <!--            <div v-else class="form-group">-->
              <!--              <label>Annual Salary</label>-->
              <!--              <div class="form-control readonly-appearance"-->
              <!--                   v-b-tooltip.hover.bottom-->
              <!--                   title="position is not full-time"-->
              <!--              >-->
              <!--              </div>-->
              <!--            </div>-->
              <!--          </b-col>-->

              <b-col class="no-label-col">
                <stipend-buttons
                  :user-can-verify="userCanVerify"
                  :user-can-verify-stipend="userCanVerifyStipend"
                  :edited="assignmentEdited"
                  :stipend-saved="stipendSaved"
                  :parent-verified=true
                  :stipend-verified="stipendVerified"
                  :stipend-changed="stipendChanged"
                  :updating="updating"
                  :uid="uid"
                  @verifyStipend="verifyStipend()"
                  @unSaveStipend="unSaveStipend()"
                  @cancelStipend="revertStipend()"
                >
                </stipend-buttons>
              </b-col>

            </b-row>
          </b-form>
        </validation-observer>

        <!-- last tag info & employee status check -->
        <b-row>
          <b-col>
            <offering-assignment-last-tag-info
              v-if="assignmentConfirmed"
              ref="lastTagInfo"
              :parent-object="currentAssignment"
            ></offering-assignment-last-tag-info>
          </b-col>
          <b-col cols="auto" v-if="assignmentVerified && stipendVerified">
            <b-button
              variant="info"
              @click="modalCheckEmployeeShow = !modalCheckEmployeeShow"
            >Check Appointment Status
            </b-button>
          </b-col>
        </b-row>

      </b-overlay>
    </b-card>

    <b-modal
      v-if="currentAssignment.user"
      :id="'add-employee-modal-' + uid"
      size="xl"
      v-model="modalCheckEmployeeShow"
      :title="currentAssignment.user.first_name + ' ' + currentAssignment.user.last_name + '\'s Assignments'"
      :ok-only="true"
      ok-title="Close"
    >
      <user-assignments-status
        :term-id="currentAssignment.term_id"
        :user-id="currentAssignment.user.id"
        :form-options="formOptions"
      ></user-assignments-status>
    </b-modal>

    <b-modal
      :id="'add-employee-modal-' + uid"
      size="xl"
      v-model="modalAddEmployeeShow"
      title="Add Employee"
      :ok-only="true"
      ok-title="Close"
    >
      <UserSearch v-on:user-selected="addEmployee"></UserSearch>
    </b-modal>
  </div>
</template>

<script>
import OfferingAssignmentButtons from './OfferingAssignmentButtons'
import LoadingPlaceholder from './LoadingPlaceholder'
import { FormHelperMixin } from '../mixins/FormHelperMixin'
import { EventHandlerMixin } from '../mixins/EventHandlerMixin'
import OfferingAssignmentLastTagInfo from './OfferingAssignmentLastTagInfo'
import StipendButtons from './StipendButtons'
import { SelectOptions } from '../mixins/SelectOptionsMixin'
import UserSearch from './UserSearch'
import { nonCourseAssignmentService } from '../services/nonCourseAssignment.service'
import UserAssignmentsStatus from './UserAssignmentsStatus'
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate'
import FormErrors from '../components/FormErrors'
import { required } from 'vee-validate/dist/rules'

export default {
  name: 'NonCourseAssignmentRow',
  components: {
    LoadingPlaceholder,
    OfferingAssignmentButtons,
    StipendButtons,
    OfferingAssignmentLastTagInfo,
    UserAssignmentsStatus,
    UserSearch,
    ValidationProvider,
    ValidationObserver,
    FormErrors
  },
  mixins: [FormHelperMixin, EventHandlerMixin, SelectOptions],
  props: {
    formOptions: Object,
    assignment: Object,
    userCanVerify: Boolean,
    userCanVerifyStipend: Boolean
  },
  data () {
    return {
      currentAssignment: {},
      redBorder: false,
      saved: true,
      stipendSaved: true,
      modalCheckEmployeeShow: false,
      modalAddEmployeeShow: false,
      loading: true,
      updating: false,
      uid: null
    }
  },
  computed: {
    activePositionName () {
      if (this.currentAssignment.position_id) {
        return this.getPositionName(this.currentAssignment.position_id)
      } else {
        return null
      }
    },
    assignmentComplete () {
      return !!(this.currentAssignment.user_id &&
        this.currentAssignment.position_id &&
        this.currentAssignment.hours_worked &&
        this.currentAssignment.start_date &&
        this.currentAssignment.end_date &&
        this.currentAssignment.campus_id &&
        this.currentAssignment.stipend &&
        this.currentAssignment.eclass_id)
      // (this.currentAssignment.salary || !this.fullTime))
    },
    // fullTime () {
    //   // return this.currentAssignment.eClass.full_time
    //   return true
    // },
    // activeTerm () {
    //   return this.$store.getters.term
    // },
    currentUser () {
      return this.$store.state.auth.user
    },
    stateChanged: function () {
      return this.didStateChange(this.currentAssignment)
    },
    stipendChanged: function () {
      return this.currentState.stipend !== this.currentAssignment.stipend
    },
    assignmentConfirmed () {
      return this.currentAssignment.confirmed !== null
    },
    assignmentVerified () {
      return this.currentAssignment.verified !== null
    },
    stipendVerified () {
      return this.currentAssignment.stipend_verified !== null
    },
    assignmentEdited () {
      return this.currentAssignment.edited !== null
    },
    inputsDisabled () {
      return (this.assignmentVerified && this.saved && !this.userCanVerify) ||
        (this.assignmentConfirmed && this.saved && !this.userCanVerify) ||
        (this.assignmentVerified && this.saved)
    },
    stipendDisabled () {
      return (this.stipendVerified && this.stipendSaved && !this.userCanVerifyStipend) ||
        (this.assignmentConfirmed && this.stipendSaved && !this.userCanVerifyStipend) ||
        (this.assignmentVerified && this.stipendSaved)
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
    initialize: function () {
      this.currentAssignment = _.cloneDeep(this.$props.assignment)
      this.saveCurrentState(this.currentAssignment)

      this.loading = false
    },

    addEmployee: function (user) {
      this.currentAssignment.user = user
      this.currentAssignment.user_id = user.id
      this.$bvModal.hide('add-employee-modal-' + this.uid)
      this.unSave()
    },

    getPositionName: function (positionId) {
      return this.getTextValueFromOptions(positionId, this.formOptions.positions)
    },

    confirm: async function () {
      this.currentAssignment.confirmed = this.$moment().format('YYYY-MM-DD HH:mm:ss')
      await this.update()
    },

    unSave: function () {
      this.saved = false
      this.stipendSaved = false
    },

    save: async function () {
      this.updating = true
      await this.update()
      if (this.assignmentVerified) {
        // remove verified timestamp
        this.currentAssignment.verified = null
        // remove stipend_verified timestamp
        this.currentAssignment.stipend_verified = null
        // add edited timestamp
        this.currentAssignment.edited = this.$moment().format('YYYY-MM-DD HH:mm:ss')
      }
      this.saveCurrentState(this.currentAssignment)
      if (this.assignmentConfirmed) {
        this.$refs.lastTagInfo.initialize()
      }
      this.updating = false
    },

    verify: async function () {
      this.updating = true
      // add verified timestamp
      this.currentAssignment.verified = this.$moment().format('YYYY-MM-DD HH:mm:ss')
      if (this.assignmentEdited) {
        // remove edited timestamp
        this.currentAssignment.edited = null
      }
      if (this.stipendVerified && (this.currentState.stipend !== this.currentAssignment.stipend)) {
        // remove stipend_verified timestamp
        this.currentAssignment.stipend_verified = null
      }
      await this.update()
      this.saveCurrentState(this.currentAssignment)
      if (this.assignmentConfirmed) {
        this.$refs.lastTagInfo.initialize()
      }
      this.updating = false
    },

    revert: function () {
      this.currentAssignment = _.cloneDeep(this.currentState)
      this.saved = true
      this.stipendSaved = true
    },

    verifyStipend: async function () {
      this.updating = true
      // add stipend_verified timestamp
      this.currentAssignment.stipend_verified = this.$moment().format('YYYY-MM-DD HH:mm:ss')
      await this.updateStipend()
      this.saveCurrentState(this.currentAssignment)
      this.$refs.lastTagInfo.initialize()
      this.updating = false
    },

    unSaveStipend: function () {
      this.stipendSaved = false
    },

    revertStipend: async function () {
      this.currentAssignment.stipend = _.clone(this.currentState.stipend)
      this.stipendSaved = true
    },

    /**
     * updates the current assignment
     */
    update: async function () {
      let data = this.returnChangedParams(this.currentAssignment)

      try {
        await nonCourseAssignmentService.updateNonCourseAssignment(this.currentAssignment.id, data)
        this.saved = true
        this.stipendSaved = true
      } catch (error) {
        this.displayErrors(error)
        console.log(error)
      }
    },

    /**
     * updates the current assignments stipend only
     */
    updateStipend: async function () {
      let data = {
        stipend: this.currentAssignment.stipend,
        stipend_verified: this.currentAssignment.stipend_verified
      }

      try {
        await nonCourseAssignmentService.updateNonCourseAssignment(this.currentAssignment.id, data)
        this.stipendSaved = true
      } catch (error) {
        this.displayErrors(error)
        console.log(error)
      }
    },

    /**
     * get tooltip text
     */
    disabledMessage (defaultMessage = null) {
      if (this.assignmentVerified) {
        return 'Click "Edit" to change a verified assignment.'
      } else if (this.assignmentConfirmed) {
        return 'Assignments cannot be edited while they are pending.'
      } else if (this.stipendDisabled) {
        return 'Click "Edit Stipend" to change a verified stipend.'
      } else {
        return defaultMessage
      }
    },

    deleteAssignment: async function () {
      await nonCourseAssignmentService.deleteNonCourseAssignment(this.currentAssignment.id)
      this.$emit('deleteAssignment', this.currentAssignment.id)
    }
  }
}
</script>
