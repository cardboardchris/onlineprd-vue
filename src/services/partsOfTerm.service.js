import AnyTableService from './anyTable.service'

class TermsService extends AnyTableService {
  endpoint = 'parts-of-term'

  createPartOfTerm (partOfTermObject = {}) {
    return this.createNewTableRow(this.endpoint, partOfTermObject)
  }

  getPartsOfTerm (params = {}) {
    return this.retrieveTableRows(this.endpoint, params)
  }

  updatePartOfTerm (id, data = {}) {
    return this.updateTableRowById(this.endpoint, id, data)
  }

  deletePartOfTerm (id) {
    return this.deleteTableRowById(this.endpoint, id)
  }
}

export const partsOfTermService = new TermsService()
