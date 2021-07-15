<template>
  <div class="department-details" v-if="$can('read', subject.DEPARTMENTS)">
    <LoadingPlaceholder v-if="loading"></LoadingPlaceholder>
    <p v-if="failedToLoad">Item does not exist.</p>
    <ValidationObserver ref="form" v-slot="{ handleSubmit }">
      <b-form @submit.prevent="handleSubmit(onSubmit)" v-if="!loading && !failedToLoad">

        <b-alert :show="stateChanged" variant="danger">You have unsaved changes. Click Save below.</b-alert>

        <b-row>
          <b-col>
            <b-form-group
                :id="createUniqueId('input-group-org')"
                label="Org Number (required):"
                :label-for="createUniqueId('org')"
            >
              <validation-provider vid="org_number" rules="required" v-slot="validationContext">
                <b-form-input
                    :id="createUniqueId('org')"
                    v-model="department.org_number"
                    :required="true"
                    placeholder="Enter org number"
                    :state="getValidationState(validationContext)"
                    :aria-describedby="createUniqueId('org-feedback')"
                    :disabled="!$can('update', subject.DEPARTMENTS)"
                ></b-form-input>
                <FormErrors :id="createUniqueId('org-feedback')" :errors="validationContext.errors"></FormErrors>
              </validation-provider>
            </b-form-group>
          </b-col>

          <b-col>
            <b-form-group
                :id="createUniqueId('input-group-name')"
                label="Department Name (required):"
                :label-for="createUniqueId('name')"
            >
              <validation-provider vid="name" rules="required" v-slot="validationContext">
                <b-form-input
                    :id="createUniqueId('name')"
                    v-model="department.name"
                    required
                    placeholder="Enter first name"
                    :state="getValidationState(validationContext)"
                    :aria-describedby="createUniqueId('name-feedback')"
                    :disabled="!$can('update', subject.DEPARTMENTS)"
                ></b-form-input>
                <FormErrors :id="createUniqueId('name-feedback')" :errors="validationContext.errors"></FormErrors>
              </validation-provider>
            </b-form-group>
          </b-col>

          <b-col>
            <b-form-group
                :id="createUniqueId('input-group-abbreviation')"
                label="Abbreviation (required):"
                :label-for="createUniqueId('abbreviation')"
            >
              <validation-provider vid="abbreviation" rules="required" v-slot="validationContext">
                <b-form-input
                    :id="createUniqueId('abbreviation')"
                    v-model="department.abbreviation"
                    required
                    placeholder="Enter abbreviation"
                    :state="getValidationState(validationContext)"
                    :aria-describedby="createUniqueId('abbreviation-feedback')"
                    :disabled="!$can('update', subject.DEPARTMENTS)"
                ></b-form-input>
                <FormErrors :id="createUniqueId('abbreviation-feedback')" :errors="validationContext.errors"></FormErrors>
              </validation-provider>
            </b-form-group>
          </b-col>
        </b-row>

        <b-row>

          <b-col>
            <b-form-group
                :id="createUniqueId('input-group-building')"
                label="Department building:"
                :label-for="createUniqueId('building')"
            >
              <validation-provider vid="department_building" v-slot="validationContext">
                <b-form-input
                    :id="createUniqueId('building')"
                    v-model="department.department_building"
                    placeholder="Enter department building"
                    :state="getValidationState(validationContext)"
                    :aria-describedby="createUniqueId('building-feedback')"
                    :disabled="!$can('update', subject.DEPARTMENTS)"
                ></b-form-input>
                <FormErrors :id="createUniqueId('building-feedback')" :errors="validationContext.errors"></FormErrors>
              </validation-provider>
            </b-form-group>
          </b-col>

          <b-col>
            <b-form-group
                :id="createUniqueId('input-group-office-number')"
                label="Department office number:"
                :label-for="createUniqueId('office-number')"
            >
              <validation-provider vid="department_office_number" v-slot="validationContext">
                <b-form-input
                    :id="createUniqueId('office-number')"
                    v-model="department.department_office_number"
                    placeholder="Enter office number"
                    :state="getValidationState(validationContext)"
                    :aria-describedby="createUniqueId('office-number-feedback')"
                    :disabled="!$can('update', subject.DEPARTMENTS)"
                ></b-form-input>
                <FormErrors :id="createUniqueId('office-number-feedback')" :errors="validationContext.errors"></FormErrors>
              </validation-provider>
            </b-form-group>
          </b-col>

          <b-col>
            <b-form-group
                :id="createUniqueId('input-group-phone-number')"
                label="Department phone number:"
                :label-for="createUniqueId('phone-number')"
            >
              <validation-provider vid="department_phone_number" v-slot="validationContext">
                <b-form-input
                    :id="createUniqueId('phone-number')"
                    v-model="department.department_phone_number"
                    placeholder="Enter phone number"
                    :state="getValidationState(validationContext)"
                    :aria-describedby="createUniqueId('phone-number-feedback')"
                    :disabled="!$can('update', subject.DEPARTMENTS)"
                ></b-form-input>
                <FormErrors :id="createUniqueId('phone-number-feedback')" :errors="validationContext.errors"></FormErrors>
              </validation-provider>
            </b-form-group>
          </b-col>
        </b-row>

        <b-row>
          <b-col>
            <b-form-group
                :id="createUniqueId('input-group-chair')"
                label="Department chair:"
                :label-for="createUniqueId('chair')"
            >
              <validation-provider vid="chair" v-slot="validationContext">
                <b-form-input
                    :id="createUniqueId('chair')"
                    v-model="department.chair"
                    placeholder="Enter department chair"
                    :state="getValidationState(validationContext)"
                    :aria-describedby="createUniqueId('chair-feedback')"
                    :disabled="!$can('update', subject.DEPARTMENTS)"
                ></b-form-input>
                <FormErrors :id="createUniqueId('chair-feedback')" :errors="validationContext.errors"></FormErrors>
              </validation-provider>
            </b-form-group>
          </b-col>

          <b-col>
            <b-form-group
                :id="createUniqueId('input-group-college')"
                label="College:"
                :label-for="createUniqueId('college')"
            >
              <validation-provider vid="college_id" v-slot="validationContext">
                <b-form-select
                    :id="createUniqueId('college')"
                    v-model="department.college_id"
                    :options="collegeOptions"
                    :state="getValidationState(validationContext)"
                    :aria-describedby="createUniqueId('college-feedback')"
                    :disabled="!$can('update', subject.USERS)"
                ></b-form-select>
                <FormErrors :id="createUniqueId('college-feedback')" :errors="validationContext.errors"></FormErrors>
              </validation-provider>
            </b-form-group>
          </b-col>

          <b-col>
            <p>Department Contact:<br>
              <span v-if="department.contact_user_id">
              {{department.contact_user.first_name}} {{department.contact_user.last_name}}<br>
              <a :href="`mailto:${department.contact_user.email}`">{{department.contact_user.email}}</a>
              </span>
              <UserSelectButton
                  :user_id="department.contact_user_id"
                  removal_confirm_message="Please confirm that you want to remove this contact from the department."
                  add_button_text="Add Contact"
                  remove_button_text="Remove Contact"
                  v-on:update:user="updateContactUser"
                  v-on:deleted:user="removeContactUser"
                  v-on:error="displayErrors"
                  v-on:created:user="userCreated"
              ></UserSelectButton>
            </p>
          </b-col>
        </b-row>

        <b-row v-if="department.id === null">
          <b-col>
            <b-alert variant="warning" :show="true">Note: You must first create a department before you can Schedulers and Approvers.</b-alert>
          </b-col>
        </b-row>
        <b-row v-else>
          <b-col>
            <div class="department-schedulers">
              <p>Schedulers:</p>
              <user-department-details
                  :department_id="department.id"
                  :role_id="4"
                  v-on:created:department-user-role="displaySuccess('The user was successfully added to the department')"
                  v-on:deleted:department-user-role="displaySuccess('The user was successfully deleted from the department')"
                  v-on:message="displaySuccess($event)"
                  v-on:error="displayErrors"
              ></user-department-details>
            </div>
          </b-col>
          <b-col>
            <div class="department-approvers">
              <p>Approvers:</p>
              <user-department-details
                  :department_id="department.id"
                  :role_id="3"
                  v-on:created:department-user-role="displaySuccess('The user was successfully added to the department')"
                  v-on:deleted:department-user-role="displaySuccess('The user was successfully deleted from the department')"
                  v-on:message="displaySuccess($event)"
                  v-on:error="displayErrors"
              ></user-department-details>
            </div>
          </b-col>
        </b-row>

        <div class="save-btn-wrapper">
          <b-overlay
              v-if="$can('update', subject.DEPARTMENTS) || $can('create', subject.DEPARTMENTS)"
              :show="wait"
              :rounded="true"
              opacity="0.6"
              :spinner-small="true"
              spinner-variant="primary"
              class="d-inline-block"
          >
            <b-button type="submit" variant="primary" :disabled="saving || !stateChanged">
              Save
            </b-button>
          </b-overlay>
          <b-overlay
              v-if="$can('delete', subject.DEPARTMENTS) && department.id !== null"
              :show="wait"
              :rounded="true"
              opacity="0.6"
              :spinner-small="true"
              spinner-variant="primary"
              class="d-inline-block"
          >
            <b-button variant="danger" class="delete-btn" @click="confirmDelete">
              <b-icon-trash></b-icon-trash> Delete
            </b-button>
          </b-overlay>
        </div>
      </b-form>
    </ValidationObserver>
  </div>
