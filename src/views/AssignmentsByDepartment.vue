<template>
  <div>
    <b-breadcrumb :items="breadcrumbs"></b-breadcrumb>

    <LoadingPlaceholder v-if="loading"></LoadingPlaceholder>

    <div v-else>
      <!-- department info and contact -->
      <h4>Department of {{ department.name }}</h4>

      <department-info :department="department"></department-info>

      <div v-if="activeCourses.length > 0">
        <transition-group name="fade">
          <course-row
            v-for="course in activeCourses"
            :key="course.id"
            :course="course"
            :form-options="formOptions"
            :nonCourseSubjectId="nonCourseSubjectId"
            :user-can-verify="userCanVerify"
            :user-can-verify-stipend="userCanVerifyStipend"
          ></course-row>
        </transition-group>
      </div>

      <div v-if="activeNonCourseAssignments.length > 0">
        <h3>Non-course Assignments</h3>
        <transition-group name="fade">
          <non-course-assignment-row v-for="assignment in activeNonCourseAssignments"
                                     :key="assignment.id"
                                     :formOptions="formOptions"
                                     :assignment="assignment"
                                     :user-can-verify="userCanVerify"
                                     :user-can-verify-stipend="userCanVerifyStipend"
                                     @deleteAssignment="deleteNonCourseAssignment($event)"
          ></non-course-assignment-row>
        </transition-group>
      </div>

      <b-row align-h="center">
        <b-col cols="auto">
          <b-button class="new-assignment-button" variant="outline-primary" @click="addNonCourseAssignment">
            Create new non-course assignment
          </b-button>
        </b-col>
      </b-row>

      <b-row v-if="activeNonCourseAssignments.length > 0 || activeCourses.length > 0">
        <b-col class="no-label-col">
          <b-button v-if="!csvOutput" @click="formatOutputValues(flattenAssignments(department))">
            Prepare data for download (.csv)
          </b-button>
          <vue-json-to-csv
            v-else
            :json-data="csvOutput"
            :labels="csvDataLabels"
            :csv-title="department.name +'-courses'"
          >
            <b-button>Download as CSV</b-button>
          </vue-json-to-csv>
        </b-col>
      </b-row>

      <b-row v-else>
        <b-col>
          <hr>
          No offerings or assignments confirmed yet for {{ this.activeTerm.name }}
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import { departmentService } from '@/services/department.service'
import { userService } from '@/services/user.service'
import { lookupFieldsService } from '@/services/lookupFields.service'
import { SelectOptions } from '@/mixins/SelectOptionsMixin'
import DepartmentInfo from '../components/DepartmentInfo'
import CourseRow from '../components/CourseRow'
import { termsService } from '@/services/terms.service'
import { BreadcrumbManager } from '@/mixins/BreadcrumbManager'
import { ReferrerManager } from '@/mixins/ReferrerManager'
import LoadingPlaceholder from '../components/LoadingPlaceholder'
import { eClassesService } from '@/services/eclasses.service'
import VueJsonToCsv from 'vue-json-to-csv'
import { PermissionSubject } from '@/permission-subject'
import { EventHandlerMixin } from '@/mixins/EventHandlerMixin'
import NonCourseAssignmentRow from '../components/NonCourseAssignmentRow'
import { NonCourseAssignment } from '@/models/noncourseassignment'
import { CsvOutputHelperMixin } from '@/mixins/csvOutputHelperMixin'
import { nonCourseAssignmentService } from '@/services/nonCourseAssignment.service'
import { partsOfTermService } from '@/services/partsOfTerm.service'

