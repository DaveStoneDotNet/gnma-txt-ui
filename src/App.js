import React                      from 'react'
import { Component }              from 'react'
import PropTypes                  from 'prop-types'

import { withRouter }             from 'react-router-dom'

import { connect }                from 'react-redux'
import { bindActionCreators }     from 'redux'

import Shell                      from './containers/shell/Shell'
import SplashPage                 from './containers/splash/SplashPage'

import BodyTag                    from './components/common/BodyTag'
import NavBar                     from './components/navbar/NavBar'
import Footer                     from './components/footer/Footer'

import { authContext }            from './adal/adalConfig'
import { loginAuthenticatedUser } from './adal/adalConfig'

import { STATUS_CONSTANTS }       from './components/footer/StatusIndicatorConstants'

import * as appActions            from './state/actions/appActions'

import { isInitializedSelector }  from './selectors'
import { isConnectedSelector }    from './selectors'

import ReduxNotificationCenter    from './components/notifications/ReduxNotificationCenter'

class App extends Component {

    constructor(props) {
        super(props)

        this.state = { 
                         status:            STATUS_CONSTANTS.working, 
                         statusMessage:     null, 
                         isDark:            true, 
                         authenticatedUser: {
                                                isAuthenticated: false
                                            } 
                      }
    }    

    componentDidMount() {

        this.login()
    }

    login() {
        const authenticatedUser = loginAuthenticatedUser()
        if (authenticatedUser) {
            this.setState({authenticatedUser: authenticatedUser})
        }
    }

    onLogOut = () => {
        authContext.logOut()
    }

    onThemeChanged = () => {

        this.setState({ isDark: !this.state.isDark })
    }

    getSplash = () => {

        const { app, isAppInitialized, isConnected } = this.props

        const b = 0
        if (b === 0){
            return <SplashPage errors={app.errors} isAppInitialized={isAppInitialized} isAppConnected={isConnected} isConfigInitialized={app.isConfigInitialized.isInitialized} isDataInitialized={app.isDataInitialized.isInitialized} isLookupsInitialized={app.isLookupsInitialized.isInitialized} />
        } else {
            return null
        }
    }

    render() {

        const { isDark, authenticatedUser } = this.state
        const { app, apiStatus } = this.props
        const splash = this.getSplash()

        return (
                <div id="app">

                    <BodyTag isDark={isDark} />

                    <NavBar onThemeChanged    = {this.onThemeChanged} 
                            onLogOut          = {this.onLogOut} 
                            authenticatedUser = {authenticatedUser} 
                            isDark            = {isDark} 
                            apiStatus         = {apiStatus} />

                    <Shell />

                    <Footer status        = {app.appStatus.status} 
                            statusMessage = {app.appStatus.message} 
                            apiStatus     = {apiStatus} />

                    <ReduxNotificationCenter />

                    {splash}

                </div>
               )
    }
}

const mapStateToProps = (state) => {

    return { 
               app:              state.app, 
               apiStatus:        state.apiStatus, 
               notifications:    state.notifications, 
               isAppInitialized: isInitializedSelector(state), 
               isConnected:      isConnectedSelector(state)
           }
}

const mapDispatchToProps = (dispatch) => { 
    return {
               actions: {
                            appActions: bindActionCreators(appActions, dispatch)
                        }
           }
}

// -------------------------------------------------------------------------------------------------------------------------------------
//'withRouter'
// -------------------------------------------------------------------------------------------------------------------------------------
// Adds router-specific objects such as 'history', 'location', and 'match' to 'props' whenever the wrapped component renders.

// Important Note
// -------------------------------------------------------------------------------------------------------------------------------------
// 'withRouter' does not subscribe to location changes like React Redux's connect does for state changes. 
// Instead, re-renders after location changes propagate out from the <Router> component. 
// This means that 'withRouter' does not re-render on route transitions unless its parent component re-renders. 
// If you are using 'withRouter' to prevent updates from being blocked by 'shouldComponentUpdate', it is important 
// that 'withRouter' wraps the component that implements 'shouldComponentUpdate'. 
// -------------------------------------------------------------------------------------------------------------------------------------

App.contextTypes = {
                       store: PropTypes.object
                   }

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))
