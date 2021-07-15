import AnyTableService from './anyTable.service'

class DepartmentUserRoleService extends AnyTableService {
  endpoint = 'department-user-roles'

  getDepartmentUserRoles (params = {}) {
    return this.retrieveTableRows(this.endpoint, params)
  }

  createDepartmentUserRole (data = {}) {
    return this.createNewTableRow(this.endpoint, data)
  }

  deleteDepartmentUserRole (id) {
    return this.deleteTableRowById(this.endpoint, id)
  }
}

export const departmentUserRoleService = new DepartmentUserRoleService()
