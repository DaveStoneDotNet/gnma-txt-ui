import * as types   from '../actions/actionTypes'
import initialState from '../store/initialState'

const apiStatusReducer = (state = initialState.apiStatus, action) => {

    let new_state = state
    const messages = [...state.messages]
    switch (action.type) {

        case types.BEGIN_API_CALL:

            if (action.apiStatus) {
                messages.push(action.apiStatus)
                const apiStatus = { count: state.count + 1, messages: messages }
                new_state = Object.assign({}, state, apiStatus)
            }
            else {
                const apiStatus = { count: state.count + 1, messages: messages }
                new_state = Object.assign({}, state, apiStatus)
            }

            return new_state

        case types.END_API_CALL:
        case types.API_CALL_ERROR:

            if (action.apiStatus) {
                const messageIndex = messages.findIndex((m) => m.key === action.apiStatus.key)
                messages.splice(messageIndex, 1)
                const apiStatus = { count: state.count - 1, messages: messages }
                new_state = Object.assign({}, state, apiStatus)
            } else {
                const apiStatus = { count: state.count - 1, messages: messages }
                new_state = Object.assign({}, state, apiStatus)
            }
            
            return new_state

        default:
            return state
    }
    
}

export default apiStatusReducer