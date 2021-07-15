<template>
  <div>
    <b-breadcrumb :items="breadcrumbs"></b-breadcrumb>

    <LoadingPlaceholder v-if="loading"></LoadingPlaceholder>

    <div v-else>

      <!-- department info and contact -->
      <h1>Department of {{ department.name }}</h1>

      <department-info :department="department"></department-info>

      <h2>Courses - {{ activeTerm.name }}</h2>

      <transition-group name="fade">
        <div v-for="course in courses" :key="course.id" class="course">

          <b-row>
            <b-col cols="2">
              <p>
                <router-link
                  :to="{ name: 'assignmentsbycourse', params: { term_id: String(activeTerm.id), department_id: String(department.id), course_id: String(course.id) } }">
                  {{ getCourseSubject(course.subject_id, formOptions.subjects) }} {{ course.number }}
                </router-link>
              </p>
            </b-col>

            <b-col>
              <b-button variant="outline-danger"
                        v-b-tooltip.hover.right
                        :title="'Delete ' + getCourseSubject(course.subject_id, formOptions.subjects) + ' ' + course.number"
                        @click="deleteCourse(course.id)"
              >
                <b-icon-trash-fill></b-icon-trash-fill>
              </b-button>
            </b-col>
          </b-row>

        </div>
      </transition-group>

      <div>
        <b-row>
          <b-col>
            <router-link
              :to="{ name: 'noncourseassignments', params: { term_id: String(activeTerm.id), department_id: String(department.id) } }">
              Non-course Assignments
            </router-link>
          </b-col>
        </b-row>

        <hr>

        <b-row v-if="addingCourse">
          <b-col>
            <new-course-fields
              :form-options="formOptions"
              :active-term="activeTerm"
              :department-id="department.id"
              @saveCourse="saveNewCourse($event)"
            ></new-course-fields>
          </b-col>
        </b-row>

        <b-row v-else>
          <b-col cols="auto" class="no-label-col">
            <b-button size="sm" variant="primary" @click="addingCourse = true">
              Create new course
            </b-button>
          </b-col>
        </b-row>
      </div>
      <!-- end v-if activeTerm -->

    </div>
  </div>
</template>

<script>
import { departmentService } from '../services/department.service'
import { lookupFieldsService } from '../services/lookupFields.service'
import { courseService } from '../services/course.service'
import { SelectOptions } from '../mixins/SelectOptionsMixin'
import DepartmentInfo from '../components/DepartmentInfo'
import NewCourseFields from '../components/NewCourseFields'
import { BreadcrumbManager } from '../mixins/BreadcrumbManager'
import { tagService } from '../services/tag.service'
import LoadingPlaceholder from '../components/LoadingPlaceholder'
import { termsService } from '../services/terms.service'
import { EventHandlerMixin } from '../mixins/EventHandlerMixin'
import { anyTableService } from '../services/anyTable.service'

export default {
  name: 'CourseList',
  props: {
    department_id: String,
    term_id: String
  },
  components: {
    DepartmentInfo,
    NewCourseFields,
    LoadingPlaceholder
  },
  mixins: [BreadcrumbManager, SelectOptions, EventHandlerMixin],
  data () {
    return {
      department: {},
      courses: [],
      formOptions: {
        subjects: null
      },
      activeTerm: {},
      params: {
        term_id: this.$props.term_id,
        department_id: Number(this.$props.department_id)
      },
      loading: true,
      addingCourse: false
    }
  },
  computed: {
    currentUser () {
      return this.$store.state.auth.user
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
        const response1 = await departmentService.getDepartment(Number(this.$props.department_id))
        this.department = response1.data.department

        // get any saved courses
        const response2 = await courseService.getCourses(this.params)
        this.courses = response2.data.courses

        // get the active term
        const response3 = await termsService.getTermById(Number(this.$props.term_id))
        this.activeTerm = response3.data.term

        this.replaceBreadcrumb({
          find: 'Term loading...',
          replace: { text: this.activeTerm.name, to: { name: 'dashboard' }, params: { term_id: this.$props.term_id } }
        })

        // get form field options from lookup table
        const response4 = await lookupFieldsService.getLookupFields()
        let formFieldsObject = response4.data.form_field_lookups
        this.formOptions.subjects = this.getOptions('field', 'subject', formFieldsObject)

        this.toggleLoading()
      } catch (error) {
        this.displayErrors(error)
        console.log(error)
      }
    },

    toggleLoading () {
      this.loading = !this.loading
    },

    /**
     * get the course subject abbreviation from the course id and subject select options
     */
    getCourseSubject: function (subjectId) {
      return this.getTextValueFromOptions(subjectId, this.formOptions.subjects)
    },

    saveNewCourse: async function (courseObject) {
      courseObject.department_id = this.department.id
      courseObject.credit_hours = Number(courseObject.credit_hours)
      // console.log(courseObject)
      try {
        const response = await courseService.saveNewCourse(courseObject)
        courseObject.id = response.data.course.id
        this.courses.push(courseObject)
        this.addingCourse = false
        // console.log(response)
      } catch (error) {
        this.displayErrors(error)
        console.log(error)
      }
    },

    deleteCourse: async function (courseId) {
      try {
        await courseService.deleteCourse(courseId)
        this.courses = this.courses.filter((courseObject) => {
          return courseObject.id !== courseId
        })
      } catch (error) {
        this.displayErrors(error)
        console.log(error)
      }
    }
  }
}
</script>
