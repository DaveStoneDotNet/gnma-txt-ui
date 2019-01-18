import React                    from 'react'
import PropTypes                from 'prop-types'
import { Component }            from 'react'
import { withRouter }           from 'react-router-dom'
import { connect }              from 'react-redux'
import { bindActionCreators }   from 'redux'

import NotificationCenter       from './NotificationCenter'

import * as notificationActions from '../../state/actions/notificationActions'
import * as notificationReducer from '../../state/reducers/notificationReducer'

class ReduxNotificationCenter extends Component {

    constructor(props) {

        super(props)

        this.isComponentMounted = false

        this.state = {  }
    }

    getNotificationCenterRef() {
        return this.refs.notification_center
    }

    manageNotifications(notifications) {

        if (notifications) {
            const notificationIds = notifications.map(notification => notification.uid)
            const systemNotifications = this.getNotificationCenterRef().state.notifications || []

            if (notifications.length > 0) {

                // Get all active notifications from react-notification-system and remove all where uid is not found in the reducer

                (systemNotifications).forEach(notification => {
                    if (notificationIds.indexOf(notification.uid) < 0) {
                        this.getNotificationCenterRef().removeNotification(notification.uid)
                    }
                })

                notifications.forEach(notification => {
                    this.getNotificationCenterRef().addNotification({
                        ...notification,
                        onRemove: () => {
                            this.props.dispatch(notificationActions.hide(notification.uid))
                            notification.onRemove && notification.onRemove()
                        }
                    })
                })
            }

            if ((this.props.notifications !== notifications) && notifications.length === 0) {
                this.getNotificationCenterRef().clearNotifications()
            }
        }
    }

    componentDidMount() {

        this.isComponentMounted = true

        // Moved from getDerivedStateFromProps

        const {notifications} = this.props

        if (notifications) {
            this.manageNotifications(notifications)
        }
    }

    componentWillUnmount() {

        this.isComponentMounted = false
    }

    shouldComponentUpdate(nextProps) {
        return this.props !== nextProps
    }

    // ------------------------------------------------------------------------
    // https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html
    // ------------------------------------------------------------------------

    componentDidUpdate(prevProps, prevState, snapshot) {

        const {notifications} = this.props

        if (notifications) {

            const previousCount = prevProps.notifications.length
            const currentCount  = this.props.notifications.length

            // Manage notifications if they changed...

            if (currentCount !== previousCount) {
                this.manageNotifications(notifications)
            }
        }
    }
      
    static getDerivedStateFromProps(props, state) {

        // Replaces componentWillReceiveProps

        // Invoked after a component is instantiated as well as before it is re-rendered. 
        // It can return an object to update state, or null to indicate that new props do not require any state updates.
        
        // Together with componentDidUpdate, this new lifecycle should cover all use cases for the legacy componentWillReceiveProps.

        return null
    }

    // ------------------------------------------------------------------------

    render() {

        return (
                    <NotificationCenter ref='notification_center' { ...this.props } />
               )
    }
}

const mapStateToProps = (state) => {
  
    return { 
               notifications: state.notifications, 
           }
}

const mapDispatchToProps = (dispatch) => { 
    return {
                notificationActions: bindActionCreators(notificationActions, dispatch)
           }
}

ReduxNotificationCenter.propTypes    = {
                                           notifications: PropTypes.array
                                       }
  
ReduxNotificationCenter.contextTypes = {
                                           store: PropTypes.object
                                       }

Object.keys(notificationActions).forEach(key => {
    ReduxNotificationCenter[key] = notificationActions[key]
})

ReduxNotificationCenter.reducer = notificationReducer

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ReduxNotificationCenter))
