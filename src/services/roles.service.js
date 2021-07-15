import AnyTableService from './anyTable.service'

class RolesService extends AnyTableService {
  endpoint = 'roles'

  getRoles (params = {}) {
    return this.retrieveTableRows(this.endpoint, params)
  }
}

export const rolesService = new RolesService()
