import axios from 'axios'
import authHeader from './auth-header'

class MailService {
  sendMail (params = {}) {
    return axios.get(process.env.VUE_APP_API_URL + 'mail',
      {
        headers: authHeader(),
        params: params
      })
      .catch(function (error) {
        console.log(error)
      })
  }
}

export const mailService = new MailService()
