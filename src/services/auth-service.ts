// inspired by this implementation: https://bezkoder.com/jwt-vue-vuex-authentication/
import { OAuth2AuthCodePKCE } from '@bity/oauth2-auth-code-pkce'
import axios from 'axios'
import authHeader from '@/services/auth-header'

const PARAMS = {
  authorizationUrl: process.env.VUE_APP_AUTHORIZATION_URL,
  tokenUrl: process.env.VUE_APP_TOKEN_URL,
  clientId: process.env.VUE_APP_CLIENT_ID,
  scopes: [],
  redirectUrl: process.env.VUE_APP_REDIRECT_URL,
  onAccessTokenExpiry (refreshAccessToken) {
    if (process.env.VUE_APP_DEBUG) {
      console.log('Expired! Access token needs to be renewed.')
      alert('We will try to get a new access token via grant code or refresh token.')
    }
    return refreshAccessToken()
  },
  onInvalidGrant (refreshAuthCodeOrRefreshToken) {
    if (process.env.VUE_APP_DEBUG) {
      console.log('Expired! Auth code or refresh token needs to be renewed.')
      alert('Redirecting to auth server to obtain a new auth grant code.')
    }
    return refreshAuthCodeOrRefreshToken()
  }
}

export class AuthService {
  private oauth: OAuth2AuthCodePKCE;

  public constructor () {
    this.oauth = new OAuth2AuthCodePKCE(PARAMS)
  }

  public authorize () {
    return this.oauth.fetchAuthorizationCode()
  }

  public login () {
    return this.oauth.isReturningFromAuthServer().then(hasAuthCode => {
      return this.oauth
        .getAccessToken()
        .then((token) => {
          return Promise.resolve(token.token.value)
        })
    }).catch(error => {
      return Promise.reject(error)
    })
  }

  public logout () {
    this.oauth.reset()
    return Promise.resolve()
    // TODO: when endpoint is fixed, delete the lines above, and uncomment the ones below
    // return axios.get(process.env.VUE_APP_LOGOUT_URL, { headers: authHeader() }).then(response => {
    //   this.oauth.reset()
    //   return Promise.resolve(response)
    // }, reason => {
    //   return Promise.reject(reason)
    // })
  }
}
