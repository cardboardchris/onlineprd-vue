<template>
  <div>
    <b-row>
      <b-col>
        <h3 v-if="currentCourse.subject_id !== nonCourseSubjectId">
          {{ currentCourse.subject }} {{ course.number }} ({{ course.credit_hours }} credits)
        </h3>
        <h3 v-else-if="currentCourse.offerings.length > 0">
          Non-course related Assignments
        </h3>
      </b-col>
    </b-row>

    <div class="offerings-block">
      <transition-group name="fade">
        <offering-row
          v-for="(offering, index) in activeOfferings"
          :key="index"
          :offering="offering"
          :term-id="course.term_id"
          :form-options="formOptions"
          :user-can-verify="userCanVerify"
          :user-can-verify-stipend="userCanVerifyStipend"
          @deleteOffering="deleteOffering($event)"
        ></offering-row>
      </transition-group>
    </div>

    <b-row align-h="center">
      <b-col cols="auto">
        <b-button variant="outline-primary" @click="addOffering">
            <span v-if="currentCourse.subject_id && formOptions.subjects">Create new section of {{ getTextValueFromOptions(currentCourse.subject_id, formOptions.subjects) }} {{
              currentCourse.number }}</span>
          <span v-else>Create new section</span>
        </b-button>
      </b-col>
    </b-row>

  </div>
</template>

<script>
import OfferingRow from './OfferingRow'
import { Offering } from '@/models/offering'
import { SelectOptions } from '@/mixins/SelectOptionsMixin'
import { EventHandlerMixin } from '@/mixins/EventHandlerMixin'

export default {
  name: 'CourseRow',
  components: {
    OfferingRow
  },
  mixins: [SelectOptions, EventHandlerMixin],
  props: {
    course: Object,
    formOptions: Object,
    userCanVerify: Boolean,
    userCanVerifyStipend: Boolean,
    nonCourseSubjectId: Number
  },
  data () {
    return {
      currentCourse: {},
      subjectOptions: []
      // @TODO replace with CASL permissions check
    }
  },
  computed: {
    activeOfferings () {
      if (this.userCanVerify) {
        return this.currentCourse.offerings.filter((obj) => {
          return obj.confirmed !== null
        })
      } else {
        return this.currentCourse.offerings
      }
    },
    timeNow () {
      return this.$moment().format('YYYY-MM-DD HH:mm:ss')
    }
  },
  created () {
    this.initialize()
  },
  methods: {
    /**
     * set all the data variables from props
     */
    initialize: function () {
      this.currentCourse = this.$props.course
      // get subject text (abbreviation) from subjectOptions
      let subjectId = this.currentCourse.subject_id
      let subjectObject = this.$props.formOptions.subjects.find(function (obj) {
        return obj.value === subjectId
      })
      this.currentCourse.subject = subjectObject.text
      // console.log(this.currentCourse)
    },

    /**
     * creates a new offering with empty values in the courses object
     */
    addOffering: async function () {
      let newOffering = new Offering({})
      if (this.userCanVerify) {
        newOffering.confirmed = this.timeNow
      }
      newOffering.course_id = this.currentCourse.id
      this.currentCourse.offerings.push(newOffering)
    },

    deleteOffering: function (offeringId) {
      this.currentCourse.offerings = this.currentCourse.offerings.filter((offeringObject) => {
        return offeringObject.id !== offeringId
      })
    }
  }
}
</script>
