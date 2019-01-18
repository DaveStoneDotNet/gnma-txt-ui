import React                 from 'react'
import ReactDOM              from 'react-dom'
import { BrowserRouter }     from 'react-router-dom'
import { Provider }          from 'react-redux'

import { runWithAdal }       from 'react-adal'
import { authContext }       from './adal/adalConfig'

import App                   from './App'

import registerServiceWorker from './registerServiceWorker'

import configureStore        from './state/store/configureStore'

import * as appActions       from './state/actions/appActions'

import 'bootstrap/dist/js/bootstrap'
import 'animate.css/animate.css'

import './scss/site.css'

import './index.css'

const store = configureStore()

store.dispatch(appActions.getConfig())
store.dispatch(appActions.getData())
store.dispatch(appActions.getLookups())
store.dispatch(appActions.getPoolRecordLayouts())
store.dispatch(appActions.getFileShareLocation())

// store.subscribe(() =>
//    console.log(store.getState())
// )

runWithAdal(authContext, () => {
        ReactDOM.render(<Provider store = { store }><BrowserRouter><App /></BrowserRouter></Provider>, document.getElementById('root'))
        registerServiceWorker()
    }
)

