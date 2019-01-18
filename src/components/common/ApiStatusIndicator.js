import React                 from 'react'
import PropTypes             from 'prop-types'

import { SolidDotCircle   }  from '../common/Icons'
import { SolidSync        }  from '../common/Icons'

import './css/api-status-indicator.css'

// Renders an icon and message based on a status constant (e.g. success, warning, error, etc.)

const ApiStatusIndicator = (props) =>  {

    let apiStatus = props.apiStatus
    let text      = props.message || 'Ready'

    let icon = <SolidDotCircle />

    if (apiStatus.count > 0) {
        icon = <SolidSync />
        text = 'working...'
    } else {
        icon = <div />
        text = ''
    }

    const css = `status-indicator small ${props.className || ''}`

    return <div className={ css }>
               { icon } <span className="status-indicator-text">{ text }</span>
           </div>
}

ApiStatusIndicator.propTypes = {
                                   apiStatus: PropTypes.object.isRequired
                               }

export default ApiStatusIndicator
