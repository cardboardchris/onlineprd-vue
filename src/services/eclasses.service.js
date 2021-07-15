import AnyTableService from './anyTable.service'

class EClassesService extends AnyTableService {
  endpoint = 'eclasses'

  getEClasses (params = {}) {
    return this.retrieveTableRows(this.endpoint, params)
  }

  updateEclass (id, data = {}) {
    return this.updateTableRowById(this.endpoint, id, data)
  }

  createEclass (eclassObject = {}) {
    return this.createNewTableRow(this.endpoint, eclassObject)
  }

  deleteEclass (id) {
    return this.deleteTableRowById(this.endpoint, id)
  }
}

export const eClassesService = new EClassesService()
