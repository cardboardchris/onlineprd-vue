<template>
  <div>
    <b-breadcrumb :items="breadcrumbs"></b-breadcrumb>

    <LoadingPlaceholder v-if="loading"></LoadingPlaceholder>

    <div v-else>
      <course-row
        v-if="formOptions.subjects"
        :course="currentCourse"
        :form-options="formOptions"
        :nonCourseSubjectId="nonCourseSubjectId"
        :user-can-verify="userCanVerify"
      ></course-row>

    </div>
  </div>
</template>

<script>
import LoadingPlaceholder from '../components/LoadingPlaceholder'
import { lookupFieldsService } from '@/services/lookupFields.service'
import { courseService } from '@/services/course.service'
import { termsService } from '@/services/terms.service'
import { SelectOptions } from '@/mixins/SelectOptionsMixin'
import { BreadcrumbManager } from '@/mixins/BreadcrumbManager'
import { departmentService } from '@/services/department.service'
import { eClassesService } from '@/services/eclasses.service'
import CourseRow from '../components/CourseRow'
import { PermissionSubject } from '@/permission-subject'
import { EventHandlerMixin } from '@/mixins/EventHandlerMixin'
import { partsOfTermService } from '@/services/partsOfTerm.service'

export default {
  name: 'AssignmentsByCourse',
  components: {
    LoadingPlaceholder,
    CourseRow
  },
  mixins: [BreadcrumbManager, SelectOptions, EventHandlerMixin],
  props: {
    department_id: String,
    course_id: String,
    term_id: String
  },
  data () {
    return {
      subject: PermissionSubject,
      currentCourse: {
        id: null,
        subject_id: null,
        offerings: null
      },
      formOptions: {
        partsOfTerm: null,
        subjects: null,
        campuses: null,
        positions: null,
        eClasses: null,
        fullTimeEClassIds: []
      },
      nonCourseSubjectId: null,
      userCanVerify: false,
      loading: true,
      params: {
        with: 'offerings.comments.user,offerings.assignments.comments.user,offerings.assignments.user'
      }
    }
  },
  created () {
    this.initialize()
  },
  methods: {
    /**
     * make API calls to get saved data and form field options
     * set all the data variables from props
     */
    initialize: async function () {
      try {
        // get the department name for breadcrumbs
        const response1 = await departmentService.getDepartment(Number(this.$props.department_id))
        this.department = response1.data.department

        // get the active term
        const response2 = await termsService.getTermById(Number(this.$props.term_id))
        this.activeTerm = response2.data.term

        this.replaceBreadcrumb({
          find: 'Term loading...',
          replace: { text: this.activeTerm.name, to: { name: 'dashboard' }, params: { term_id: this.$props.term_id } }
        })

        // get part of term options from parts_of_term table
        const response3 = await partsOfTermService.getPartsOfTerm({ term_id: this.$props.term_id })
        let partsOfTermObject = response3.data.parts_of_term
        this.formOptions.partsOfTerm = this.getOptions('field', 'partOfTerm', partsOfTermObject, false)

        // get eclasses
        const response4 = await eClassesService.getEClasses()
        let eClassesObject = response4.data.eclasses
        this.formOptions.eClasses = this.formatOptions('eclass', eClassesObject)

        // get other form field options from form_field_lookups table
        const response5 = await lookupFieldsService.getLookupFields()
        let lookupsObject = response5.data.form_field_lookups
        this.formOptions.subjects = this.getOptions('field', 'subject', lookupsObject)
        this.formOptions.campuses = this.getOptions('field', 'campus', lookupsObject)
        this.formOptions.positions = this.getOptions('field', 'position', lookupsObject)
        this.formOptions.courseTypes = this.getOptions('field', 'course_type', lookupsObject)
        this.formOptions.startEndTimes = this.getOptions('field', 'meeting_start_end_times', lookupsObject)

        // get course info with any saved offerings/assignments
        const response6 = await courseService.getCourse(Number(this.$props.course_id), this.params)
        this.currentCourse = response6.data.course

        // get the current course subject abbreviation for breadcrumbs
        let courseSubject = this.getTextValueFromOptions(this.currentCourse.subject_id, this.formOptions.subjects)

        // add course name to breadcrumbs
        this.replaceBreadcrumb({
          find: 'Course loading...',
          replace: { text: courseSubject + ' ' + this.currentCourse.number }
        })

        // temporarily disabled to simulate scheduler view
        // this.userCanVerify = this.$can('update', this.subject.VERIFICATION_TAGS)

        this.loading = false
      } catch (error) {
        this.displayErrors(error)
        console.log(error)
      }
    }
  }
}
</script>
