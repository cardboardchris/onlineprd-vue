import AnyTableService from './anyTable.service'

class CommentService extends AnyTableService {
  endpoint = 'comments'

  getCommentsByCommentableObject (params = {}) {
    return this.retrieveTableRows(this.endpoint, params)
  }

  createNewComment (data = {}) {
    return this.createNewTableRow(this.endpoint, data)
  }

  deleteComment (id) {
    return this.deleteTableRowById(this.endpoint, id)
  }
}

export const commentService = new CommentService()
