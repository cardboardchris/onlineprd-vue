<template>
  <div class="user-details" v-if="$can('read', subject.USERS)">
    <LoadingPlaceholder v-if="loading"></LoadingPlaceholder>
    <p v-if="failedToLoad">Item does not exist.</p>
    <ValidationObserver ref="form" v-slot="{ handleSubmit }">
      <b-form @submit.prevent="handleSubmit(onSubmit)" v-if="!loading && !failedToLoad">

      <b-alert :show="Number(user.verified) === 0 && Number(user.id) !== 0 && $can('update', subject.USERS)" variant="danger">
        User's information has not been verified
      </b-alert>

      <b-row>
        <b-col>
          <b-form-group
            :id="createUniqueId('input-group-prefix')"
            label="Prefix:"
            :label-for="createUniqueId('prefix')"
          >
            <validation-provider vid="prefix_id" v-slot="validationContext">
              <b-form-select
                :id="createUniqueId('prefix')"
                v-model="user.prefix_id"
                :options="prefixOptions"
                :state="getValidationState(validationContext)"
                :aria-describedby="createUniqueId('prefix-feedback')"
              ></b-form-select>
              <FormErrors :id="createUniqueId('prefix-feedback')" :errors="validationContext.errors"></FormErrors>
            </validation-provider>
          </b-form-group>
        </b-col>

        <b-col>
          <b-form-group
            :id="createUniqueId('input-group-first-name')"
            label="First Name (required):"
            :label-for="createUniqueId('first_name')"
          >
            <validation-provider vid="first_name" rules="required" v-slot="validationContext">
              <b-form-input
                :id="createUniqueId('first_name')"
                v-model="user.first_name"
                placeholder="Enter first name"
                :state="getValidationState(validationContext)"
                :aria-describedby="createUniqueId('first-name-feedback')"
              ></b-form-input>
              <FormErrors :id="createUniqueId('first-name-feedback')" :errors="validationContext.errors"></FormErrors>
            </validation-provider>
          </b-form-group>
        </b-col>

        <b-col>
          <b-form-group
            :id="createUniqueId('input-group-last-name')"
            label="Last Name (required):"
            :label-for="createUniqueId('last_name')"
          >
            <validation-provider vid="last_name" rules="required" v-slot="validationContext">
              <b-form-input
                :id="createUniqueId('last_name')"
                v-model="user.last_name"
                placeholder="Enter last name"
                :state="getValidationState(validationContext)"
                :aria-describedby="createUniqueId('last-name-feedback')"
              ></b-form-input>
              <FormErrors :id="createUniqueId('last-name-feedback')" :errors="validationContext.errors"></FormErrors>
            </validation-provider>
          </b-form-group>
        </b-col>
      </b-row>

      <b-row>
        <b-col>
          <b-form-group
            :id="createUniqueId('input-group-email')"
            label="Email address (required):"
            :label-for="createUniqueId('email')"
          >
            <validation-provider vid="email" rules="required" v-slot="validationContext">
              <b-form-input
                :id="createUniqueId('email')"
                v-model="user.email"
                placeholder="Enter email"
                :state="getValidationState(validationContext)"
                :aria-describedby="createUniqueId('email-feedback')"
              ></b-form-input>
              <FormErrors :id="createUniqueId('email-feedback')" :errors="validationContext.errors"></FormErrors>
            </validation-provider>
          </b-form-group>
        </b-col>

        <b-col>
          <b-form-group
            :id="createUniqueId('input-group-spartan-id')"
            label="Spartan Id (required):"
            :label-for="createUniqueId('spartan-id')"
          >
            <validation-provider vid="spartan_id" rules="required|spartan_id:880000000,889999999" v-slot="validationContext">
              <b-form-input
                :id="createUniqueId('spartan-id')"
                type="number"
                v-model.number="user.spartan_id"
                placeholder="Enter Spartan Id"
                :state="getValidationState(validationContext)"
                :aria-describedby="createUniqueId('spartan-id-feedback')"
              ></b-form-input>
              <FormErrors :id="createUniqueId('spartan-id-feedback')" :errors="validationContext.errors"></FormErrors>
            </validation-provider>
          </b-form-group>
        </b-col>

        <b-col>
          <b-form-group
              :id="createUniqueId('input-group-eclass')"
              label="eClass:"
              :label-for="createUniqueId('eclass')"
          >
            <validation-provider vid="eclass_id" v-slot="validationContext">
              <b-form-select
                  :id="createUniqueId('eclass')"
                  v-model="user.eclass_id"
                  :options="eclassOptions"
                  :state="getValidationState(validationContext)"
                  :aria-describedby="createUniqueId('eclass-feedback')"
              ></b-form-select>
              <FormErrors :id="createUniqueId('eclass-feedback')" :errors="validationContext.errors"></FormErrors>
            </validation-provider>
          </b-form-group>
        </b-col>
      </b-row>

      <b-form-group
          v-if="$can('update', subject.USERS)"
          :id="createUniqueId('input-group-verified')"
          label="Verified:"
          :label-for="createUniqueId('verified')"
      >
        <validation-provider vid="verified" v-slot="validationContext">
          <b-form-select
              :id="createUniqueId('verified')"
              v-model="user.verified"
              :options="verifiedOptions"
              :state="getValidationState(validationContext)"
              :aria-describedby="createUniqueId('verified-feedback')"
          ></b-form-select>
          <FormErrors :id="createUniqueId('verified-feedback')" :errors="validationContext.errors"></FormErrors>
        </validation-provider>
      </b-form-group>

      <b-form-group
          v-if="$can('update', subject.ROLES)"
          id="createUniqueId('input-group-roles')"
          label="Role(s):"
          :label-for="createUniqueId('roles')"
      >
        <b-card
            class="roles"
            :header="showUserRoles"
        >
          <b-form-checkbox-group
              :id="createUniqueId('roles')"
              class="roles-choices"
              v-model="user.roles"
              :options="roleOptions"
              multiple
              stacked
          ></b-form-checkbox-group>
        </b-card>
      </b-form-group>

      <div class="save-btn-wrapper">
        <b-overlay
            :show="saving"
            :rounded="true"
            opacity="0.6"
            spinner-small
            spinner-variant="primary"
            class="d-inline-block"
        >
          <b-button type="submit" variant="primary" :disabled="saving || !stateChanged">
            Save
          </b-button>
        </b-overlay>
      </div>
    </b-form>
    </ValidationObserver>
  </div>
