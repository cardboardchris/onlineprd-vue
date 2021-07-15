<template>
  <div>
    <loading-placeholder v-if="loading"></loading-placeholder>

    <b-card v-else :class="{ 'red-border': redBorder }">

      <b-overlay :show="updating" rounded="sm">

        <validation-observer v-if="!loading" ref="form" v-slot="{ handleSubmit }">
          <b-form @submit.prevent="handleSubmit(confirm)">
            <b-form-row align-h="between">
              <b-col>
                <h4>
                  Assignment:
                  <span v-if="saved && currentAssignment.user">
                {{ currentAssignment.user.first_name }} {{ currentAssignment.user.last_name }}
              </span>
                  <b-badge v-if="(!assignmentEdited && !assignmentVerified) && userCanVerify"
                           variant="warning">New
                  </b-badge>
                  <b-badge v-else-if="(assignmentEdited) && userCanVerify"
                           variant="warning">Edited
                  </b-badge>
                </h4>
              </b-col>

              <b-col cols="auto">
                <offering-assignment-buttons
                  :user-can-verify="userCanVerify"
                  :user-can-verify-stipend="userCanVerifyStipend"
                  type="assignment"
                  :parent-confirmed="parentConfirmed"
                  :parent-verified="parentVerified"
                  :complete="assignmentComplete"
                  :saved="saved"
                  :stipend-saved="stipendSaved"
                  :confirmed="assignmentConfirmed"
                  :verified="assignmentVerified"
                  :stipend-verified="stipendVerified"
                  :edited="assignmentEdited"
                  :notified="assignmentNotified"
                  :state-changed="stateChanged"
                  :stipend-changed="stipendChanged"
                  :inputs-disabled="inputsDisabled"
                  :updating="updating"
                  :uid="uid"
                  @showLetter="showLetter()"
                  @save="saveAssignment()"
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
                          @click="deleteAssignment">
                  <b-icon-trash-fill></b-icon-trash-fill>
                  Delete
                </b-button>
              </b-col>
            </b-form-row>

            <br>

            <b-row>
              <b-col cols="4">
                <b-form-group label="Position">
                  <span class="disabled-wrapper" :id="'disabled-position-input-wrapper-' + uid">
                    <validation-provider vid="subject_id" rules="required" v-slot="validationContext">
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
                        <b-form-input type="number"
                                      :id="'assignment-' + uid + '-hours_worked'"
                                      placeholder="0"
                                      v-model="currentAssignment.hours_worked"
                                      :disabled="inputsDisabled"
                                      :aria-describedby="createUniqueId('hours-worked-feedback')"
                                      :state="getValidationState(validationContext)"
                                      @change="unSave"
                        ></b-form-input>
                        <form-errors :id="createUniqueId('hours-worked-feedback')"
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
                                      :disabled="stipendDisabled || (!userCanVerify && inputsDisabled)"
                                      :aria-describedby="createUniqueId('stipend-feedback')"
                                      :state="getValidationState(validationContext)"
                                      @change="unSaveStipend"
                        ></b-form-input>
                      </b-input-group>
                      <form-errors :id="createUniqueId('stipend-feedback')"
                                   :errors="validationContext.errors"></form-errors>
                    </validation-provider>
                  </span>
                  <b-tooltip v-if="stipendDisabled"
                             :target="'disabled-stipend-input-wrapper-' + uid">
                    {{ disabledMessage() }}
                  </b-tooltip>
                </b-form-group>
              </b-col>

              <b-col class="no-label-col">
                <stipend-buttons
                  v-if="assignmentVerified"
                  :user-can-verify="userCanVerify"
                  :user-can-verify-stipend="userCanVerifyStipend"
                  :edited="assignmentEdited"
                  :stipend-saved="stipendSaved"
                  :parent-verified="parentVerified"
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

            <!-- last tag info & employee status check -->
            <b-row align-h="between">
              <b-col cols="auto">
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

            <!-- comments -->
            <comments
              :comments="currentAssignment.comments"
              :uid="uid"
              :parent-id="currentAssignment.id"
              parent-type="assignment"
              :user-id="currentUser.id"
            ></comments>
          </b-form>
        </validation-observer>
      </b-overlay>
    </b-card>

    <b-modal
      v-if="currentAssignment.user"
      :id="'check-employee-modal-' + uid"
      size="xl"
      v-model="modalCheckEmployeeShow"
      :title="currentAssignment.user.first_name + ' ' + currentAssignment.user.last_name + '\'s Assignments'"
      :ok-only="true"
      ok-title="Close"
    >
      <user-assignments-status
        :term-id="termId"
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

    <b-modal
      :id="'sent-letter-modal-' + uid"
      size="xl"
      v-model="modalLetterShow"
      title="Sent Letter"
      :ok-only="true"
      ok-title="Close"
      v-if="!loading && currentAssignment.user"
    >
      <saved-appointment-letter
        :term-id="termId"
        :user-id="currentAssignment.user.id"
        :assignment-id="currentAssignment.id"
      ></saved-appointment-letter>
    </b-modal>
  </div>
