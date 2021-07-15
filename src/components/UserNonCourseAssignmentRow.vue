<template>
  <div class="user-non-course-assignment-row">

    <b-row v-if="currentAssignment">

      <b-col offset-sm="1">
        <b-form-group label="Position">
          <b-form-select :id="'non-course-assignment-' + currentAssignment.id + '-position'"
                         v-model="currentAssignment.position_id"
                         :options="formOptions.positions"
                         @change="unSave"
          ></b-form-select>
        </b-form-group>
      </b-col>

      <b-col>
        <b-form-group
          :id="createUniqueId('input-group-start-date')"
          label="Start Date"
          :label-for="createUniqueId('start-date')"
        >
          <b-form-datepicker
            :id="createUniqueId('start-date')"
            v-model="currentAssignment.start_date"
            :aria-describedby="createUniqueId('start-date-feedback')"
          ></b-form-datepicker>
        </b-form-group>
      </b-col>

      <b-col>
        <b-form-group
          :id="createUniqueId('input-group-end-date')"
          label="End Date"
          :label-for="createUniqueId('end-date')"
        >
          <b-form-datepicker
            :id="createUniqueId('end-date')"
            v-model="currentAssignment.end_date"
            :aria-describedby="createUniqueId('end-date-feedback')"
          ></b-form-datepicker>
        </b-form-group>
      </b-col>

    </b-row>

    <b-row>

      <b-col offset-sm="2" cols="3">
        <b-row>
          <b-col>
            <label>Hiring Department</label>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <div class="form-control disabled-appearance">
              <!--              {{ currentAssignment.department.name }}-->
              department not in query yet
            </div>
          </b-col>
        </b-row>
      </b-col>

      <b-col>
        <b-form-group label="Hrs/Wk Worked">
          <b-input-group>
            <b-form-input type="text"
                          :id="'non-course-assignment-' + currentAssignment.id + '-hours'"
                          placeholder="0"
                          v-model="currentAssignment.hours_worked"
                          @keyup="unSave"
            ></b-form-input>
          </b-input-group>
        </b-form-group>
      </b-col>

      <b-col>
        <b-form-group label="FTE">
          <b-input-group>
            <b-form-input type="text"
                          :id="'non-course-assignment-' + currentAssignment.id + '-fte'"
                          placeholder="0"
                          v-model="currentAssignment.fte"
                          readonly
            ></b-form-input>
          </b-input-group>
        </b-form-group>
      </b-col>

      <b-col>
        <b-form-group label="Stipend">
          <b-input-group prepend="$">
            <b-form-input type="number"
                          :id="'non-course-assignment-' + currentAssignment.id + '-stipend'"
                          placeholder="0.00"
                          v-model="currentAssignment.stipend"
                          @keyup="unSave"
            ></b-form-input>
          </b-input-group>
        </b-form-group>
      </b-col>

    </b-row>

    <b-row>

      <b-col offset-sm="2" cols="auto" class="no-label-col">
        Status:
      </b-col>

      <b-col cols="auto">
        <b-row>
          <b-col class="form-text-nolabel">
            Confirmed
          </b-col>
        </b-row>
        <b-row>
          <b-col class="form-text-noinput-icon">
            <!-- v-if depends on tags -->
            <b-icon-check v-if="assignment.confirmed !== null" variant="success" font-scale="2"></b-icon-check>
            <b-icon-question v-else variant="info" font-scale="2"></b-icon-question>
          </b-col>
        </b-row>
      </b-col>

      <b-col cols="auto">
        <b-row>
          <b-col class="form-text-nolabel">
            Verified
          </b-col>
        </b-row>
        <b-row>
          <b-col class="form-text-noinput-icon">
            <!-- v-if depends on tags -->
            <b-icon-check v-if="assignment.verified !== null" variant="success" font-scale="2"></b-icon-check>
            <b-icon-question v-else variant="info" font-scale="2"></b-icon-question>
          </b-col>
        </b-row>
      </b-col>

      <b-col cols="auto">
        <b-row>
          <b-col class="form-text-nolabel">
            Stipend Verified
          </b-col>
        </b-row>
        <b-row>
          <b-col class="form-text-noinput-icon">
            <!-- v-if depends on tags -->
            <b-icon-check v-if="assignment.stipend_verified !== null" variant="success" font-scale="2"></b-icon-check>
            <b-icon-question v-else variant="info" font-scale="2"></b-icon-question>
          </b-col>
        </b-row>
      </b-col>

      <b-col cols="auto">
        <b-row>
          <b-col class="form-text-nolabel">
            Accepted
          </b-col>
        </b-row>
        <b-row>
          <b-col class="form-text-noinput-icon">
            <b-icon-check v-if="assignment.accept_assignment === 1" variant="success" font-scale="2"></b-icon-check>
            <b-icon-x v-else-if="assignment.accept_assignment === 0" variant="danger" font-scale="2"></b-icon-x>
            <b-icon-question v-else variant="info" font-scale="2"></b-icon-question>
          </b-col>
        </b-row>
      </b-col>

      <b-col cols="auto">
        <b-row>
          <b-col>
            <label>Prorate</label>
          </b-col>
        </b-row>
        <b-row>
          <b-col class="form-text-noinput-icon">
            <b-icon-check v-if="assignment.accept_prorate === 1" variant="success" font-scale="2"></b-icon-check>
            <b-icon-x v-else-if="assignment.accept_prorate === 0" variant="danger" font-scale="2"></b-icon-x>
            <b-icon-question v-else variant="info" font-scale="2"></b-icon-question>
          </b-col>
        </b-row>
      </b-col>

      <b-col cols="auto">
        <b-row>
          <b-col>
            <label>Approved</label>
          </b-col>
        </b-row>
        <b-row>
          <b-col class="form-text-noinput-icon">
            <!-- v-if depends on tags -->
            <b-icon-check v-if="assignment.approved !== null" variant="success" font-scale="2"></b-icon-check>
            <b-icon-question v-else variant="info" font-scale="2"></b-icon-question>
          </b-col>
        </b-row>
      </b-col>

      <b-col cols="2">
        <!--              save/saved -->
        <b-button
          v-if="!saved"
          variant="success"
          @click="updateAssignment"
        >
          Save
        </b-button>
        <label
          v-if="saved"
          class="button-spaced-label"
        >
          Saved
        </label>
      </b-col>
    </b-row>

    <!-- submission details -->
    <b-row>
      <b-col offset-sm="2">
        <offering-assignment-last-tag-info
          v-if="assignmentConfirmed"
          ref="lastTagInfo"
          :parent-object="currentAssignment"
        ></offering-assignment-last-tag-info>
      </b-col>
    </b-row>

  </div>
