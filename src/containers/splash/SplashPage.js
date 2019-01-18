import React         from 'react'
import { Component } from 'react'

import Splash        from '../../components/splash/Splash'
import ErrorList     from '../../components/common/ErrorList'

import './splash-page.css'

class SpashPage extends Component {

    render() {

        const { isAppInitialized, isAppConnected, isConfigInitialized, isDataInitialized, isLookupsInitialized } = this.props

        const errors = this.props.errors ? this.props.errors : []

        const splashCss = isAppInitialized ? 'hidden-splash' : 'splash-container'

        return (
                   <div className={splashCss}>
   
                        <Splash isAppInitialized={ isAppInitialized} isAppConnected={ isAppConnected} isConfigInitialized={ isConfigInitialized} isDataInitialized={ isDataInitialized} isLookupsInitialized={ isLookupsInitialized} />
   
                        <ErrorList errors={errors} />
                   </div>
               )
    }
}

export default SpashPage
