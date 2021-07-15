import AnyTableService from './anyTable.service'

class LookupFieldsService extends AnyTableService {
  endpoint = 'form-field-lookups'

  getLookupFields (params = {}) {
    return this.retrieveTableRows(this.endpoint, params)
  }
}

export const lookupFieldsService = new LookupFieldsService()