</template>

<script>

import LoadingPlaceholder from './LoadingPlaceholder'
import FormErrors from './FormErrors'
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate'
import { required } from 'vee-validate/dist/rules'
import { FormHelperMixin } from '@/mixins/FormHelperMixin'
import { PermissionSubject } from '@/permission-subject'
import { BIconTrash } from 'bootstrap-vue'
import { Department } from '@/models/department'
import { departmentService } from '@/services/department.service'
import { lookupFieldsService } from '@/services/lookupFields.service'
import UserDepartmentDetails from './UserDepartmentDetails'
import UserSelectButton from '@/components/UserSelectButton'
import { EventHandlerMixin } from '@/mixins/EventHandlerMixin'

export default {
  name: 'DepartmentDetails',
  components: { UserSelectButton, UserDepartmentDetails, LoadingPlaceholder, FormErrors, ValidationProvider, ValidationObserver, BIconTrash },
  mixins: [FormHelperMixin, EventHandlerMixin],
  props: ['id'],
  data: function () {
    return {
      subject: PermissionSubject,
      department: new Department({}),
      failedToLoad: false,
      collegeOptions: [],
      modalSchedulerShow: false,
      modalApproverShow: false
    }
  },
  mounted: function () {
    this.saveCurrentState(this.department)

    if (this.id !== null) {
      this.init()
    }

    extend('required', {
      ...required,
      message: 'This field is required.'
    })
  },
  methods: {
    init: async function () {
      try {
        const optionsResponse = await lookupFieldsService.getLookupFields({
          field: 'college'
        })

        this.collegeOptions = this.formatOptionsForLookupFields(optionsResponse.data.form_field_lookups, '- select college -')

        // if id is set, attempt to get department
        if (this.id) {
          await this.getDepartment()
        }

        this.$emit('loaded:department', this.department)

        this.toggleLoading()
      } catch (error) {
        this.$emit('error', error)
      }
    },

    getDepartment: async function () {
      const response = await departmentService.getDepartments({
        id: this.id,
        with: 'contactUser'
      })

      if (response.data.departments[0]) {
        this.department = response.data.departments[0]
        this.saveCurrentState(this.department)
      } else {
        this.failedToLoad = true
      }
    },

    onSubmit: async function () {
      // return new properties that changed from previous state
      let params = this.returnChangedParams(this.department)

      this.toggleWait()

      try {
        if (this.department.id === null) {
          const response = await departmentService.createDepartment(params)
          this.department.id = response.data.department.id
          this.$emit('created:department', this.department)
        } else {
          await departmentService.updateDepartment(this.department.id, params)
          this.$emit('update:department', this.department)
        }

        this.saveCurrentState(this.department)
        this.toggleWait()
      } catch (error) {
        if (error.response.data.error) {
          this.$refs.form.setErrors(error.response.data.error)
        }
        this.toggleWait()
        this.$emit('error', error)
      }
    },

    confirmDelete: function () {
      this.$bvModal.msgBoxConfirm('Please confirm that you want to delete the Department "' + this.department.name + '".', {
        title: 'Please Confirm',
        size: 'sm',
        buttonSize: 'sm',
        okVariant: 'danger',
        okTitle: 'YES',
        cancelTitle: 'NO',
        footerClass: 'p-2',
        hideHeaderClose: false,
        centered: true
      })
        .then(value => {
          if (value === true) {
            this.deleteDepartment()
          }
        })
        .catch(err => {
          this.$emit('error', err)
        })
    },

    deleteDepartment: async function () {
      this.toggleWait()
      try {
        const response = await departmentService.deleteDepartment(this.id)
        this.toggleWait()
        this.$emit('deleted:department', response)
      } catch (error) {
        this.toggleWait()
        this.$emit('error', error)
      }
    },

    updateContactUser: function (user) {
      this.department.contact_user_id = user.id
      this.department.contact_user = {}
      this.department.contact_user.id = user.id
      this.department.contact_user.first_name = user.first_name
      this.department.contact_user.last_name = user.last_name
      this.department.contact_user.email = user.email
    },

    removeContactUser: function () {
      this.department.contact_user_id = null
      this.department.contact_user = {}
    },

    userCreated: function (user) {
      this.displaySuccess('User (' + user.first_name + ' ' + user.last_name + ') created successfully.')
    }
  }, // methods

  computed: {
    stateChanged: function () {
      return this.didStateChange(this.department)
    }
  }
}

</script>

<style scoped>
  .save-btn-wrapper {
    margin-bottom: 20px;
  }

  .department-schedulers {
    margin-bottom: 40px;
  }

  .schedulers-table thead {
    display: none;
  }

  .delete-btn {
    margin-left: 5px;
  }
</style>
