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
          label="Part of Term Name (required):"
          :label-for="createUniqueId('name')"
        >
          <validation-provider vid="name" rules="required" v-slot="validationContext">
            <b-form-input
              :id="createUniqueId('name')"
              v-model="partOfTerm.name"
              required
              placeholder="Enter first name"
              :state="getValidationState(validationContext)"
              :aria-describedby="createUniqueId('name-feedback')"
              :disabled="!$can('update', subject.TERMS)"
            ></b-form-input>
            <FormErrors :id="createUniqueId('name-feedback')" :errors="validationContext.errors"></FormErrors>
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
                 v-model="partOfTerm.start_date"
                 :state="getValidationState(validationContext)"
                 :aria-describedby="createUniqueId('start-date-feedback')"
                 required
                 :disabled="!$can('update', subject.TERMS)"
            ></b-form-datepicker>
            <FormErrors :id="createUniqueId('start-date-feedback')" :errors="validationContext.errors"></FormErrors>
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
                v-model="partOfTerm.end_date"
                :state="getValidationState(validationContext)"
                :aria-describedby="createUniqueId('end-date-feedback')"
                required
                :disabled="!$can('update', subject.TERMS)"
            ></b-form-datepicker>
            <FormErrors :id="createUniqueId('end-date-feedback')" :errors="validationContext.errors"></FormErrors>
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
            v-if="$can('delete', subject.TERMS) && partOfTerm.id !== null"
            :show="wait"
            rounded
            opacity="0.6"
            spinner-small
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
import { PartOfTerm } from '../models/partofterm'
import { BIconTrash } from 'bootstrap-vue'
import { partsOfTermService } from '../services/partsOfTerm.service'

export default {
  name: 'PartOfTermDetails',
  components: { LoadingPlaceholder, FormErrors, ValidationProvider, ValidationObserver, BIconTrash },
  mixins: [FormHelperMixin],
  props: ['id', 'term_id'],
  data: function () {
    return {
      subject: PermissionSubject,
      partOfTerm: new PartOfTerm({}),
      failedToLoad: false
    }
  },
  mounted: function () {
    this.saveCurrentState(this.partOfTerm)

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
          await this.getPartOfTerm()
        }

        this.$emit('loaded:partOfTerm', this.partOfTerm)

        this.toggleLoading()
      } catch (error) {
        this.$emit('error', error)
      }
    },

    getPartOfTerm: async function () {
      const response = await partsOfTermService.getPartsOfTerm({
        id: this.id
      })

      if (response.data.parts_of_term[0]) {
        this.partOfTerm = response.data.parts_of_term[0]
        this.saveCurrentState(this.partOfTerm)
      } else {
        this.failedToLoad = true
      }
    },

    onSubmit: async function () {
      // return new properties that changed from previous state
      let params = this.returnChangedParams(this.partOfTerm)

      this.toggleWait()

      try {
        if (this.partOfTerm.id === null) {
          params.term_id = this.term_id
          const response = await partsOfTermService.createPartOfTerm(params)
          this.partOfTerm.id = response.data.part_of_term.id
          this.$emit('created:partOfTerm', response.data.part_of_term)
        } else {
          const response = await partsOfTermService.updatePartOfTerm(this.partOfTerm.id, params)
          this.$emit('update:partOfTerm', response.data.part_of_term)
        }

        this.saveCurrentState(this.partOfTerm)
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
      this.$bvModal.msgBoxConfirm('Please confirm that you want to delete the Part of Term "' + this.partOfTerm.name + '".', {
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
            this.deletePartOfTerm()
          }
        })
        .catch(err => {
          alert(err)
        })
    },

    deletePartOfTerm: async function () {
      this.toggleWait()
      try {
        const response = await partsOfTermService.deletePartOfTerm(this.id)
        this.toggleWait()
        this.$emit('deleted:partOfTerm', response)
      } catch (error) {
        this.toggleWait()
        this.$emit('error', error)
      }
    }
  }, // methods

  computed: {
    stateChanged: function () {
      return this.didStateChange(this.partOfTerm)
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
