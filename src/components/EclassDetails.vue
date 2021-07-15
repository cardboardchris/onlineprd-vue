<template>
  <div class="eclass-details" v-if="$can('read', subject.ECLASSES)">
    <LoadingPlaceholder v-if="loading"></LoadingPlaceholder>
    <p v-if="failedToLoad">Item does not exist.</p>
    <ValidationObserver ref="form" v-slot="{ handleSubmit }">
      <b-form @submit.prevent="handleSubmit(onSubmit)" v-if="!loading && !failedToLoad">

        <b-row>
          <b-col>
            <b-form-group
                :id="createUniqueId('input-group-abbreviation')"
                label="Abbreviation (required):"
                :label-for="createUniqueId('abbreviation')"
            >
              <validation-provider vid="abbreviation" rules="required" v-slot="validationContext">
                <b-form-input
                    :id="createUniqueId('abbreviation')"
                    v-model="eclass.abbreviation"
                    placeholder="Enter abbreviation"
                    :state="getValidationState(validationContext)"
                    :aria-describedby="createUniqueId('abbreviation-feedback')"
                    :disabled="!$can('update', subject.ECLASSES)"
                ></b-form-input>
                <FormErrors :id="createUniqueId('abbreviation-feedback')" :errors="validationContext.errors"></FormErrors>
              </validation-provider>
            </b-form-group>
          </b-col>

          <b-col>
            <b-form-group
                :id="createUniqueId('input-group-description')"
                label="Description (required):"
                :label-for="createUniqueId('description')"
            >
              <validation-provider vid="description" rules="required" v-slot="validationContext">
                <b-form-input
                    :id="createUniqueId('description')"
                    v-model="eclass.description"
                    placeholder="Enter description"
                    :state="getValidationState(validationContext)"
                    :aria-describedby="createUniqueId('description-feedback')"
                    :disabled="!$can('update', subject.ECLASSES)"
                ></b-form-input>
                <FormErrors :id="createUniqueId('description-feedback')" :errors="validationContext.errors"></FormErrors>
              </validation-provider>
            </b-form-group>
          </b-col>
        </b-row>

        <b-row>
          <b-col>
            <b-form-group
                :id="createUniqueId('input-group-full_time')"
                label="Full Time, Yes or No (required):"
                :label-for="createUniqueId('full_time')"
            >
              <validation-provider vid="full_time" rules="required" v-slot="validationContext">
                <b-form-select
                    :id="createUniqueId('full_time')"
                    v-model="eclass.full_time"
                    :options="fullTimeOptions"
                    :state="getValidationState(validationContext)"
                    :aria-describedby="createUniqueId('full_time-feedback')"
                    :disabled="!$can('update', subject.ECLASSES)"
                ></b-form-select>
                <FormErrors :id="createUniqueId('full_time-feedback')" :errors="validationContext.errors"></FormErrors>
              </validation-provider>
            </b-form-group>
          </b-col>

          <b-col>
            <b-form-group
                :id="createUniqueId('input-group-category')"
                label="Category (required):"
                :label-for="createUniqueId('category')"
            >
              <validation-provider vid="category" rules="required" v-slot="validationContext">
                <b-form-select
                    :id="createUniqueId('category')"
                    v-model="eclass.category"
                    :options="categoryOptions"
                    :state="getValidationState(validationContext)"
                    :aria-describedby="createUniqueId('category-feedback')"
                    :disabled="!$can('update', subject.ECLASSES)"
                ></b-form-select>
                <FormErrors :id="createUniqueId('category-feedback')" :errors="validationContext.errors"></FormErrors>
              </validation-provider>
            </b-form-group>
          </b-col>

          <b-col>
            <b-form-group
                :id="createUniqueId('input-group-student')"
                label="Student (required):"
                :label-for="createUniqueId('student')"
            >
              <validation-provider vid="student" rules="required" v-slot="validationContext">
                <b-form-select
                    :id="createUniqueId('student')"
                    v-model="eclass.student"
                    :options="studentOptions"
                    :state="getValidationState(validationContext)"
                    :aria-describedby="createUniqueId('student-feedback')"
                    :disabled="!$can('update', subject.ECLASSES)"
                ></b-form-select>
                <FormErrors :id="createUniqueId('student-feedback')" :errors="validationContext.errors"></FormErrors>
              </validation-provider>
            </b-form-group>
          </b-col>

          <b-col>
            <b-form-group
                :id="createUniqueId('input-group-active')"
                label="Active or Inactive (required):"
                :label-for="createUniqueId('active')"
            >
              <validation-provider vid="active" rules="required" v-slot="validationContext">
                <b-form-select
                    :id="createUniqueId('active')"
                    v-model="eclass.active"
                    :options="activeOptions"
                    :state="getValidationState(validationContext)"
                    :aria-describedby="createUniqueId('active-feedback')"
                    :disabled="!$can('update', subject.ECLASSES)"
                ></b-form-select>
                <FormErrors :id="createUniqueId('active-feedback')" :errors="validationContext.errors"></FormErrors>
              </validation-provider>
            </b-form-group>
          </b-col>
        </b-row>

        <div class="save-btn-wrapper">
          <b-overlay
              v-if="$can('update', subject.ECLASSES) || $can('create', subject.ECLASSES)"
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
              v-if="$can('delete', subject.ECLASSES) && eclass.id !== null"
              :show="wait"
              :rounded="true"
              opacity="0.6"
              :spinner-small="true"
              spinner-variant="primary"
              class="d-inline-block"
          >
            <b-button variant="danger" @click="confirmDelete">
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
import { FormHelperMixin } from '../mixins/FormHelperMixin'
import { PermissionSubject } from '../permission-subject'
import { Eclass } from '../models/eclass'
import { BIconTrash } from 'bootstrap-vue'
import { eClassesService } from '../services/eclasses.service'

