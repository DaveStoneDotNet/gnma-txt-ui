import * as types from './actionTypes'

export function beginApiCall(apiStatus) { return { type: types.BEGIN_API_CALL, apiStatus: apiStatus } }
export function endApiCall(apiStatus)   { return { type: types.END_API_CALL,   apiStatus: apiStatus } }
export function apiCallError(apiStatus) { return { type: types.API_CALL_ERROR, apiStatus: apiStatus } }

