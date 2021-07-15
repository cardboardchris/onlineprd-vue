import AnyTableService from './anyTable.service'

class AssignmentService extends AnyTableService {
  endpoint = 'assignments'

  saveNewAssignment (data) {
    return this.createNewTableRow(this.endpoint, data)
  }

  getAssignments (params = {}) {
    return this.retrieveTableRows(this.endpoint, params)
  }

  getAssignmentsByUserTerm (params = {}) {
    return this.retrieveTableRows('assignments-by-user-term', params)
  }

  updateAssignment (id, data) {
    return this.updateTableRowById(this.endpoint, id, data)
  }

  deleteAssignment (id) {
    return this.deleteTableRowById(this.endpoint, id)
  }
}

export const assignmentService = new AssignmentService()
