import React               from 'react'
import { Component }       from 'react'
import ReactDOM            from 'react-dom'
import PropTypes           from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import sTimes              from '@fortawesome/fontawesome-free-solid/faTimes'

import { CONSTANTS }       from './NotificationConstants'
import NotificationTimer   from './NotificationTimer'

// From Modernizr
var getTransitionEvent = function () {

    // The 'transitionend' event is fired when a CSS transition has completed. 
    // In the case where a transition is removed before completion, such as 
    // if the transition-property is removed or display is set to "none", 
    // then the event will not be generated.

    const transitionElement = document.createElement('transition-element')
    let transition          = undefined
    const transitions       = {
                                  transition       : 'transitionend',
                                  OTransition      : 'oTransitionEnd',
                                  MozTransition    : 'transitionend',
                                  WebkitTransition : 'webkitTransitionEnd'
                              }

    Object.keys(transitions).forEach((transitionKey) => {
        if (transitionElement.style[transitionKey] !== undefined) {
            transition = transitions[transitionKey]
        }
    })

    return transition
}

class NotificationItem extends Component {

    constructor(props) {

        super(props)

        this.state = {
                         isVisible: undefined,
                         isRemoved: false
                     }
    
        this.notificationTimer    = null
        this.isComponentMounted   = false
        this.height               = 0
        this.removeCount          = 0
        this.notification         = props.notification
        this.timeoutMilliseconds  = props.notification.secondsToDismiss * 1000
    }

    static propTypes = {
                         notification: PropTypes.shape({
                                                         level:         PropTypes.string,
                                                         title:         PropTypes.string,
                                                         isDismissible: PropTypes.bool,
                                                         onAdd:         PropTypes.func,
                                                         onRemove:      PropTypes.func,
                                                         uid:           PropTypes.oneOfType([
                                                                                              PropTypes.string,
                                                                                              PropTypes.number
                                                                                            ]),
                                                         message:       PropTypes.oneOfType([
                                                                                              PropTypes.string,
                                                                                              PropTypes.object,
                                                                                            ])
                                                       }).isRequired,
                         onRemove    : PropTypes.func
                       }

    static defaultProps = {
                              onRemove : () => { }
                          }

    componentDidMount() {

        this.isComponentMounted = true

        this.addTransitionEvent()
        this.showNotification()
    }

    shouldComponentUpdate(nextProps) {
        return true
    }

    componentWillUnmount() {

        this.removeTransitionEvent()
        this.isComponentMounted = false
    }

    showNotification = () => {

        this.startTimer()
        this.setState({ isVisible: true })
    }

    hideNotification = () => {

        this.notification.isRemoved = true

        if (this.notificationTimer) {
            this.notificationTimer.clear()
        }

        this.removeTransitionEvent()

        if (this.isComponentMounted) {
            this.setState({
                              isVisible: false,
                              isRemoved: true
                          })
        }

        this.removeNotification()
    }

    removeNotification = () => {

        this.props.onRemove(this.props.notification.uid)
    }

    startTimer = () => {
        if (this.notification.secondsToDismiss) {
            if (!this.notification.isRemoved && this.notificationTimer == null) {
                this.notificationTimer = new NotificationTimer(this.hideNotification, this.timeoutMilliseconds)
            } else {
                if (this.notificationTimer) {
                    this.notificationTimer.resume()
                }
            }
        }
    }

    addTransitionEvent = () => {
        if (this.isComponentMounted) {
            if (!this.notification.isRemoved) {
                const transitionEvent = getTransitionEvent()
                if (transitionEvent) {
                    const element = ReactDOM.findDOMNode(this)
                    element.addEventListener(transitionEvent, this.onTransitionEnd)
                }
            }
        }
    }

    removeTransitionEvent = () => {
        if (this.isComponentMounted) {
            const transitionEvent = getTransitionEvent()
            if (transitionEvent) {
                const element = ReactDOM.findDOMNode(this)
                element.removeEventListener(transitionEvent, this.onTransitionEnd)
            }
        }
    }
    
    onTransitionEnd = () => {
        if (this.removeCount > 0) {
            return
        }

        if (this.state.isRemoved) {
            this.removeCount++
            this.removeNotification()
        }
    }

    onMouseEnter = () => {
        if (this.notificationTimer) {
            this.props.notification.secondsToDismiss && this.notificationTimer.pause()
        }
    }

    onMouseLeave = () => {
        if (this.notificationTimer) {
            this.props.notification.secondsToDismiss && this.notificationTimer.resume()
        } else {
            this.notificationTimer = new NotificationTimer(this.hideNotification, this.timeoutMilliseconds)
        }
    }

    getHeaderText(notification) {

        let header = ''

        if (notification.header) {
            return notification.header
        }

        switch(notification.level){
            case CONSTANTS.levels.success:
                header = 'SUCCESS'
                break
            case CONSTANTS.levels.error:
                header = 'ERROR'
                break
            case CONSTANTS.levels.warning:
                header = 'WARNING'
                break
            case CONSTANTS.levels.info:
                header = 'INFO'
                break
            default:
                header = ''
                break
        }
        return header
    }

    getHeaderElement = (notification) => {

        const headerText = this.getHeaderText(notification)

        if (headerText) {
            return <div className="header">{headerText}</div>
        }
    }

    getNotificationItemElement = (notification) => {

        if (notification.getContentComponent) {
            return notification.getContentComponent()
        }

        const visibleCss = this.state.isRemoved ? 'hidden' : 'visible'
        const itemCss = `container ${notification.level} ${visibleCss}`

        const headerElement = this.getHeaderElement(notification)

        return <div className    = { itemCss }
                    onClick      = { this.hideNotification }
                    onMouseEnter = { this.onMouseEnter }
                    onMouseLeave = { this.onMouseLeave }
               >
                   <div className="p-bar"></div>
                   <FontAwesomeIcon icon={sTimes} className="dismiss"/>
                   { headerElement }
                   <div className="message">{ notification.message }</div>
               </div>
    }

    render() {

        const { notification } = this.props
        const notificationItemElement = this.getNotificationItemElement(notification)

        return notificationItemElement
    }
}

export default NotificationItem
