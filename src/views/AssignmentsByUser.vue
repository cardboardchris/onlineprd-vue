<template>
  <div class="assignments-by-user">
    <b-breadcrumb :items="breadcrumbs"></b-breadcrumb>

    <h3 class="text-center">Assignments by Employee</h3>

    <DynamicTableWrapper
      v-if="activeTerm"
      :search.sync="search"
      :searchOn.sync="searchOn"
      :searchOptions="searchOptions"
      :currentPage.sync="currentPage"
      :perPage.sync="perPage"
      :pageOptions="pageOptions"
      :totalRows="totalRows"
      v-on:update:searchOn="searchOnOptionsChange"
      v-on:refresh:table="refreshTable"
    >
      <b-table
        id="results-table"
        ref="table"
        :items="users"
        :fields="fields"
        :current-page="currentPage"
        :per-page="perPage"
        :responsive="true"
        :bordered="true"
        :hover="false"
        head-variant="light"
        :no-local-sorting="true"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        :filter="search"
        :show-empty="true"
      >
        <template v-slot:table-busy>
          <LoadingPlaceholder></LoadingPlaceholder>
        </template>

        <template v-slot:cell(email)="data">
          <a :href="`mailto:${data.item.email}`">{{ data.item.email }}</a>
        </template>

        <template v-slot:row-details="data">
          <user-assignment-row v-for="assignment in data.item.assignments"
                               :key="assignment.id"
                               :assignment="assignment"
                               :form-options="formOptions"
                               @saved="displaySuccess($event)"
          ></user-assignment-row>
          <user-non-course-assignment-row v-for="assignment in data.item.non_course_assignments"
                               :key="assignment.id"
                               :assignment="assignment"
                               :form-options="formOptions"
                               @saved="displaySuccess($event)"
          ></user-non-course-assignment-row>
        </template>
      </b-table>
    </DynamicTableWrapper>

    <b-row v-if="activeTerm">
      <b-col>
        <b-button v-if="!csvOutput" @click="formatOutputValues(flattenAssignments(users))">
          Prepare data for download (.csv)
        </b-button>
        <vue-json-to-csv
          v-else
          :json-data="csvOutput"
          :labels="csvDataLabels"
          csv-title="user-assignments"
        >
          <b-button>Download as CSV</b-button>
        </vue-json-to-csv>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { BreadcrumbManager } from '@/mixins/BreadcrumbManager'
import { lookupFieldsService } from '@/services/lookupFields.service'
import { SelectOptions } from '@/mixins/SelectOptionsMixin'
import { termsService } from '@/services/terms.service'
import { departmentService } from '@/services/department.service'
import UserAssignmentRow from '../components/UserAssignmentRow'
import DynamicTableWrapper from '../components/DynamicTable/DynamicTableWrapper'
import { DynamicTableMixin } from '@/mixins/DynamicTableMixin'
import LoadingPlaceholder from '../components/LoadingPlaceholder'
import VueJsonToCsv from 'vue-json-to-csv'
import { EventHandlerMixin } from '@/mixins/EventHandlerMixin'
import { CsvOutputHelperMixin } from '@/mixins/csvOutputHelperMixin'
import { partsOfTermService } from '@/services/partsOfTerm.service'
import { assignmentService } from '@/services/assignment.service'
import UserNonCourseAssignmentRow from '@/components/UserNonCourseAssignmentRow'

