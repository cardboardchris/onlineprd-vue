<template>
  <div>
    <b-breadcrumb :items="breadcrumbs"></b-breadcrumb>

    <LoadingPlaceholder v-if="loading"></LoadingPlaceholder>

    <div v-else>
      <!-- department info and contact -->
      <h4>Department of {{ department.name }}</h4>

      <department-info :department="department"></department-info>

      <h3>Non-course assignments - {{ activeTerm.name }}</h3>

      <div v-if="activeAssignments.length > 0" class="non-course-assignments-block">
        <non-course-assignment-row v-for="assignment in activeAssignments"
                                   :key="assignment.id"
                                   :formOptions="formOptions"
                                   :assignment="assignment"
                                   :user-can-verify="userCanVerify"
                                   :user-can-verify-stipend="userCanVerifyStipend"
                                   @deleteAssignment="deleteAssignment($event)"
        ></non-course-assignment-row>
      </div>

      <b-row align-h="center">
        <b-col cols="auto">
          <b-button class="new-assignment-button" variant="outline-primary" @click="addAssignment">
            Create new non-course assignment
          </b-button>
        </b-col>
      </b-row>

    </div>
  </div>
</template>

<script>
import { departmentService } from '../services/department.service'
import { userService } from '../services/user.service'
import { lookupFieldsService } from '../services/lookupFields.service'
import { SelectOptions } from '../mixins/SelectOptionsMixin'
import DepartmentInfo from '../components/DepartmentInfo'
import { termsService } from '../services/terms.service'
import { BreadcrumbManager } from '../mixins/BreadcrumbManager'
import LoadingPlaceholder from '../components/LoadingPlaceholder'
import { eClassesService } from '../services/eclasses.service'
import { PermissionSubject } from '../permission-subject'
import { EventHandlerMixin } from '../mixins/EventHandlerMixin'
import NonCourseAssignmentRow from '../components/NonCourseAssignmentRow'
import { NonCourseAssignment } from '../models/noncourseassignment'
import { nonCourseAssignmentService } from '../services/nonCourseAssignment.service'
import { partsOfTermService } from '../services/partsOfTerm.service'

export default {
  name: 'NonCourseAssignments',
  props: {
    department_id: String,
    term_id: String
  },
  components: {
    DepartmentInfo,
    LoadingPlaceholder,
    NonCourseAssignmentRow
  },
  mixins: [BreadcrumbManager, SelectOptions, EventHandlerMixin],
  data () {
    return {
      subject: PermissionSubject,
      department: {},
      assignments: [],
      formOptions: {},
      nonCourseSubjectId: null,
      params: {
        department_id: this.$props.department_id,
        with: 'user,tags'
      },
      userCanVerify: false,
      userCanVerifyStipend: false,
      loading: true,
      csvOutput: null,
      activeTerm: {}
    }
  },
  computed: {
    currentUser () {
      return this.$store.state.auth.user
    },
    activeAssignments () {
      let activeTermAssignments = this.assignments.filter((courseObject) => {
        return courseObject.term_id === Number(this.$props.term_id)
      })
      if (this.userCanVerify) {
        return activeTermAssignments.filter((courseObject) => {
          let array = []
          for (let i = 0; i < courseObject.offerings.length; i++) {
            if (courseObject.offerings[i].confirmed !== null) {
              array.push(courseObject.offerings[i])
            }
          }
          return array.length > 0
        })
      } else {
        return activeTermAssignments
      }
    }
  },
  created () {
    this.initialize()
  },
  methods: {
    /**
     * make API calls to get saved data
     */
    initialize: async function () {
      try {
        // get department info
        const response = await departmentService.getDepartment(Number(this.$props.department_id))
        this.department = response.data.department

        const response1 = await nonCourseAssignmentService.getNonCourseAssignments(this.params)
        this.assignments = response1.data.non_course_assignments
        // console.log(this.assignments)

        const response2 = await userService.getUserById(this.department.contact_user_id)
        this.$set(this.department, 'contact_user', response2.data.user)

        // get eclasses
        const response3 = await eClassesService.getEClasses()
        let eClassesObject = response3.data.eclasses
        this.formOptions.eClasses = this.formatOptions('eclass', eClassesObject)

        // get the active term object
        const response4 = await termsService.getTermById(Number(this.$props.term_id))
        this.activeTerm = response4.data.term

        this.replaceBreadcrumb({
          find: 'Term loading...',
          replace: { text: this.activeTerm.name, to: { name: 'dashboard' }, params: { term_id: this.$props.term_id } }
        })

        // get part of term options from parts_of_term table
        const response5 = await partsOfTermService.getPartsOfTerm({ term_id: this.$props.term_id })
        let termsObject = response5.data.parts_of_term
        this.$set(this.formOptions, 'partsOfTerm', this.getOptions('field', 'partOfTerm', termsObject, false))

        // get other form field options from form_field_lookups table
        const response6 = await lookupFieldsService.getLookupFields()
        let lookupsObject = response6.data.form_field_lookups
        this.$set(this.formOptions, 'campuses', this.getOptions('field', 'campus', lookupsObject))
        this.$set(this.formOptions, 'positions', this.getOptions('field', 'position', lookupsObject))
        this.$set(this.formOptions, 'subjects', this.getOptions('field', 'subject', lookupsObject))

        // temporarily disabled to simulate scheduler view
        // this.userCanVerify = this.$can('update', this.subject.VERIFICATION_TAGS)

        this.loading = false
      } catch (error) {
        this.displayErrors(error)
        console.log(error)
      }
    },

    /**
     * creates a new assignment with empty values in the assignments object
     */
    addAssignment: async function () {
      let newAssignment = new NonCourseAssignment({})
      newAssignment.department_id = Number(this.$props.department_id)
      newAssignment.term_id = Number(this.$props.term_id)
      newAssignment.tags = []
      try {
        const response = await nonCourseAssignmentService.saveNewNonCourseAssignment(newAssignment)
        newAssignment.id = response.data.non_course_assignment.id
        this.assignments.push(newAssignment)
        // console.log(response)
      } catch (error) {
        this.displayErrors(error)
        console.log(error)
      }
    },

    deleteAssignment: function (assignmentId) {
      this.assignments = this.assignments.filter((assignmentObject) => {
        return assignmentObject.id !== assignmentId
      })
    }
  }
}
</script>
