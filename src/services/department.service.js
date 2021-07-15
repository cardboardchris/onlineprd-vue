import AnyTableService from './anyTable.service'

class DepartmentService extends AnyTableService {
  endpoint = 'departments'

  createDepartment (departmentObject = {}) {
    return this.createNewTableRow(this.endpoint, departmentObject)
  }

  getDepartment (id, params = {}) {
    return this.retrieveTableRowById(this.endpoint, id, params)
  }

  getDepartments (params = {}) {
    return this.retrieveTableRows(this.endpoint, params)
  }

  updateDepartment (id, data = {}) {
    return this.updateTableRowById(this.endpoint, id, data)
  }

  deleteDepartment (id) {
    return this.deleteTableRowById(this.endpoint, id)
  }
}

export const departmentService = new DepartmentService()