export default {
  name: 'EclassDetails',
  components: { LoadingPlaceholder, FormErrors, ValidationProvider, ValidationObserver, BIconTrash },
  mixins: [FormHelperMixin],
  props: ['id'],
  data: function () {
    return {
      subject: PermissionSubject,
      eclass: new Eclass({}),
      failedToLoad: false,
      categoryOptions: [
        { value: null, text: 'Select a category' },
        { value: 'ehra_faculty', text: 'ehra faculty' },
        { value: 'ehra_nonfaculty', text: 'ehra nonfaculty' },
        { value: 'shra', text: 'shra' },
        { value: 'student', text: 'student' }
      ],
      activeOptions: [
        { value: null, text: 'Select Active or Inactive' },
        { value: '1', text: 'Active' },
        { value: '0', text: 'Inactive' }
      ],
      fullTimeOptions: [
        { value: null, text: 'Select Yes or No for full time' },
        { value: '0', text: 'No' },
        { value: '1', text: 'Yes' }
      ],
      studentOptions: [
        { value: null, text: 'Select a student option' },
        { value: 'non-student', text: 'non-student' },
        { value: 'student', text: 'student' },
        { value: 'undergraduate', text: 'undergraduate' },
        { value: 'graduate', text: 'graduate' }
      ]
    }
  },
  mounted: function () {
    this.saveCurrentState(this.eclass)

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
        // if id is set, attempt to get eclass
        if (this.id) {
          await this.getEclass()
        }

        this.$emit('loaded:eclass', this.eclass)

        this.toggleLoading()
      } catch (error) {
        this.$emit('error', error)
      }
    },

    getEclass: async function () {
      const response = await eClassesService.getEClasses({
        id: this.id
      })

      if (response.data.eclasses[0]) {
        this.eclass = response.data.eclasses[0]
        this.saveCurrentState(this.eclass)
      } else {
        this.failedToLoad = true
      }
    },

    onSubmit: async function () {
      // return new properties that changed from previous state
      let params = this.returnChangedParams(this.eclass)

      this.toggleWait()

      try {
        if (this.eclass.id === null) {
          const response = await eClassesService.createEclass(params)
          this.eclass.id = response.data.eclass.id
          this.$emit('created:eclass', response.data.eclass)
        } else {
          const response = await eClassesService.updateEclass(this.eclass.id, params)
          this.$emit('update:eclass', response.data.eclass)
        }

        this.saveCurrentState(this.eclass)
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
      this.$bvModal.msgBoxConfirm('Please confirm that you want to delete the Eclass "' + this.eclass.description + '".', {
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
            this.deleteEclass()
          }
        })
        .catch(err => {
          alert(err)
        })
    },

    deleteEclass: async function () {
      this.toggleWait()
      try {
        const response = await eClassesService.deleteEclass(this.id)
        this.toggleWait()
        this.$emit('deleted:eclass', response.data.eclass)
      } catch (error) {
        this.toggleWait()
        this.$emit('error', error)
      }
    }
  }, // methods

  computed: {
    stateChanged: function () {
      return this.didStateChange(this.eclass)
    }
  }
}

</script>

<style scoped>
  .save-btn-wrapper {
    margin-bottom: 20px;
  }

  .btn-danger {
    margin-left: 5px;
  }
</style>
