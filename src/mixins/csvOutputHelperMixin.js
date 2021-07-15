export const CsvOutputHelperMixin = {
  data: function () {
    // outputs a csv file wherein each row is an assignment with all its user and offering info
    return {
      csvDataLabels: {
        id: { title: 'id' },
        // department
        name: { title: 'hiring department' },
        org_number: { title: 'org' },
        chair: { title: 'chair' },
        department_building: { title: 'building' },
        department_office_number: { title: 'office number' },
        college: { title: 'college' },
        // course
        subject: { title: 'subject' },
        number: { title: 'course number' },
        credit_hours: { title: 'credit hours' },
        // offering
        section: { title: 'section' },
        crn: { title: 'crn' },
        campus: { title: 'campus' },
        start_date: { title: 'start date' },
        end_date: { title: 'end date' },
        wi: { title: 'WI' },
        si: { title: 'SI' },
        meeting_days: { title: 'meeting days' },
        type: { title: 'course delivery' },
        start_end_times: { title: 'start/end times' },
        // assignment
        first_name: { title: 'employee first name' },
        last_name: { title: 'employee last name' },
        spartan_id: { title: 'spartan id' },
        email: { title: 'employee email' },
        position: { title: 'position' },
        hours_worked: { title: 'hours/wk worked' },
        fte: { title: 'FTE' },
        stipend: { title: 'stipend' },
        accept_assignment: { title: 'accept assignment' },
        accept_prorate: { title: 'accept prorate' },
        created_at: { title: 'created at' },
        updated_at: { title: 'updated at' }
      }
    }
  },
  methods: {

    formatOutputValues: function (array) {
      _.forEach(array, (assignmentObject) => {
        // console.log(this.formOptions)
        assignmentObject.college = this.getTextValueFromOptions(assignmentObject.college_id, this.formOptions.colleges)
        assignmentObject.campus = this.getTextValueFromOptions(assignmentObject.campus_id, this.formOptions.campuses)
        assignmentObject.position = this.getTextValueFromOptions(assignmentObject.position_id, this.formOptions.positions)
        assignmentObject.accept_assignment = this.getYesNoString(assignmentObject.accept_assignment)
        assignmentObject.accept_prorate = this.getYesNoString(assignmentObject.accept_prorate)
        assignmentObject.fte = assignmentObject.hours_worked / 40
        assignmentObject.subject = this.getTextValueFromOptions(assignmentObject.subject_id, this.formOptions.subjects)
        assignmentObject.type = this.getTextValueFromOptions(assignmentObject.type_id, this.formOptions.courseTypes)
        assignmentObject.start_end_times = this.getTextValueFromOptions(assignmentObject.start_end_times_id, this.formOptions.startEndTimes)
        // translate part of term to start and end date
        if (assignmentObject.part_of_term_id) {
          let partOfTerm = this.partsOfTerm.find((partObject) => {
            return partObject.id === assignmentObject.part_of_term_id
          })
          assignmentObject.start_date = partOfTerm.start_date
          assignmentObject.end_date = partOfTerm.end_date
        }
        // assign all undefined or false properties as an empty string
        _.forEach(this.csvDataLabels, function (value, key) {
          if (typeof (assignmentObject[key]) === 'undefined' || !assignmentObject[key]) {
            assignmentObject[key] = ''
          }
        })
      })
      this.csvOutput = array
    }
  }
}
