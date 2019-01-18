import { combineReducers } from 'redux'
import { routerReducer }   from 'react-router-redux'

import apiStatusReducer    from './apiStatusReducer'
import appReducer          from './appReducer'
import notificationReducer from './notificationReducer'

const rootReducer = combineReducers({
                                        routing:       routerReducer, 
                                        apiStatus:     apiStatusReducer, 
                                        app:           appReducer,
                                        notifications: notificationReducer
                                    })

export default rootReducer