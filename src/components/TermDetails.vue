<template>
  <div class="term-details" v-if="$can('read', subject.TERMS)">
    <LoadingPlaceholder v-if="loading"></LoadingPlaceholder>
    <p v-if="failedToLoad">Item does not exist.</p>
    <ValidationObserver ref="form" v-slot="{ handleSubmit }">
      <b-form @submit.prevent="handleSubmit(onSubmit)" v-if="!loading && !failedToLoad">

        <b-row>
          <b-col>
            <b-form-group
              :id="createUniqueId('input-group-name')"
              label="Term Name (required):"
              :label-for="createUniqueId('name')"
            >
              <validation-provider vid="name" rules="required" v-slot="validationContext">
                <b-form-input
                  :id="createUniqueId('name')"
                  v-model="term.name"
                  required
                  placeholder="Enter first name"
                  :state="getValidationState(validationContext)"
                  :aria-describedby="createUniqueId('name-feedback')"
                  :disabled="!$can('update', subject.TERMS)"
                ></b-form-input>
                <form-errors :id="createUniqueId('name-feedback')" :errors="validationContext.errors"></form-errors>
              </validation-provider>
            </b-form-group>
          </b-col>

          <b-col>
            <b-form-group
              :id="createUniqueId('input-group-start-date')"
              label="Start Date (required)"
              :label-for="createUniqueId('start-date')"
            >
              <validation-provider vid="start_date" rules="required" v-slot="validationContext">
                <b-form-datepicker
                  :id="createUniqueId('start-date')"
                  v-model="term.start_date"
                  :state="getValidationState(validationContext)"
                  :aria-describedby="createUniqueId('start-date-feedback')"
                  required
                  :disabled="!$can('update', subject.TERMS)"
                ></b-form-datepicker>
                <form-errors :id="createUniqueId('start-date-feedback')" :errors="validationContext.errors"></form-errors>
              </validation-provider>
            </b-form-group>
          </b-col>

          <b-col>
            <b-form-group
              :id="createUniqueId('input-group-end-date')"
              label="End Date (required)"
              :label-for="createUniqueId('end-date')"
            >
              <validation-provider vid="end_date" rules="required" v-slot="validationContext">
                <b-form-datepicker
                  :id="createUniqueId('end-date')"
                  v-model="term.end_date"
                  :state="getValidationState(validationContext)"
                  :aria-describedby="createUniqueId('end-date-feedback')"
                  required
                  :disabled="!$can('update', subject.TERMS)"
                ></b-form-datepicker>
                <form-errors :id="createUniqueId('end-date-feedback')" :errors="validationContext.errors"></form-errors>
              </validation-provider>
            </b-form-group>
          </b-col>
        </b-row>

        <div class="save-btn-wrapper">
          <b-overlay
            v-if="$can('update', subject.TERMS) || $can('create', subject.TERMS)"
            :show="wait"
            rounded
            opacity="0.6"
            spinner-small
            spinner-variant="primary"
            class="d-inline-block"
          >
            <b-button type="submit" variant="primary" :disabled="saving || !stateChanged">
              Save
            </b-button>
          </b-overlay>
          <b-overlay
            v-if="$can('delete', subject.TERMS) && term.id !== null"
            :show="wait"
            rounded
            opacity="0.6"
            spinner-small
            spinner-variant="primary"
            class="d-inline-block"
          >
            <b-button variant="danger" @click="confirmDelete">
              <b-icon-trash></b-icon-trash>
              Delete
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
import { termsService } from '../services/terms.service'
import { Term } from '../models/term'
import { BIconTrash } from 'bootstrap-vue'

export default {
  name: 'TermDetails',
  components: { LoadingPlaceholder, FormErrors, ValidationProvider, ValidationObserver, BIconTrash },
  mixins: [FormHelperMixin],
  props: ['id'],
  data: function () {
    return {
      subject: PermissionSubject,
      term: new Term({}),
      failedToLoad: false
    }
  },
  mounted: function () {
    this.saveCurrentState(this.term)

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
        // if id is set, attempt to get term
        if (this.id) {
          await this.getTerm()
        }

        this.$emit('loaded:term', this.term)

        this.toggleLoading()
      } catch (error) {
        this.$emit('error', error)
      }
    },

    getTerm: async function () {
      const response = await termsService.getTerms({
        id: this.id
      })

      if (response.data.terms[0]) {
        this.term = response.data.terms[0]
        this.saveCurrentState(this.term)
      } else {
        this.failedToLoad = true
      }
    },

    onSubmit: async function () {
      // return new properties that changed from previous state
      let params = this.returnChangedParams(this.term)

      this.toggleWait()

      try {
        if (this.term.id === null) {
          const response = await termsService.createTerm(params)
          this.term.id = response.data.term.id
          this.$emit('created:term', response.data.term)
        } else {
          const response = await termsService.updateTerm(this.term.id, params)
          this.$emit('update:term', response.data.term)
        }

        this.saveCurrentState(this.term)
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
      this.$bvModal.msgBoxConfirm('Please confirm that you want to delete the Term "' + this.term.name + '".', {
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
            this.deleteTerm()
          }
        })
        .catch(err => {
          alert(err)
        })
    },

    deleteTerm: async function () {
      this.toggleWait()
      try {
        const response = await termsService.deleteTerm(this.id)
        this.toggleWait()
        this.$emit('deleted:term', response.data.term)
      } catch (error) {
        this.toggleWait()
        this.$emit('error', error)
      }
    }
  }, // methods

  computed: {
    stateChanged: function () {
      return this.didStateChange(this.term)
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
