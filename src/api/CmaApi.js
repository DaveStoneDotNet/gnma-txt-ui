import 'whatwg-fetch'

const API_HEADERS = {
                        'Content-Type': 'application/json',
                        'Accept':       'application/json, text/plain, */*' 
                    }

const url = process.env.REACT_APP_CMA_API

class CmaApi {

    // If the API isn't running (doesn't exist) then a 'TypeError' is thrown.
    // If the API exists, but some other error occurs, such as a 404, then a 
    // 'response' is returned by the API similar to the following:
    // 
    //      - body:       (...)
    //      - bodyUsed:   false
    //      - headers:    Headers {}
    //      - ok:         false
    //      - redirected: false
    //      - status:     404
    //      - statusText: 'Not Found'
    //      - type:       'cors'
    //      - url:        'http://localhost:57755/api/cma/GetData'
    // 
    // The 'getPotentialConnectionError' method below exists to make this 
    // distinction between an existing api that throws some kind of server error 
    // and a non-existing api that is either down or unreachable due, perhaps, to 
    // a mis-configured url.

    static getApiErrorMessage(response, defaultMessage) {
        var message = defaultMessage || 'Failed'
        if (response) {
            if (response.status && response.statusText) {
                message = `${response.status} : ${response.statusText}`
            }
        }
        return message
    }

    static getPotentialConnectionError(ex) {
        if (ex && ex.name === 'TypeError') {
            throw new Error('NOT CONNECTED')
        } else {
            throw ex
        }
    }

    static getResponseError(response) {
        var error = new Error(response.statusText)
        error.response = response
        throw error
    }

    static getData(request) {
        return fetch(`${url}GetData`,
               {
                   headers: API_HEADERS, 
                   method:  'GET' 
               })
               .then(response => {
                    if (response.ok) {
                        return response.json()
                    } else {
                        throw this.getResponseError(response)
                    }
               })
               .catch(ex => { this.getPotentialConnectionError(ex) })
    }

    static postData(request) {
        return fetch(`${url}PostData`,
               {
                   headers: API_HEADERS, 
                   method:  'POST', 
                   body:    JSON.stringify(request)
               })
               .then(response => {
                    if (response.ok) {
                        const data = response.json()
                        return data
                    } else {
                        return { Data: 'POST DATA NOT OK' }
                    }
               })
               .catch(ex => { this.getPotentialConnectionError(ex) })
    }

    static getLookups(request) {
        return fetch(`${url}GetLookups`,
               {
                   headers: API_HEADERS, 
                   method:  'GET' 
               })
               .then(response => {
                    if (response.ok) {
                        return response.json()
                    } else {
                        throw this.getResponseError(response)
                    }
               })
               .catch(error => { this.getPotentialConnectionError(error) })
    }

    static getConfig(request) {
        return fetch(`${url}GetConfig`,
               {
                   headers: API_HEADERS, 
                   method:  'GET' 
               })
               .then(response => {
                    if (response.ok) {
                        return response.json()
                    } else {
                        return { Data: 'GET CONFIG NOT OK' }
                    }
               })
               .catch(ex => { this.getPotentialConnectionError(ex) })
    }

    static getUser(request) {
        return fetch(`${url}GetUser`,
               {
                   headers: API_HEADERS, 
                   method:  'GET' 
               })
               .then(response => {
                    if (response.ok) {
                        return response.json()
                    } else {
                        return { Data: 'GET USER NOT OK' }
                    }
               })
               .catch(ex => { this.getPotentialConnectionError(ex) })
    }

    // ----------------------------------------------------------------------

    static getFileInfos(request) {
        return fetch(`${url}GetFileInfos`,
               {
                   headers: API_HEADERS, 
                   method:  'POST', 
                   body:    JSON.stringify(request)
               })
               .then(response => {
                    if (response.ok) {
                        const data = response.json()
                        return data
                    } else {
                        return { Data: 'GET FILE INFOS NOT OK' }
                    }
               })
               .catch(ex => { this.getPotentialConnectionError(ex) })
    }

    static getGnmaTextFile(request) {
        return fetch(`${url}GetGnmaTextFile`,
               {
                   headers: API_HEADERS, 
                   method:  'POST', 
                   body:    JSON.stringify(request)
               })
               .then(response => {
                    if (response.ok) {
                        const data = response.json()
                        return data
                    } else {
                        return { Data: 'GET GNMA TEXT FILE NOT OK' }
                    }
               })
               .catch(ex => { this.getPotentialConnectionError(ex) })
    }

    static getPoolRecordLayouts(request) {
        return fetch(`${url}GetPoolRecordLayouts`,
               {
                   headers: API_HEADERS, 
                   method:  'GET', 
                   body:    JSON.stringify(request)
               })
               .then(response => {
                    if (response.ok) {
                        const data = response.json()
                        return data
                    } else {
                        return { Data: 'GET POOL RECORD LAYOUTS NOT OK' }
                    }
               })
               .catch(ex => { this.getPotentialConnectionError(ex) })
    }

    static saveGnmaTextFile(request) {
        return fetch(`${url}SaveGnmaTextFile`,
               {
                   headers: API_HEADERS, 
                   method:  'POST', 
                   body:    JSON.stringify(request)
               })
               .then(response => {
                    if (response.ok) {
                        const data = response.json()
                        return data
                    } else {
                        return { Data: 'SAVE GNMA TEXT FILE NOT OK' }
                    }
               })
               .catch(ex => { this.getPotentialConnectionError(ex) })
    }

    static getFileShareLocation() {
        return fetch(`${url}GetFileShareLocation`,
               {
                   headers: API_HEADERS, 
                   method:  'GET' 
               })
               .then(response => {
                    if (response.ok) {
                        const data = response.json()
                        return data
                    } else {
                        return { Data: 'SAVE FILE SHARE LOCATION NOT OK' }
                    }
               })
               .catch(ex => { this.getPotentialConnectionError(ex) })
    }

}

export default CmaApi