export default {
  name: 'AssignmentsByUserDashboard',
  props: {
    term_id: String
  },
  components: {
    UserAssignmentRow,
    UserNonCourseAssignmentRow,
    DynamicTableWrapper,
    LoadingPlaceholder,
    VueJsonToCsv
  },
  mixins: [
    BreadcrumbManager,
    SelectOptions,
    DynamicTableMixin,
    EventHandlerMixin,
    CsvOutputHelperMixin
  ],
  data () {
    return {
      formOptions: {},
      params: {
        term_id: this.term_id
        // with: 'assignments.offering.course.department'
      },
      sortBy: 'last_name',
      fields: [
        { key: 'last_name', sortable: true },
        { key: 'first_name', sortable: true },
        'email',
        'spartan_id'
      ],
      searchOptions: [
        { text: 'Last Name', value: 'last_name' },
        { text: 'First Name', value: 'first_name' },
        { text: 'Email', value: 'email' },
        { text: 'Spartan Id', value: 'spartan_id' }
      ],
      searchOn: [
        'last_name',
        'first_name',
        'email',
        'spartan_id'
      ],
      users: [],
      activeTerm: null,
      csvOutput: null
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
    // myProvider: async function (ctx) {
    //   this.updateParams(ctx)
    //
    //   try {
    //     const response = await userService.getUsers(this.params)
    //     this.totalRows = response.data.count // total to calculate pagination
    //     console.log(response.data.users)
    //     let usersArray = []
    //     // filter out users with no assignments and set _showDetails to true on each
    //     _.forEach(response.data.users, (object) => {
    //       object._showDetails = true
    //       if (object.assignments.length > 0) {
    //         usersArray.push(object)
    //       }
    //     })
    //     console.log(usersArray)
    //     this.users = usersArray
    //     return this.users
    //   } catch (error) {
    //     this.displayErrors(error)
    //   }
    // },

    /**
     * make API calls to get saved data
     */
    initialize: async function () {
      try {
        // get assignments
        const response = await assignmentService.getAssignmentsByUserTerm(this.params)
        // const response = await userService.getUsers(this.params)
        console.log(response.data.users)
        // let usersArray = []
        // // filter out users with no assignments and set _showDetails to true on each
        _.forEach(response.data.users, (object) => {
          // console.log(object.first_name + ' ' + object.last_name)
          if (Object.keys(object).length > 0) {
            // console.log(object.assignments)
            object._showDetails = true
            // usersArray.push(object)
          }
        })
        // console.log(usersArray)
        this.users = response.data.users

        // get select options from form_field_lookups table
        const response2 = await lookupFieldsService.getLookupFields()
        let lookupsObject = response2.data.form_field_lookups
        this.formOptions.colleges = this.getOptions('field', 'college', lookupsObject)
        this.formOptions.subjects = this.getOptions('field', 'subject', lookupsObject)
        this.formOptions.campuses = this.getOptions('field', 'campus', lookupsObject)
        this.formOptions.positions = this.getOptions('field', 'position', lookupsObject)
        this.formOptions.courseTypes = this.getOptions('field', 'course_type', lookupsObject)
        this.formOptions.startEndTimes = this.getOptions('field', 'meeting_start_end_times', lookupsObject)

        // get the active term object
        const response3 = await termsService.getTermById(Number(this.$props.term_id))
        this.activeTerm = response3.data.term

        this.replaceBreadcrumb({
          find: 'Term loading...',
          replace: { text: this.activeTerm.name, to: { name: 'dashboard' }, params: { term_id: this.$props.term_id } }
        })

        // get part of term options from parts_of_term table
        const response4 = await partsOfTermService.getPartsOfTerm({ term_id: this.$props.term_id })
        this.partsOfTerm = response4.data.parts_of_term
        this.$set(this.formOptions, 'partsOfTerm', this.getOptions('field', 'partOfTerm', this.partsOfTerm, false))

        // get all departments info from departments table
        const response5 = await departmentService.getDepartments()
        let departmentsObject = response5.data.departments
        this.$set(this.formOptions, 'departments', this.formatOptions('department', departmentsObject))

        this.toggleLoading()
      } catch (error) {
        this.displayErrors(error)
      }
    },

    toggleLoading () {
      this.loading = !this.loading
    },

    flattenAssignments: function (array) {
      let outputArray = []
      let userInfo = {}
      // console.log(array)
      _.forEach(array, function (object) {
        for (let [key, value] of Object.entries(object)) {
          if (typeof (value) !== 'object') {
            userInfo[key] = value
          }
        }
        if (object.assignments) {
          _.forEach(object.assignments, function (object) {
            // create temporary course object
            let assignment = {}
            // iterate over the original course object
            for (let [key, value] of Object.entries(object)) {
              // add non-object properties to the temporary course object
              if (typeof (value) !== 'object') {
                assignment[key] = value
              } else {
                // object property is an offering object
                if (value) {
                  // create temporary offering object
                  let offering = {}
                  // iterate over the original offering object
                  for (let [k, v] of Object.entries(value)) {
                    // add non-object properties to temporary offering object
                    if (typeof (v) !== 'object') {
                      offering[k] = v
                    } else {
                      // object property is a course object
                      if (v) {
                        // create temporary assignment object with calculated fte
                        let course = {}
                        // iterate over original assignment object
                        for (let [key, value] of Object.entries(v)) {
                          // add non-object properties to temporary assignment object
                          if (typeof (value) !== 'object') {
                            course[key] = value
                          } else {
                            // object-type property is department object
                            if (value) {
                              // concatenate all temporary objects into one
                              let all = { ...userInfo, ...assignment, ...offering, ...course, ...value }
                              // add concatenated object to output array
                              outputArray.push(all)
                            } // end if (value)
                          } // end if typeof
                        } // end for
                      } // end if (value)
                    } // end if typeof
                  } // end for
                } // end if (value)
              } // end if typeof
            } // end for
          }) // end forEach
        } // end if (value)
      }) // end _forEach
      return outputArray
    }
  }
}
</script>
