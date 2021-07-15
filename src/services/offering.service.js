import AnyTableService from './anyTable.service'

class OfferingService extends AnyTableService {
  endpoint = 'offerings'

  saveNewOffering (offeringObject) {
    return this.createNewTableRow(this.endpoint, offeringObject)
  }

  updateOffering (id, data) {
    return this.updateTableRowById(this.endpoint, id, data)
  }

  deleteOffering (id) {
    return this.deleteTableRowById(this.endpoint, id)
  }
}

export const offeringService = new OfferingService()
