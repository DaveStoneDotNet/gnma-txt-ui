import React                 from 'react'
import { PropTypes }         from 'prop-types'

import ApiStatusIndicator    from '../common/ApiStatusIndicator'
import StatusIndicator       from './StatusIndicator'
import { STATUS_CONSTANTS }  from './StatusIndicatorConstants'

const Footer = (props) =>  {

    let status  = props.status
    let message = props.statusMessage
    let apiStatus = props.apiStatus

    if (apiStatus.count > 0) {
        status = STATUS_CONSTANTS.working
        message = 'Working...'
    }

    const css = `fixed-bottom footer ${status || ''}`

    return <div id="footer" className={ css }>
       
               <footer className="p-2 d-flex">
                   <StatusIndicator status={status} message={message} />
                   <ApiStatusIndicator apiStatus={apiStatus} />
               </footer>
       
           </div>
}

Footer.propTypes = {
                        status:        PropTypes.string.isRequired, 
                        statusMessage: PropTypes.string.isRequired, 
                        apiStatus:     PropTypes.object.isRequired
                   }

export default Footer
