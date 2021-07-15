import AnyTableService from './anyTable.service'

class EmailTemplateService extends AnyTableService {
  endpoint = 'email-templates'

  createTemplate (termObject = {}) {
    return this.createNewTableRow(this.endpoint, termObject)
  }

  getTemplateById (id, params = {}) {
    return this.retrieveTableRowById(this.endpoint, id, params)
  }

  getTemplates (params = {}) {
    return this.retrieveTableRows(this.endpoint, params)
  }

  updateTemplate (id, data = {}) {
    return this.updateTableRowById(this.endpoint, id, data)
  }

  deleteTemplate (id) {
    return this.deleteTableRowById(this.endpoint, id)
  }
}

export const emailTemplateService = new EmailTemplateService()
