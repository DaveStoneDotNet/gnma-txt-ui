import React         from 'react'

import { SolidTimesCircle }  from '../common/Icons'
import { SolidDotCircle   }  from '../common/Icons'
import { SolidSync        }  from '../common/Icons'

import './css/is-connected-indicator.css'

const IsConnectedIndicator = (props) =>  {

    let isConnected = props.isConnected
    let text        = ''

    let icon = <SolidDotCircle />

    if (isConnected) {
            icon = <SolidSync />
            text = 'connected'
    } else {
        icon = <SolidTimesCircle />
        text = 'disconnected'
    }

    const css  = `is-connected-indicator small white-a-5 ${props.className || ''}`

    return <div className={ css }>
                <div className='adjust-indicator'>
                    { icon } <span className="is-connected-indicator-text">{ text }</span>
                </div>
            </div>
}

export default IsConnectedIndicator
