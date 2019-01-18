import React from 'react'

import StatusWidget from '../common/StatusWidget'

import './splash.css'

const Splash = (props) => {

    return <div className="centered-splash-wrapper">
              <StatusWidget title='connected'   statusBit={props.isAppConnected}     message="no" type="Connection"/>
              <StatusWidget title='initialized' statusBit={props.isAppInitialized}   message="no" />
              <StatusWidget title='data'        statusBit={props.isDataInitialized}    />
              <StatusWidget title='configured'  statusBit={props.isConfigInitialized}  />
              <StatusWidget title='lookups'     statusBit={props.isLookupsInitialized} />
           </div>

}

export default Splash