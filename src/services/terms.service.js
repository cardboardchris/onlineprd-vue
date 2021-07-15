import AnyTableService from './anyTable.service'

class TermsService extends AnyTableService {
  endpoint = 'terms'

  createTerm (termObject = {}) {
    return this.createNewTableRow(this.endpoint, termObject)
  }

  getTermById (id, params = {}) {
    return this.retrieveTableRowById(this.endpoint, id, params)
  }

  getTerms (params = {}) {
    return this.retrieveTableRows(this.endpoint, params)
  }

  updateTerm (id, data = {}) {
    return this.updateTableRowById(this.endpoint, id, data)
  }

  deleteTerm (id) {
    return this.deleteTableRowById(this.endpoint, id)
  }
}

export const termsService = new TermsService()
