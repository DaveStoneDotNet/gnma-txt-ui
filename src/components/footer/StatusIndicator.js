import React                 from 'react'
import PropTypes             from 'prop-types'
import { Component }         from 'react'
import { connect }           from 'react-redux'

import { SolidTimesCircle }  from '../common/Icons'
import { SolidDotCircle   }  from '../common/Icons'
import { SolidSync        }  from '../common/Icons'

import { STATUS_CONSTANTS }  from './StatusIndicatorConstants'

import NotificationTimer     from '../notifications/NotificationTimer'

import * as appActions       from '../../state/actions/appActions'

import './status-indicator.css'

// Renders an icon and message based on a status constant (e.g. success, warning, error, etc.)

class StatusIndicator extends Component   {

    constructor(props) {

        super(props)

        this.state = {
                         isVisible: undefined
                     }
    
        this.notificationTimer    = null
        this.isComponentMounted   = false
        this.timeoutMilliseconds  = 10 * 1000
    }

    static propTypes = {
                           status    : PropTypes.string, 
                           message   : PropTypes.string, 
                           className : PropTypes.string
                       }

    hideNotification = () => {

        if (this.notificationTimer) {
            this.notificationTimer.clear()
        }
        this.props.dispatch( appActions.updateAppStatus({status: STATUS_CONSTANTS.ready, message: 'READY' }) )
    }


    startTimer = () => {
        if (this.notificationTimer == null) {
            this.notificationTimer = new NotificationTimer(this.hideNotification, this.timeoutMilliseconds)
        } else {
            if (this.notificationTimer) {
                this.notificationTimer.resume()
            }
        }
    }

    stopTimer = () => {
        if (this.notificationTimer != null) {
            this.notificationTimer.clear()
        }
    }

    render() { 
    
        let status = this.props.status
        let text   = this.props.message || 'Ready'
    
        let icon = <SolidDotCircle />

        let isTimed = true
    
        switch (status) {
            case STATUS_CONSTANTS.success:
                icon = <SolidDotCircle />
                break;
            case STATUS_CONSTANTS.error:
                icon = <SolidTimesCircle />
                text = this.props.message || 'Error'
                break;
            case STATUS_CONSTANTS.warning:
                icon = <SolidTimesCircle />
                text = this.props.message || 'Warning'
                break;
            case STATUS_CONSTANTS.info:
                icon = <SolidDotCircle />
                break;
            case STATUS_CONSTANTS.default:
                icon = <SolidDotCircle />
                break;
            case STATUS_CONSTANTS.working:
                icon = <SolidSync className="fa-spin" />
                text = this.props.message || 'Working...'
                isTimed = false
                break;
            case STATUS_CONSTANTS.ready:
                icon = <SolidDotCircle />
                text = this.props.message || 'READY'
                isTimed = false
                break;
            default:
                break;
        }
    
        const css  = `status-indicator small ${this.props.className || ''}`

        if (isTimed) {
            this.startTimer()
        } else {
            this.stopTimer()
        }

        return <div className={ css }>
                   { icon } <span className="status-indicator-text">{ text }</span>
               </div>
    }
}

StatusIndicator.propTypes = {
                                status:  PropTypes.string.isRequired, 
                                message: PropTypes.string.isRequired
                            }

StatusIndicator.contextTypes = {
                                   store: PropTypes.object
                               }

export default connect()(StatusIndicator)
