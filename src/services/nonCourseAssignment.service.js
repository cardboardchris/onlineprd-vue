import AnyTableService from './anyTable.service'

class NonCourseAssignmentService extends AnyTableService {
  endpoint = 'non-course-assignments'

  getNonCourseAssignments (params = {}) {
    return this.retrieveTableRows(this.endpoint, params)
  }

  saveNewNonCourseAssignment (assignmentObject) {
    return this.createNewTableRow(this.endpoint, assignmentObject)
  }

  updateNonCourseAssignment (id, data) {
    return this.updateTableRowById(this.endpoint, id, data)
  }

  deleteNonCourseAssignment (id) {
    return this.deleteTableRowById(this.endpoint, id)
  }
}

export const nonCourseAssignmentService = new NonCourseAssignmentService()
