<template>
  <validation-observer v-if="!loading" ref="form" v-slot="{ handleSubmit }">
    <b-form @submit.prevent="handleSubmit(emitCourse)">
      <b-row>
        <b-col class="no-label-col">
          New Course:
        </b-col>

        <b-col>
          <b-form-group label="Subject">
            <validation-provider vid="subject_id" rules="required" v-slot="validationContext">
              <b-form-select :id="'course-' + uid + '-subject'"
                             :name="'course-' + uid + '-subject'"
                             :key="'course-' + uid + '-subject'"
                             v-model="currentCourse.subject_id"
                             :options="formOptions.subjects"
                             :aria-describedby="createUniqueId('subject-feedback')"
                             :state="getValidationState(validationContext)"
              >
              </b-form-select>
              <form-errors :id="createUniqueId('subject-feedback')" :errors="validationContext.errors"></form-errors>
            </validation-provider>
          </b-form-group>
        </b-col>

        <b-col>
          <b-form-group label="Number">
            <validation-provider vid="number" rules="required" v-slot="validationContext">
              <b-form-input type="text"
                            :key="'course-' + uid + '-number'"
                            :name="'course-' + uid + '-number'"
                            :id="'course-' + uid + '-number'"
                            property="number"
                            placeholder="000"
                            v-model="currentCourse.number"
                            :aria-describedby="createUniqueId('course-number-feedback')"
                            :state="getValidationState(validationContext)"
              >
              </b-form-input>
              <form-errors :id="createUniqueId('course-number-feedback')"
                           :errors="validationContext.errors"></form-errors>
            </validation-provider>
          </b-form-group>
        </b-col>

        <b-col>
          <b-form-group label="Credits">
            <validation-provider vid="credit_hours" rules="required" v-slot="validationContext">
              <b-form-input type="number"
                            :key="'course-' + uid + '-credits'"
                            :name="'course-' + uid + '-credits'"
                            :id="'course-' + uid + '-credits'"
                            property="credit_hours"
                            placeholder="0"
                            v-model="currentCourse.credit_hours"
                            :aria-describedby="createUniqueId('course-credits-feedback')"
                            :state="getValidationState(validationContext)"
              >
              </b-form-input>
              <form-errors :id="createUniqueId('course-credits-feedback')"
                           :errors="validationContext.errors"></form-errors>
            </validation-provider>
          </b-form-group>
        </b-col>

        <b-col>
          <b-form-group label="Term">
            <b-form-input type="text"
                          :key="'course-' + uid + '-term'"
                          :name="'course-' + uid + '-term'"
                          :id="'course-' + uid + '-term'"
                          :disabled=true
                          v-model="activeTerm.name">
            </b-form-input>
          </b-form-group>
        </b-col>

        <b-col md="2" class="no-label-col">
          <b-button type="submit" variant="success" :disabled="!courseReady">
            Save
          </b-button>
        </b-col>

      </b-row>
    </b-form>
  </validation-observer>
</template>

<script>
import { Course } from '../models/course'
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate'
import FormErrors from '../components/FormErrors'
import { required } from 'vee-validate/dist/rules'
import { FormHelperMixin } from '../mixins/FormHelperMixin'
import { EventHandlerMixin } from '../mixins/EventHandlerMixin'

export default {
  name: 'NewCourseFields',
  mixins: [EventHandlerMixin, FormHelperMixin],
  components: { FormErrors, ValidationProvider, ValidationObserver },
  props: {
    course: Object,
    formOptions: Object,
    activeTerm: Object,
    departmentId: Number
  },
  data () {
    return {
      currentCourse: new Course({}),
      uid: null,
      loading: true
    }
  },
  computed: {
    courseReady () {
      return !!(this.currentCourse.subject_id &&
        this.currentCourse.number &&
        this.currentCourse.credit_hours)
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
     * set the data variables from props
     */
    initialize () {
      this.uid = this._uid
      this.currentCourse.department_id = this.$props.departmentId
      this.currentCourse.term_id = this.$props.activeTerm.id

      this.loading = false
    },
    /**
     * sends the new course object to the parent component
     */
    emitCourse () {
      this.$emit('saveCourse', this.currentCourse)
    }
  }
}
</script>
