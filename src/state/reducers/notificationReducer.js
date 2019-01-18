import * as types   from '../actions/actionTypes'
import initialState from '../store/initialState'

const notificationReducer = (state = initialState.notifications, action) => {

    switch (action.type) {

        case types.ADD_NOTIFICATION:

            const { type, ...rest } = action;

            const new_state = [
                                ...state,
                                { ...rest, uid: action.uid }
                              ]

            return new_state

            
        case types.REMOVE_NOTIFICATION:

            return state.filter(notification => {
              return notification.uid !== action.uid;
            })            


        default:
        
            return state
    }
    
}

export default notificationReducer