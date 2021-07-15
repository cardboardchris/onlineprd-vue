import axios from 'axios'
import authHeader from './auth-header'
import AnyTableService from '@/services/anyTable.service'

class UserService extends AnyTableService {
  endpoint = 'users'

  getCurrentUser () {
    return axios.get(process.env.VUE_APP_API_URL + 'userinfo',
      {
        headers: authHeader()
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  getCountOfUnverified () {
    return axios.get(process.env.VUE_APP_API_URL + 'countofunverified',
      {
        headers: authHeader()
      })
  }

  createUser (userObject = {}) {
    return this.createNewTableRow(this.endpoint, userObject)
  }

  getUserById (id, params = {}) {
    return this.retrieveTableRowById(this.endpoint, id, params)
  }

  getUsers (params = {}) {
    return this.retrieveTableRows(this.endpoint, params)
  }

  updateUser (id, data = {}) {
    return this.updateTableRowById(this.endpoint, id, data)
  }

  deleteUser (id) {
    return this.deleteTableRowById(this.endpoint, id)
  }
}

export const userService = new UserService()