</template>

<script>

import { userService } from '@/services/user.service'
import { lookupFieldsService } from '@/services/lookupFields.service'
import LoadingPlaceholder from './LoadingPlaceholder'
import FormErrors from './FormErrors'
import { rolesService } from '@/services/roles.service'
import { User } from '@/models/user'
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate'
import { required, email, between } from 'vee-validate/dist/rules'
import { FormHelperMixin } from '@/mixins/FormHelperMixin'
import { PermissionSubject } from '@/permission-subject'
import { eClassesService } from '@/services/eclasses.service'

export default {
  name: 'UserDetails',
  components: { LoadingPlaceholder, FormErrors, ValidationProvider, ValidationObserver },
  mixins: [FormHelperMixin],
  props: ['id', 'name'],
  data: function () {
    return {
      subject: PermissionSubject,
      user: new User({}),
      prefixOptions: [],
      departmentOptions: [],
      roleOptions: [],
      eclassOptions: [],
      verifiedOptions: [
        { value: 0, text: 'User\'s information has not been verified' },
        { value: 1, text: 'Verified User' }
      ],
      failedToLoad: false
    }
  },
  mounted: function () {
    this.saveCurrentState(this.user)

    if (this.id !== null) {
      this.init()
    }

    extend('required', {
      ...required,
      message: 'This field is required.'
    })

    extend('email', {
      ...email,
      message: 'This field must be a valid email.'
    })

    extend('spartan_id', {
      ...between,
      message: 'The spartan ID must be between 880000000 and 889999999'
    })
  },
  methods: {
    init: async function () {
      try {
        const optionsResponse = await lookupFieldsService.getLookupFields({
          field: 'prefix'
        })

        this.prefixOptions = this.formatOptionsForLookupFields(optionsResponse.data.form_field_lookups, '- Select prefix -')

        const rolesResponse = await rolesService.getRoles()

        // format for checkbox options
        this.roleOptions = rolesResponse.data.roles.map((field) => {
          return { value: field.id, text: field.name }
        })

        // get eclasses
        const eclassesResponse = await eClassesService.getEClasses()

        // format for checkbox options
        this.eclassOptions = eclassesResponse.data.eclasses.map((field) => {
          return { value: field.id, text: field.description }
        })

        this.eclassOptions.unshift({ value: '', text: '- Select eClass-' })

        // if id is set, attempt to get user
        if (this.id) {
          await this.getUser()
        }

        this.$emit('loaded:user', this.user)

        this.toggleLoading()
      } catch (error) {
        this.$emit('error', error)
      }
    },

    getUser: async function () {
      // get user with departments
      const response = await userService.getUsers({
        id: this.id,
        with: 'roles'
      })

      if (response.data.users[0]) {
        this.user = response.data.users[0]

        // get selected user's roles by id for select options
        this.user.roles = this.user.roles.map(d => d.id)
        this.saveCurrentState(this.user)
      } else {
        this.failedToLoad = true
      }
    },

    onSubmit: async function () {
      // return new properties that changed from previous state
      let params = this.returnChangedParams(this.user)

      this.toggleSaving()

      // if role property is present, discard, and get role ids from model to format for the backend
      if (params.hasOwnProperty('roles')) {
        params.roles = this.user.roles.join(',')
      }

      try {
        if (this.user.id === null) {
          const response = await userService.createUser(params)
          this.user.id = response.data.user.id
          this.$emit('created:user', response.data.user)
        } else {
          const response = await userService.updateUser(this.user.id, params)
          this.$emit('saved:user', response.data.user)
          this.$emit('update:user', response.data.user)
        }

        this.saveCurrentState(this.user)
        this.toggleSaving()
      } catch (error) {
        if (error.hasOwnProperty('response') && error.response.hasOwnProperty('data') && error.response.data.hasOwnProperty('error')) {
          this.$refs.form.setErrors(error.response.data.error)
        }
        this.toggleSaving()
        this.$emit('error', error)
      }
    }
  }, // methods

  computed: {
    stateChanged: function () {
      return this.didStateChange(this.user)
    },

    showUserRoles: function () {
      let roleIds = this.user.roles

      let roles = this.roleOptions.filter(function (role) {
        return roleIds.indexOf(role.value) !== -1
      })

      return roles.map(role => role.text).join(', ')
    }
  }
}

</script>

<style scoped>
.save-btn-wrapper {
  margin-bottom: 20px;
}
</style>
