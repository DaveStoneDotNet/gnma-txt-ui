import _            from 'lodash'
import moment       from 'moment'

import * as types   from '../actions/actionTypes'
import initialState from '../store/initialState'

// - The whole state of an app is stored in an object tree inside a single store.
// - The only way to change the state tree is to emit an action, an object describing what happened.
// - To specify how actions transform the state tree, you write pure reducers.
// 
// The 'state' parameter passed in will be the 'app' property defined in the combined reducers of 'index.js'...
//
//          const rootReducer = combineReducers({
//                                                 ...
//                                                 app: appReducer
//                                                 ...
//                                             })
// 
// That is, this reducer is specifically managing that 'app' property.
//
// 'app' is currently shaped as follows:
//
//          app: {
//                   user:                 {},
//                   lookups:              {},
//                   isUserInitialized:    false,
//                   isLookupsInitialized: false,
//                   isAppInitialized:     false,
//                   apiStatus:            {}
//               }

// const actionTypeEndsInSuccess = (type) => {
//     return type.substring(type.length - 8) === '_SUCCESS'
// }

export default function appReducer(state = initialState.app, action) {

    let new_state

    switch (action.type) {

        case types.GET_LOOKUPS_SUCCESS:
            new_state = Object.assign({}, state, { lookups: action.lookups, isLookupsInitialized: { isInitialized: true, reason: 0 } })
            return new_state

        case types.GET_CONFIG_SUCCESS:
            new_state = Object.assign({}, state, { config: action.config, isConfigInitialized: { isInitialized: true, reason: 0 } })
            return new_state

        case types.GET_DATA_SUCCESS:
            new_state = Object.assign({}, state, { data: action.data, isDataInitialized: { isInitialized: true, reason: 0 } })
            return new_state

        case types.GET_USER_SUCCESS:
            new_state = Object.assign({}, state, { user: action.user })
            return new_state

        case types.UPDATE_APP_DIMENSIONS:
            new_state = Object.assign({}, state, { appDimensions: action.appDimensions })
            return new_state

        case types.UPDATE_APP_STATUS:
            new_state = Object.assign({}, state, { appStatus: action.appStatus })
            return new_state

        case types.IS_APP_CONNECTED:
            new_state = Object.assign({}, state, { isAppConnected: action.isAppConnected })
            return new_state

        case types.UPDATE_ERRORS:

            let errors = [...state.errors]

            const max_error_count = 10
            
            if (errors.length > max_error_count) {
                errors.shift()
            }

            action.error.index = errors.length
            errors.push(action.error)
            
            new_state = Object.assign({}, state, { errors: errors })
            return new_state

        case types.GET_LOOKUPS_FAILED:
            new_state = Object.assign({}, state, { lookups: [], isLookupsInitialized: { isInitialized: false, reason: action.reason } })
            return new_state

        case types.GET_CONFIG_FAILED:
            new_state = Object.assign({}, state, { config: [], isConfigInitialized: { isInitialized: false, reason: action.reason } })
            return new_state

        case types.GET_DATA_FAILED:
            new_state = Object.assign({}, state, { data: [], isDataInitialized: { isInitialized: false, reason: action.reason } })
            return new_state




        case types.GET_FILE_INFOS:
            new_state = Object.assign({}, state, { textFiles: action.textFiles.FileInfos })
            return new_state

        case types.SORT_FILE_INFOS:
            
            const sortField = action.sortField

            const clonedTextFiles = [...state.textFiles]

            let orderedTexFiles = clonedTextFiles

            switch (sortField.name) {
                case 'Name':
                    orderedTexFiles = _.orderBy(clonedTextFiles, [sortField.name], [sortField.direction])
                    break
                case 'Size':
                    orderedTexFiles = _.orderBy(clonedTextFiles, function(o) { return parseInt(o.Size) }, [sortField.direction])
                    break
                case 'Date':
                    orderedTexFiles = _.orderBy(clonedTextFiles, function(o) { return moment(o.LastWriteTime).format('YYYY-MM-DD HH:mm:ss A') }, [sortField.direction])
                    break
                default:
                    break
            }

            new_state = Object.assign({}, state, { textFiles: orderedTexFiles })
            return new_state

        case types.GET_POOL_RECORD_LAYOUTS:
            new_state = Object.assign({}, state, { poolRecordLayouts: action.poolRecordLayouts })
            return new_state

        case types.GET_GNMA_TEXT_FILE:
            new_state = Object.assign({}, state, { gnmaTextFile: action.gnmaTextFile.Lines, gnmaTextFileName: action.gnmaTextFile.FileName })
            return new_state

        case types.GET_FILE_SHARE_LOCATION:
            new_state = Object.assign({}, state, { fileShareLocation: action.fileShareLocation })
            return new_state

        case types.SAVE_GNMA_TEXT_FILE:
            new_state = Object.assign({}, state, { saveTextFileResponse: action.saveTextFileResult })
            return new_state

        default:
            return state
    }
}