</template>

<script>
import { EventHandlerMixin } from '@/mixins/EventHandlerMixin'
import { FormHelperMixin } from '@/mixins/FormHelperMixin'
import { SelectOptions } from '@/mixins/SelectOptionsMixin'
import OfferingAssignmentLastTagInfo from './OfferingAssignmentLastTagInfo'
import { assignmentService } from '@/services/assignment.service'

export default {
  name: 'UserNonCourseAssignmentRow',
  components: { OfferingAssignmentLastTagInfo },
  mixins: [EventHandlerMixin, FormHelperMixin, SelectOptions],
  props: {
    assignment: Object,
    formOptions: Object
  },
  data () {
    return {
      currentAssignment: null,
      saved: true
    }
  },
  created () {
    this.initialize()
  },
  computed: {
    assignmentConfirmed () {
      return this.currentAssignment.confirmed !== null
    }
  },
  methods: {
    initialize () {
      this.currentAssignment = _.cloneDeep(this.$props.assignment)
      this.currentAssignment.fte = this.currentAssignment.hours_worked / 40
      this.saveCurrentState(this.currentAssignment)
    },

    /**
     * sends an API request to update the assignments table with the value of the changed property
     */
    async updateAssignment () {
      let data = this.returnChangedParams(this.currentAssignment)

      try {
        // update any assignment properties that were changed
        if (!_.isEmpty(data)) {
          console.log('saving assignment changes')
          const response1 = await assignmentService.updateAssignment(this.currentAssignment.id, data)
          this.$emit('saved', response1)
          console.log(response1)
        }
        this.saved = true
      } catch (error) {
        this.displayErrors(error)
        console.log(error)
      }
    },

    formatDate (date) {
      return this.$moment(date).format('dddd, MMMM Do YYYY')
    },

    unSave: function () {
      this.saved = false
    }
  }
}
</script>

<style scoped>

</style>
