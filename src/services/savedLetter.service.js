import AnyTableService from './anyTable.service'

class SentLetterService extends AnyTableService {
  endpoint = 'letters'

  saveNewLetter (data) {
    return this.createNewTableRow(this.endpoint, data)
  }

  getLetter (params = {}) {
    return this.retrieveTableRows(this.endpoint, params)
  }

  getLettersByAssignment (params = {}) {
    return this.retrieveTableRows('letters-by-assignment', params)
  }

  updateLetter (id, data) {
    return this.updateTableRowById(this.endpoint, id, data)
  }

  deleteLetter (id) {
    return this.deleteTableRowById(this.endpoint, id)
  }
}

export const sentLetterService = new SentLetterService()
