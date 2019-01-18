    
import CmaApi                    from '../../api/CmaApi'

import * as types                from './actionTypes'
import * as apiActions           from './apiStatusActions'

import { STATUS_CONSTANTS }      from '../../components/footer/StatusIndicatorConstants'

// -----------------------------------------------------------------------------------------------------------------------
// Actions:
// -----------------------------------------------------------------------------------------------------------------------
// 
// Events happening in an app are called 'actions'. They're just plain objects describing events. They must have a 
// 'type' key. The second property contains data, is optional, and can be of any type.
// 
// Instead of mutating state directly, you specify mutations you want to happen with plain objects called 'actions'. 
// Then you write a special function called a 'reducer' to decide how every action transforms the entire application's state.
// 
// To specify how the state tree is transformed by actions, you write pure reducers.
// 
// Reducers are just pure functions that take the previous state and an action, and return the next state. Remember to 
// return NEW state objects, instead of mutating the previous state. You can start with a single reducer, and as your app 
// grows, split it off into smaller reducers that manage specific parts of the state tree. Because reducers are just 
// functions, you can control the order in which they are called, pass additional data, or even make reusable reducers for 
// common tasks such as pagination.
// 
// An action describes user intent.
// 
//      1) Store gets notified of action.
//      2) Store sends action to reducers.
//      3) Reducers accept state and return new state.
// 
// Once an action is created, you need a function which will 'handle' that action, and that's where reducers come in.
// Reducers are just functions which accept a state, an action, and returns a new state.
// 
// *ALL* reducers are called when an action is dispatched.
// 
// These ___SUCCESS actions don't fire until all the responses have been asynchronously returned by the API calls.
// 
// -----------------------------------------------------------------------------------------------------------------------

// The parameter name of this function is arbitrary. You could name it 'monkey', 'data', 'home', whatever...
// Shown below, the parameter name I'm referring to is 'data'. I many cases, this will typically just be 
// a 'response' returned by an api.
// The property name of the return object is significant however, and represents the property name of the
// property being updated as indicated by 'initialState.js'. This name is NOT arbitrary and must be 
// referenced as 'home' since that's the property intended to be updated/replaced by the corresponding 
// reducer. For example, suppose you drunk and you typed 'monkey' instead of 'home'...
//  
//      export function getDataSuccess(data) { return { type: types.GET_DATA_SUCCESS, home:   data  } }   CORRECT
//      export function getDataSuccess(data) { return { type: types.GET_DATA_SUCCESS, monkey: data  } }   WRONG
//
// If you typed 'monkey' instead of 'home' then nothing would get updated and no error would occur, but 
// most importantly, 'home' would NOT be updated.

export function getLookupsSuccess(data)         { return { type: types.GET_LOOKUPS_SUCCESS,         lookups:             data } }
export function getConfigSuccess(data)          { return { type: types.GET_CONFIG_SUCCESS,          config:              data } }
export function getDataSuccess(data)            { return { type: types.GET_DATA_SUCCESS,            data:                data } }
export function getUserSuccess(user)            { return { type: types.GET_USER_SUCCESS,            user:                user } }
export function updateAppDimensions(data)       { return { type: types.UPDATE_APP_DIMENSIONS,       appDimensions:       data } }
export function updateAppStatus(data)           { return { type: types.UPDATE_APP_STATUS,           appStatus:           data } }
export function updateAppErrors(data)           { return { type: types.UPDATE_ERRORS,               error:               data } }
export function updateIsAppConnected(data)      { return { type: types.IS_APP_CONNECTED,            isAppConnected:      data } }

export function getLookupsFailed(data)          { return { type: types.GET_LOOKUPS_FAILED,          reason:              data } }
export function getConfigFailed(data)           { return { type: types.GET_CONFIG_FAILED,           reason:              data } }
export function getDataFailed(data)             { return { type: types.GET_DATA_FAILED,             reason:              data } }

// -----------------------------------------------------------------------------------------------------------------------

