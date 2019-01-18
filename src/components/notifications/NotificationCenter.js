import React            from 'react'
import { Component }    from 'react'

import NotificationItem from './NotificationItem'
import { CONSTANTS }    from './NotificationConstants'

class NotificationCenter extends Component {

    constructor(props) {

        super(props)

        this.state  = { notifications: [] }
        this.lastId = 1000
        this.uid    = `uid::${this.lastId}`

        this.isComponentMounted = false
    }

    // -----------------------------------------------------------------

    componentDidMount() {

        this.isComponentMounted = true
    }

    componentWillUnmount() {

        this.isComponentMounted = false
    }

    // -----------------------------------------------------------------

    getNextUid = (prefix='uid::') => {
        this.lastId++
        return `${prefix}${this.lastId}`
    }

    setUid = (notification) => {

        this.uid = this.getNextUid()

        notification.uid = notification.uid || this.uid
        notification.ref = `notification-${notification.uid}`
    }

    ensureDefaultValues = (notification) => {

        const getContentComponent = notification.getContentComponent

        if (!notification.level && !getContentComponent) {
            notification.level = CONSTANTS.levels.info
        }

        if ((Object.keys(CONSTANTS.levels).indexOf(notification.level) === -1) && !getContentComponent) {
            notification.level = CONSTANTS.levels.info
        }

        if (!getContentComponent) {
            notification.level = notification.level.toLowerCase()
        }

        if (isNaN(notification.secondsToDismiss)) {
            notification.secondsToDismiss = 10
        }
    }

    addNotification = (notification) => {

        const notifications = this.state.notifications

        notification.secondsToDismiss = 10

        this.setUid(notification)

        this.ensureDefaultValues(notification)

        notifications.push(notification)

        this.setState({notifications: notifications})

        this.onNotificationAddeded(notification)

        return notification
    }

    onNotificationAddeded = (notification) => {
        if (typeof notification.onAdd === 'function') {
            notification.onAdd(notification)
        }
    }

    onNotificationRemoved = (uid) => {

        console.log('NOTIFICATION CENTER - ON NOTIFICATION REMOVED', uid)

        // Find a notification to remove by the provided 'uid' and remove it from the list of Notifications in State.

        const { notifications }      = this.state
        const selectedNotification   = notifications.find((notification)   => notification.uid === uid)
        const remainingNotifications = notifications.filter((notification) => notification.uid !== uid)
        
        remainingNotifications.map((notification) => notification.isRemoved = true)

        if (this.isComponentMounted) {
            this.setState({notifications: remainingNotifications})
        }

        if (selectedNotification && selectedNotification.onRemove) {
            selectedNotification.onRemove(selectedNotification)
        }
    }

    getNotificationItems = (notifications) => {

        return notifications.map((notification, i) => {
                                                         return <NotificationItem ref          = { `notification-${notification.uid}` }
                                                                                  key          = { `${notification.uid}-${i}` }
                                                                                  className    = { notification.className }
                                                                                  notification = { notification }
                                                                                  onRemove     = { this.onNotificationRemoved }
                                                                />
                                                      })
    }
    
    getNotificationContainer = () => {
        
        let container = null

        const notifications  = this.props.notifications

        if (notifications) {
            if (notifications.length) {
                const notificationItems = this.getNotificationItems(notifications)
                container = <div id="notification-container" className="notification-center">
                                { notificationItems }
                            </div>
            }
        }

        return container
    }

    success= (message, header) => {
        const options = {
                             level:   CONSTANTS.levels.success, 
                             message: message,
                             header:  header
                        }
        this.addNotification(options)
    }

    error = (message, header) => {
        const options = {
                             level:   CONSTANTS.levels.error, 
                             message: message,
                             header:  header
                        }
        this.addNotification(options)
    }

    warning= (message, header) => {
        const options = {
                             level:   CONSTANTS.levels.warning, 
                             message: message,
                             header:  header
                        }
        this.addNotification(options)
    }

    info = (message, header) => {
        const options = {
                             level:   CONSTANTS.levels.info, 
                             message: message,
                             header:  header
                        }
        this.addNotification(options)
    }

    default = (message, header) => {
        const options = {
                             level:   CONSTANTS.levels.default, 
                             message: message,
                             header:  header
                        }
        this.addNotification(options)
    }



    // -----------------------------------------------------------------

    getNotificationRef = (notification) => {
        
        var self = this
        var foundNotification = null

        Object.keys(this.refs).forEach(function (container) {
            if (container.indexOf('container') > -1) {
                Object.keys(self.refs[container].refs).forEach(function (_notification) {
                    var uid = notification.uid ? notification.uid : notification
                    if (_notification === 'notification-' + uid) {

                        // NOTE: Stop iterating further and return the found notification.
                        // Since UIDs are uniques and there won't be another notification found.
                        foundNotification = self.refs[container].refs[_notification]
                    }
                })
            }
        })

        return foundNotification
    }

    removeNotification = (notification) => {
        var foundNotification = this.getNotificationRef(notification)
        return foundNotification && foundNotification._hideNotification()
      }

    clearNotifications = () => {
        var self = this
        Object.keys(this.refs).forEach(function (container) {
            if (container.indexOf('container') > -1) {
                Object.keys(self.refs[container].refs).forEach(function (_notification) {
                    self.refs[container].refs[_notification]._hideNotification()
                })
            }
        })
    }

    // -----------------------------------------------------------------

    render() {

        let container = this.getNotificationContainer()

        return (
                    <div className = "notification-center">
                        { container }
                    </div>
               )
    }
}

export default NotificationCenter