</template>

<script>
import OfferingAssignmentButtons from './OfferingAssignmentButtons'
import LoadingPlaceholder from './LoadingPlaceholder'
import OfferingAssignmentLastTagInfo from './OfferingAssignmentLastTagInfo'
import StipendButtons from './StipendButtons'
import UserSearch from './UserSearch'
import Comments from './Comments'
import UserAssignmentsStatus from './UserAssignmentsStatus'
import FormErrors from '../components/FormErrors'
import SavedAppointmentLetter from '@/components/SavedAppointmentLetter'
import { FormHelperMixin } from '@/mixins/FormHelperMixin'
import { EventHandlerMixin } from '@/mixins/EventHandlerMixin'
import { assignmentService } from '@/services/assignment.service'
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate'
import { required } from 'vee-validate/dist/rules'

export default {
  name: 'AssignmentRow',
  components: {
    LoadingPlaceholder,
    OfferingAssignmentButtons,
    StipendButtons,
    OfferingAssignmentLastTagInfo,
    UserSearch,
    UserAssignmentsStatus,
    Comments,
    FormErrors,
    SavedAppointmentLetter,
    ValidationProvider,
    ValidationObserver
  },
  mixins: [FormHelperMixin, EventHandlerMixin],
  props: {
    termId: Number,
    formOptions: Object,
    assignment: Object,
    userCanVerify: Boolean,
    userCanVerifyStipend: Boolean,
    parentConfirmed: Boolean,
    parentVerified: Boolean
  },
  data () {
    return {
      currentAssignment: {},
      redBorder: false,
      saved: false,
      stipendSaved: true,
      modalAddEmployeeShow: false,
      modalCheckEmployeeShow: false,
      modalLetterShow: false,
      loading: true,
      updating: false,
      uid: null
    }
  },
  computed: {
    assignmentComplete () {
      return !!(this.currentAssignment.user_id &&
        this.currentAssignment.position_id &&
        this.currentAssignment.hours_worked &&
        this.currentAssignment.stipend &&
        this.currentAssignment.eclass_id)
    },
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
    assignmentNotified () {
      return this.currentAssignment.notified !== null
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
    initialize: function () {
      this.currentAssignment = _.cloneDeep(this.$props.assignment)
      if (this.currentAssignment.id) {
        this.saved = true
      }
      this.saveCurrentState(this.currentAssignment)
      this.uid = this._uid

      this.loading = false
    },

    addEmployee: function (user) {
      this.currentAssignment.user = user
      this.currentAssignment.user_id = user.id
      this.$bvModal.hide('add-employee-modal-' + this.uid)
      this.unSave()
    },

    confirm: async function () {
      this.currentAssignment.confirmed = this.timeNow
      await this.updateAssignment()
    },

    unSave: function () {
      this.saved = false
      this.stipendSaved = false
    },

    saveAssignment: async function () {
      this.updating = true
      if (this.assignmentVerified) {
        // remove verified timestamp
        this.currentAssignment.verified = null
        // remove stipend_verified timestamp
        this.currentAssignment.stipend_verified = null
        // add edited timestamp
        this.currentAssignment.edited = this.timeNow
      }
      await this.updateAssignment()
      this.saveCurrentState(this.currentAssignment)
      if (this.assignmentConfirmed) {
        this.$refs.lastTagInfo.initialize()
      }
      this.updating = false
    },

    verify: async function () {
      this.updating = true
      // add verified timestamp
      this.currentAssignment.verified = this.timeNow
      if (this.assignmentEdited) {
        // remove edited timestamp
        this.currentAssignment.edited = null
      }
      if (this.stipendVerified && (this.currentState.stipend !== this.currentAssignment.stipend)) {
        // remove stipend_verified timestamp
        this.currentAssignment.stipend_verified = null
      }
      await this.updateAssignment()
      this.saveCurrentState(this.currentAssignment)
      if (this.assignmentConfirmed) {
        this.$refs.lastTagInfo.initialize()
      }
      this.saved = true
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
      this.currentAssignment.stipend_verified = this.timeNow
      await this.updateStipend()
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
     * updates the current assignment in db
     */
    updateAssignment: async function () {
      let data = this.returnChangedParams(this.currentAssignment)

      try {
        await assignmentService.updateAssignment(this.currentAssignment.id, data)
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
        await assignmentService.updateAssignment(this.currentAssignment.id, data)
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

    showLetter: function () {
      this.modalLetterShow = true
    },

    deleteAssignment: async function () {
      this.$emit('deleteAssignment', this.currentAssignment.id)
    }
  }
}
</script>