export function getFileInfosSuccess(data)         { return { type: types.GET_FILE_INFOS,            textFiles:           data } }
export function sortFileInfos(data)               { return { type: types.SORT_FILE_INFOS,           sortField:           data } }
export function getPoolRecordLayoutsSuccess(data) { return { type: types.GET_POOL_RECORD_LAYOUTS,   poolRecordLayouts:   data } }
export function getGnmaTextFileSuccess(data)      { return { type: types.GET_GNMA_TEXT_FILE,        gnmaTextFile:        data } }
export function getFileShareLocationSuccess(data) { return { type: types.GET_FILE_SHARE_LOCATION,   fileShareLocation:   data } }
export function saveGnmaTextFileSuccess(data)     { return { type: types.SAVE_GNMA_TEXT_FILE,       saveTextFileResult:  data } }

// -----------------------------------------------------------------------------------------------------------------------
// Thunks:
// -----------------------------------------------------------------------------------------------------------------------
// A thunk always returns a function that accepts a dispatch....
// 
//      return function (dispatch) 
// 
// ... this wrapper function will exist in every thunk.
// 
// -----------------------------------------------------------------------------------------------------------------------

function getErrorReason(error) {
    let reason = 0
    if (error) {
        if ((error.name && error.name === 'Error') && (error.message && error.message === 'NOT CONNECTED')){
            reason = 1
        } else {
            reason = 2
        }
    }

    return reason
}

export function getLookups() {
    return function (dispatch) {
        dispatch(apiActions.beginApiCall({ key: 'lookups', type: 'get', dateTime: new Date() }))
        return CmaApi.getLookups()
            .then(response => {
                dispatch(updateAppStatus({ status: STATUS_CONSTANTS.success, message: 'Lookups Successful' }))
                dispatch(getLookupsSuccess(response))
            })
            .catch((error) =>  { 
                dispatch(updateAppStatus({ status: STATUS_CONSTANTS.error, message: 'Failed to get Lookups' }))
                dispatch(updateErrors({ title: 'Failed to get Lookups', error: error }))
                dispatch(getLookupsFailed(getErrorReason(error)))
            })
            .finally(() => dispatch(apiActions.endApiCall({ key: 'lookups' })))
    }
}

export function getConfig() {
    return function (dispatch) {
        dispatch(apiActions.beginApiCall({ key: 'config', type: 'get', dateTime: new Date() }))
        return CmaApi.getConfig()
            .then(response => {
                dispatch(updateAppStatus({ status: STATUS_CONSTANTS.success, message: 'Configuration Successful' }))
                dispatch(getConfigSuccess(response))
            })
            .catch((error) =>  {
                dispatch(updateAppStatus({ status: STATUS_CONSTANTS.error, message: 'Failed to get Config' }))
                dispatch(updateErrors({ title: 'Failed to get Config', error: error }))
                dispatch(getConfigFailed(getErrorReason(error)))
            })
            .finally(() => dispatch(apiActions.endApiCall({ key: 'config' })))
    }
}

export function getData() {
    return function (dispatch) {
        dispatch(apiActions.beginApiCall({ key: 'data', type: 'get', dateTime: new Date() }))
        return CmaApi.getData()
            .then(response => {
                dispatch(updateAppStatus({ status: STATUS_CONSTANTS.success, message: 'Data Successful' }))
                dispatch(getDataSuccess(response))
            })
            .catch((error) => {
                dispatch(updateAppStatus({ status: STATUS_CONSTANTS.error, message: 'Failed to get Data' }))
                dispatch(updateErrors({ title: 'Failed to get Data', error: error }))
                dispatch(getDataFailed(getErrorReason(error)))
            })
            .finally(() => dispatch(apiActions.endApiCall({ key: 'data' })))
    }
}

export function getUser() {
    return function (dispatch) {
        dispatch(apiActions.beginApiCall({ key: 'user', type: 'get', dateTime: new Date() }))
        return CmaApi.getUserProfile()
            .then(response => {
                dispatch(updateAppStatus({ status: STATUS_CONSTANTS.success, message: 'User Profile Successful' }))
                dispatch(getUserSuccess(response))
            })
            .catch((error) => {
                dispatch(updateAppStatus({ status: STATUS_CONSTANTS.error, message: 'Failed to get User' }))
                dispatch(updateErrors({ title: 'Failed to get User', error: error }))
            })
            .finally(() => dispatch(apiActions.endApiCall({ key: 'user' })))
    }
}

export function updateDimensions(appDimensions) {
    return function (dispatch) {
        return dispatch(updateAppDimensions(appDimensions))
    }
}

export function updateStatus(appStatus) {
    return function (dispatch) {
        return dispatch(updateAppStatus(appStatus))
    }
}

