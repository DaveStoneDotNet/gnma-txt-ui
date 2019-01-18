import { AuthenticationContext } from 'react-adal'
import { adalFetch }             from 'react-adal'

export const adalConfig = {
                              tenant:                process.env.REACT_APP_ADAL_TENNANT,
                              clientId:              process.env.REACT_APP_ADAL_CLIENT,
                              endpoints:             {
                                                       api: process.env.REACT_APP_ADAL_CLIENT,
                                                     },
                              cacheLocation:         'localStorage',
                              postLogoutRedirectUri: window.location.origin
                          }

export const authContext = new AuthenticationContext(adalConfig)

export function loginAuthenticatedUser() {
    const authenticatedUser = { isAuthenticated: false }
    const cachedUser = authContext.getCachedUser()
    if (cachedUser) {
        authenticatedUser.isAuthenticated = true
        authenticatedUser.userName        = cachedUser.userName
        if (cachedUser.profile) {
            authenticatedUser.firstName   = cachedUser.profile.given_name
            authenticatedUser.lastName    = cachedUser.profile.family_name
            authenticatedUser.displayName = cachedUser.profile.name
        }
    }
    return authenticatedUser
}

export const adalApiFetch = (fetch, url, options) => adalFetch(authContext, adalConfig.endpoints.api, fetch, url, options)
