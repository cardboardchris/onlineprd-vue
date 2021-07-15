<template>
  <div>
    <b-breadcrumb :items="breadcrumbs"></b-breadcrumb>

    <LoadingPlaceholder v-if="loading"></LoadingPlaceholder>

    <validation-observer v-else ref="form" v-slot="{ handleSubmit }">
      <b-form class="employee-profile-form" @submit.prevent="handleSubmit(updateUser)">

        <h3 class="text-center"><span v-if="employeeUserId === currentUser.id">My </span>Employee Profile<span
          v-if="(employeeUserId !== currentUser.id)">: {{ employee.first_name }} {{ employee.last_name }}</span>
        </h3>
        <b-row>
          <b-col cols="2">
            <b-form-group v-if="prefixOptions" label="Prefix">
              <validation-provider vid="prefix_id" rules="required" v-slot="validationContext">
                <b-form-select id="employee_prefix"
                               name="employee_prefix"
                               :aria-describedby="createUniqueId('prefix-feedback')"
                               :state="getValidationState(validationContext)"
                               v-model="employee.prefix_id"
                               :options="prefixOptions"
                               @change="unSave">
                </b-form-select>
                <form-errors :id="createUniqueId('prefix-feedback')" :errors="validationContext.errors"></form-errors>
              </validation-provider>
            </b-form-group>
          </b-col>

          <b-col>
            <b-form-group label="First Name">
              <b-input-group>
                <validation-provider vid="first_name" rules="required" v-slot="validationContext">
                <b-form-input type="text"
                              id="employee_first_name"
                              :aria-describedby="createUniqueId('first-name-feedback')"
                              :state="getValidationState(validationContext)"
                              placeholder="Firstname"
                              v-model="employee.first_name"
                              @keyup="unSave">
                </b-form-input>
                  <form-errors :id="createUniqueId('first-name-feedback')" :errors="validationContext.errors"></form-errors>
                </validation-provider>
              </b-input-group>
            </b-form-group>
          </b-col>

          <b-col>
            <b-form-group label="Last Name">
              <b-input-group>
                <validation-provider vid="last_name" rules="required" v-slot="validationContext">
                <b-form-input type="text"
                              id="employee_last_name"
                              :aria-describedby="createUniqueId('last-name-feedback')"
                              :state="getValidationState(validationContext)"
                              placeholder="Lastname"
                              v-model="employee.last_name"
                              @keyup="unSave">
                </b-form-input>
                  <form-errors :id="createUniqueId('last-name-feedback')" :errors="validationContext.errors"></form-errors>
                </validation-provider>
              </b-input-group>
            </b-form-group>
          </b-col>

          <b-col>
            <b-form-group v-if="$can('update', 'all')" label="UNCG Email">
              <b-input-group>
                <validation-provider vid="email" rules="required|email" v-slot="validationContext">
                <b-form-input type="email"
                              id="employee_uncg_email"
                              :aria-describedby="createUniqueId('email-feedback')"
                              :state="getValidationState(validationContext)"
                              placeholder="username"
                              v-model="employee.email"
                              @keyup="unSave">
                </b-form-input>
                  <form-errors :id="createUniqueId('email-feedback')" :errors="validationContext.errors"></form-errors>
                </validation-provider>
              </b-input-group>
            </b-form-group>
            <div v-else>
              <label>UNCG Email</label>
              <div class="form-control disabled-appearance"
                   v-b-tooltip.hover.bottom
                   title="only Schedulers may edit"
              >
                {{ employee.email }}
              </div>
            </div>
          </b-col>

          <b-col>
            <!-- show if user is a scheduler-->
            <b-form-group v-if="$can('update', 'all')" label="Spartan ID #">
              <b-input-group>
                <validation-provider vid="spartan_id" rules="required" v-slot="validationContext">
                <b-form-input type="number"
                              id="employee_spartan_id"
                              :aria-describedby="createUniqueId('spartan-id-feedback')"
                              :state="getValidationState(validationContext)"
                              placeholder="888888888"
                              maxlength="9"
                              v-model="employee.spartan_id"
                              @keyup="unSave">
                </b-form-input>
                  <form-errors :id="createUniqueId('spartan-id-feedback')" :errors="validationContext.errors"></form-errors>
                </validation-provider>
              </b-input-group>
            </b-form-group>
            <div v-else>
              <label>Spartan ID #</label>
              <div class="form-control disabled-appearance"
                   v-b-tooltip.hover.bottom
                   title="only Schedulers may edit"
              >
                {{ employee.spartan_id }}
              </div>
            </div>

          </b-col>
          <!-- /show if user is a scheduler -->

        </b-row>

        <b-row align-h="center" class="submit-row">

          <b-col cols="auto">
            <b-button v-if="!saved" variant="success" type="submit">Save</b-button>
            <label v-else class="button-spaced-label">Saved</label>
          </b-col>

        </b-row>
        <!-- /.justify-content-center submit-row -->

      </b-form>
    </validation-observer>

  </div>
</template>

<script>
import { userService } from '../services/user.service'
import { lookupFieldsService } from '../services/lookupFields.service'
import { SelectOptions } from '../mixins/SelectOptionsMixin'
import { BreadcrumbManager } from '../mixins/BreadcrumbManager'
import LoadingPlaceholder from '../components/LoadingPlaceholder'
import { EventHandlerMixin } from '../mixins/EventHandlerMixin'
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate'
import FormErrors from '../components/FormErrors'
import { required, email } from 'vee-validate/dist/rules'
import { FormHelperMixin } from '../mixins/FormHelperMixin'

export default {
  name: 'EmployeeProfileForm',
  mixins: [BreadcrumbManager, SelectOptions, EventHandlerMixin, FormHelperMixin],
  components: { LoadingPlaceholder, ValidationProvider, ValidationObserver, FormErrors },
  props: {
    user_id: String
  },
  data () {
    return {
      employee: {},
      prefixOptions: [],
      employeeUserId: null,
      userCanUpdate: true,
      loading: true,
      saved: true
    }
  },
  computed: {
    currentUser () {
      return this.$store.state.auth.user
    }
  },
  mounted () {
    extend('required', {
      ...required,
      message: 'This field is required.'
    })

    extend('email', {
      ...email,
      message: 'Please enter a valid email.'
    })

    this.initialize()
  },
  methods: {
    initialize: async function () {
      this.employeeUserId = Number(this.$props.user_id)

      try {
        // get user data from user table
        const response1 = await userService.getUserById(this.currentUser.id)
        this.employee.prefix_id = response1.data.user.prefix_id
        this.employee.first_name = response1.data.user.first_name
        this.employee.last_name = response1.data.user.last_name
        this.employee.email = response1.data.user.email
        this.employee.spartan_id = response1.data.user.spartan_id

        // get prefix options from lookup table
        const response2 = await lookupFieldsService.getLookupFields()
        let dataObject = response2.data.form_field_lookups
        this.prefixOptions = this.getOptions('field', 'prefix', dataObject)
        this.toggleLoading()
      } catch (error) {
        this.displayErrors(error)
        console.log(error)
      }
    },

    updateUser: async function () {
      try {
        await userService.updateUser(this.employeeUserId, this.employee)
        this.saved = true
      } catch (error) {
        this.displayErrors(error)
        console.log(error)
      }
    },

    unSave: function () {
      this.saved = false
    },

    toggleLoading () {
      this.loading = !this.loading
    }
  }
}
</script>
