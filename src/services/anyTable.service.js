import axios from 'axios'
import authHeader from './auth-header'

export default class AnyTableService {
  createNewTableRow (table, data = {}) {
    if (!table) {
      return Promise.reject(new Error('no table name given'))
    } else if (!data) {
      return Promise.reject(new Error('no data sent'))
    } else {
      return axios.post(process.env.VUE_APP_API_URL + table,
        data,
        {
          headers: authHeader()
        })
    }
  }

  retrieveTableRows (table, params = {}) {
    if (!table) {
      return Promise.reject(new Error('no table name given'))
    } else {
      return axios.get(process.env.VUE_APP_API_URL + table + '/',
        {
          headers: authHeader(),
          params: params
        })
    }
  }

  retrieveTableRowById (table, id, params = {}) {
    if (!table) {
      return Promise.reject(new Error('no table name given'))
    } else if (!id) {
      return Promise.reject(new Error('no row id given'))
    } else {
      return axios.get(process.env.VUE_APP_API_URL + table + '/' + id,
        {
          headers: authHeader(),
          params: params
        })
    }
  }

  updateTableRowById (table, id, data = {}) {
    if (!table) {
      return Promise.reject(new Error('no table name given'))
    } else if (!id) {
      return Promise.reject(new Error('no row id given'))
    } else if (!data) {
      return Promise.reject(new Error('no data sent'))
    } else {
      return axios.put(process.env.VUE_APP_API_URL + table + '/' + id,
        data,
        {
          headers: authHeader()
        })
    }
  }

  deleteTableRowById (table, id) {
    if (!table) {
      return Promise.reject(new Error('no table name given'))
    } else if (!id) {
      return Promise.reject(new Error('no row id given'))
    } else {
      return axios.delete(process.env.VUE_APP_API_URL + table + '/' + id,
        {
          headers: authHeader()
        })
    }
  }
}