export function updateErrors(error) {
    return function (dispatch) {
        return dispatch(updateAppErrors(error))
    }
}

// ----------------------------------------------------------------------

export function getFileInfos() {
    return function (dispatch) {
        dispatch(apiActions.beginApiCall({ key: 'get-file-infos', type: 'get', dateTime: new Date() }))
        return CmaApi.getFileInfos({ })
            .then(response => {

                dispatch(updateAppStatus({ status: STATUS_CONSTANTS.success, message: 'GET File Infos Successful' }))
                dispatch(getFileInfosSuccess(response))
            })
            .catch((error) => {
                dispatch(updateAppStatus({ status: STATUS_CONSTANTS.error, message: 'Failed to GET File Infos' }))
                dispatch(updateErrors({ title: 'Failed to GET File Infos', error: error }))
            })
            .finally(() => dispatch(apiActions.endApiCall({ key: 'get-file-infos' })))
    }
}

export function getPoolRecordLayouts(request) {
    return function (dispatch) {
        dispatch(apiActions.beginApiCall({ key: 'get-pool-record-layouts', type: 'get', dateTime: new Date() }))
        return CmaApi.getPoolRecordLayouts(request)
            .then(response => {

                dispatch(updateAppStatus({ status: STATUS_CONSTANTS.success, message: 'GET Pool Record Layouts Successful' }))
                dispatch(getPoolRecordLayoutsSuccess(response))
            })
            .catch((error) => {
                dispatch(updateAppStatus({ status: STATUS_CONSTANTS.error, message: 'Failed to GET Pool Record Layouts' }))
                dispatch(updateErrors({ title: 'Failed to GET Pool Record Layouts', error: error }))
            })
            .finally(() => dispatch(apiActions.endApiCall({ key: 'get-pool-record-layouts' })))
    }
}

export function getGnmaTextFile(request) {
    return function (dispatch) {
        dispatch(apiActions.beginApiCall({ key: 'get-gnma-text-file', type: 'get', dateTime: new Date() }))
        return CmaApi.getGnmaTextFile(request)
            .then(response => {

                dispatch(updateAppStatus({ status: STATUS_CONSTANTS.success, message: 'GET GNMA Text File Successful' }))
                dispatch(getGnmaTextFileSuccess(response))
            })
            .catch((error) => {
                dispatch(updateAppStatus({ status: STATUS_CONSTANTS.error, message: 'Failed to GET GNMA Text File' }))
                dispatch(updateErrors({ title: 'Failed to GET GNMA Text File', error: error }))
            })
            .finally(() => dispatch(apiActions.endApiCall({ key: 'get-gnma-text-file' })))
    }
}

export function getFileShareLocation() {
    return function (dispatch) {
        dispatch(apiActions.beginApiCall({ key: 'get-file-share-location', type: 'get', dateTime: new Date() }))
        return CmaApi.getFileShareLocation()
            .then(response => {

                dispatch(updateAppStatus({ status: STATUS_CONSTANTS.success, message: 'GET File Share Location Successful' }))
                dispatch(getFileShareLocationSuccess(response))
            })
            .catch((error) => {
                dispatch(updateAppStatus({ status: STATUS_CONSTANTS.error, message: 'Failed to GET File Share Location' }))
                dispatch(updateErrors({ title: 'Failed to GET File Share Location ', error: error }))
            })
            .finally(() => dispatch(apiActions.endApiCall({ key: 'get-file-share-location' })))
    }
}

export function saveGnmaTextFile(request) {
    return function (dispatch) {
        dispatch(apiActions.beginApiCall({ key: 'save-gnma-text-file', type: 'post', dateTime: new Date() }))
        return CmaApi.saveGnmaTextFile(request)
            .then(response => {

                dispatch(updateAppStatus({ status: STATUS_CONSTANTS.success, message: 'Successfuly saved GNMA Text File' }))
                dispatch(saveGnmaTextFileSuccess(response))
            })
            .catch((error) => {
                dispatch(updateAppStatus({ status: STATUS_CONSTANTS.error, message: 'Failed to SAVE GNMA Text File' }))
                dispatch(updateErrors({ title: 'Failed to SAVE GNMA Text File', error: error }))
            })
            .finally(() => dispatch(apiActions.endApiCall({ key: 'save-gnma-text-file' })))
    }
}