export default {
  name: 'AssignmentsByDepartment',
  components: {
    DepartmentInfo,
    CourseRow,
    LoadingPlaceholder,
    NonCourseAssignmentRow,
    VueJsonToCsv
  },
  mixins: [BreadcrumbManager, ReferrerManager, SelectOptions, CsvOutputHelperMixin, EventHandlerMixin],
  props: {
    department_id: String,
    term_id: String
  },
  data () {
    return {
      subject: PermissionSubject,
      department: {},
      formOptions: {},
      partsOfTerm: [],
      nonCourseSubjectId: null,
      params: {
        with: 'courses.offerings.assignments.user,nonCourseAssignments.user,courses.offerings.assignments.letters,courses.offerings.comments.user,courses.offerings.assignments.comments.user,nonCourseAssignments.comments.user'
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
    activeCourses () {
      let activeTermCourses = this.department.courses.filter((courseObject) => {
        return courseObject.term_id === Number(this.$props.term_id)
      })
      if (this.userCanVerify) {
        let coursesWithOfferings = activeTermCourses.filter(function (courseObject) {
          return courseObject.offerings
        })
        return coursesWithOfferings.filter((courseObject) => {
          let array = []
          for (let i = 0; i < courseObject.offerings.length; i++) {
            if (courseObject.offerings[i].confirmed !== null) {
              array.push(courseObject.offerings[i])
            }
          }
          return array.length > 0
        })
      } else {
        return activeTermCourses
      }
    },
    activeNonCourseAssignments () {
      return this.department.non_course_assignments.filter((assignmentObject) => {
        return (assignmentObject.term_id === Number(this.$props.term_id) &&
        assignmentObject.confirmed !== null)
      })
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
        // get department info with any saved courses/offerings/assignments
        const response1 = await departmentService.getDepartment(Number(this.$props.department_id), this.params)
        this.department = response1.data.department
        // save the current department in local storage
        this.setReferrer({
          termId: this.$props.term_id,
          departmentId: this.department.id,
          departmentName: this.department.name
        })
        // console.log(this.department)

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

        this.replaceBreadcrumb({
          find: 'Department loading...',
          replace: { text: this.department.name }
        })

        // get part of term options from parts_of_term table
        const response5 = await partsOfTermService.getPartsOfTerm({ term_id: this.$props.term_id })
        this.partsOfTerm = response5.data.parts_of_term
        this.$set(this.formOptions, 'partsOfTerm', this.getOptions('field', 'partOfTerm', this.partsOfTerm, false))

        // get other form field options from form_field_lookups table
        const response6 = await lookupFieldsService.getLookupFields()
        let lookupsObject = response6.data.form_field_lookups
        this.formOptions.colleges = this.getOptions('field', 'college', lookupsObject)
        this.formOptions.subjects = this.getOptions('field', 'subject', lookupsObject)
        this.formOptions.campuses = this.getOptions('field', 'campus', lookupsObject)
        this.formOptions.positions = this.getOptions('field', 'position', lookupsObject)
        this.formOptions.courseTypes = this.getOptions('field', 'course_type', lookupsObject)
        this.formOptions.startEndTimes = this.getOptions('field', 'meeting_start_end_times', lookupsObject)

        this.userCanVerify = this.$can('update', this.subject.VERIFICATION_TAGS)
        this.userCanVerifyStipend = this.$can('update', this.subject.STIPEND_VERIFICATION_TAGS)

        this.loading = false
      } catch (error) {
        this.displayErrors(error)
        console.log(error)
      }
    },

    flattenAssignments: function (departmentObject) {
      let outputArray = []
      let deptInfo = {}
      for (let [key, value] of Object.entries(departmentObject)) {
        if (typeof (value) !== 'object') {
          deptInfo[key] = value
        }
      }
      // for each course
      if (this.activeCourses) {
        _.forEach(this.activeCourses, function (object) {
          // create temporary course object
          let course = {}
          // iterate over the original course object
          for (let [key, value] of Object.entries(object)) {
            // add non-object properties to the temporary course object
            if (typeof (value) !== 'object') {
              course[key] = value
            } else {
              // object property is array of offerings
              if (value) {
                _.forEach(value, function (object) {
                  // create temporary offering object
                  let offering = {}
                  // iterate over the original offering object
                  for (let [key, value] of Object.entries(object)) {
                    // add non-object properties to temporary offering object
                    if (typeof (value) !== 'object') {
                      offering[key] = value
                    } else {
                      // object property is an array of assignments
                      if (value) {
                        _.forEach(value, function (object) {
                          // create temporary assignment object with calculated fte
                          let assignment = {}
                          // iterate over original assignment object
                          for (let [key, value] of Object.entries(object)) {
                            // add non-object properties to temporary assignment object
                            if (typeof (value) !== 'object') {
                              assignment[key] = value
                            } else {
                              // object property is user object
                              if (value) {
                                // concatenate all temporary objects into one
                                let all = { ...deptInfo, ...course, ...offering, ...value, ...assignment }
                                // add concatenated object to output array
                                outputArray.push(all)
                              } // end if (value)
                            } // end if typeof
                          } // end for
                        }) // end forEach
                      } // end if (value)
                    } // end if typeof
                  } // end for
                }) // end forEach
              } // end if (value)
            } // end if typeof
          } // end for
        }) // end forEach
      } // end if (value)

      // for each non-course assignment
      if (this.activeNonCourseAssignments) {
        _.forEach(this.activeNonCourseAssignments, function (nonCourseAssignmentObject) {
          // create temporary assignment object with calculated fte
          let assignment = {}
          // iterate over original assignment object
          for (let [key, value] of Object.entries(nonCourseAssignmentObject)) {
            // add non-object properties to temporary assignment object
            if (typeof (value) !== 'object' && !Array.isArray(value)) {
              assignment[key] = value
            } else {
              // object property is user object
              if (value && !Array.isArray(value)) {
                // concatenate all temporary objects into one
                let all = { ...deptInfo, ...value, ...assignment }
                // add concatenated object to output array
                outputArray.push(all)
              } // end if (value)
            } // end if typeof
          } // end for
        }) // end forEach
      }
      return outputArray
    },

    // myLoop: function (row, object) {
    //   let that = this
    //   let n = 0
    //   if (object) {
    //     for (let [key, value] of Object.entries(object)) {
    //       // add non-object properties to the row object
    //       if (!Array.isArray(value) && typeof (value) !== 'object') {
    //         row[key] = value
    //         if (n === object.length) {
    //           return
    //         }
    //         n++
    //         // for properties that are arrays, plug the value back in to this function
    //       } else if (Array.isArray(value)) {
    //         _.forEach(value, function (object) {
    //           return that.myLoop(row, object)
    //         })
    //         // the exception is the user property, which is an object
    //       } else if (key === 'user') {
    //         // add its properties to the row object
    //         return that.myLoop(row, value)
    //         // for (let [k, v] of Object.entries(value)) {
    //         //   row[k] = v
    //         // }
    //       }
    //     }
    //   }
    // },

    // recursiveFlattenAssignments: function (object) {
    //   let outputArray = []
    //   // for each course
    //   for (let i = 0; i < object.courses.length; i++) {
    //     let row = {}
    //     this.myLoop(row, object.courses[i])
    //     outputArray.push(row)
    //   }
    //   // let row = {}
    //   // this.myLoop(row, object.courses)
    //   // outputArray.push(row)
    //   return outputArray
    // },

    // recursiveFlattenAssignments: function (object) {
    //   const flattenObject = (obj) => {
    //     const flattened = {}
    //
    //     Object.keys(obj).forEach((key) => {
    //       if (typeof obj[key] === 'object' && obj[key] !== null) {
    //         Object.assign(flattened, flattenObject(obj[key]))
    //       } else {
    //         flattened[key] = obj[key]
    //       }
    //     })
    //
    //     return flattened
    //   }
    //
    //   let outputArray = []
    //   let deptInfo = {}
    //   for (let [key, value] of Object.entries(object)) {
    //     if (typeof (value) !== 'object') {
    //       deptInfo[key] = value
    //     }
    //   }
    //
    //   if (object.courses) {
    //     object.courses.forEach(course => {
    //       outputArray.push({ ...deptInfo, ...flattenObject(course) })
    //     })
    //   }
    //
    //   return outputArray
    // },

    /**
     * creates a new non-course assignment with empty values
     */
    addNonCourseAssignment: async function () {
      let newAssignment = new NonCourseAssignment({})
      newAssignment.department_id = Number(this.$props.department_id)
      newAssignment.term_id = Number(this.$props.term_id)
      newAssignment.tags = []
      try {
        const response = await nonCourseAssignmentService.saveNewNonCourseAssignment(newAssignment)
        newAssignment.id = response.data.non_course_assignment.id
        this.department.non_course_assignments.push(newAssignment)
      } catch (error) {
        this.displayErrors(error)
        console.log(error)
      }
    },

    deleteNonCourseAssignment: function (nonCourseAssignmentId) {
      this.department.non_course_assignments = this.department.non_course_assignments.filter((nonCourseAssignmentsArray) => {
        return nonCourseAssignmentsArray.id !== nonCourseAssignmentId
      })
    }
  }
}
</script>
