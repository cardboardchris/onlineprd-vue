import AnyTableService from './anyTable.service'

class TagService extends AnyTableService {
  endpoint = 'tags'

  saveTag (tagObject = {}) {
    return this.createNewTableRow(this.endpoint, tagObject)
  }

  getTags (params = {}) {
    return this.retrieveTableRowById(this.endpoint, params)
  }

  deleteTag (id) {
    return this.deleteTableRowById(this.endpoint, id)
  }

  // deleteTags (idsArray) {
  //   return axios.delete(process.env.VUE_APP_API_URL + 'tags',
  //     {
  //       data: idsArray,
  //       headers: authHeader()
  //     })
  //     .catch(function (error) {
  //       console.log(error)
  //     })
  // }
}

export const tagService = new TagService()
