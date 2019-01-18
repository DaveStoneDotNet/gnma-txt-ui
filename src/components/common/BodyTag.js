import { Component } from 'react'
import { PropTypes } from 'prop-types'

class BodyTag extends Component {

    static propTypes = {
        isDark: PropTypes.bool
    }

    static defaultProps = {
        isDark: false
    }
    
    constructor(props) {
        super(props)
        this.state = { }
    }

    // ------------------------------------------------------------------------

    componentDidMount() {
        if (this.props.isDark) {
            document.body.className = 'dark'
        } else {
            document.body.className = 'light'
        }
    }

    // ------------------------------------------------------------------------
    // https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html
    // ------------------------------------------------------------------------

    componentDidUpdate() {
    }

    static getDerivedStateFromProps(props, state) {

        if (props.isDark) {
            document.body.className = 'dark'
        } else {
            document.body.className = 'light'
        }

        return null;

        // Replaces componentWillReceiveProps

        // Invoked after a component is instantiated as well as before it is re-rendered. 
        // It can return an object to update state, or null to indicate that new props do not require any state updates.
        
        // Together with componentDidUpdate, this new lifecycle should cover all use cases for the legacy componentWillReceiveProps.
    }

    getSnapshotBeforeUpdate(prevProps, prevState) {

        // Replaces componentWillUpdate

        // Called right before mutations are made (e.g. before the DOM is updated). 
        // The return value for this lifecycle will be passed as the third parameter to componentDidUpdate. 
        // This lifecycle isn’t often needed, but can be useful in cases like manually preserving scroll position during rerenders.

        // Together with componentDidUpdate, this new lifecycle should cover all use cases for the legacy componentWillUpdate.

        // A snapshot value (or null) must be returned.

        return null
    }

    // -----------------------------------------------------------------

    render() {
        return null
    }
}

BodyTag.propTypes = {
                        isDark: PropTypes.bool.isRequired
                    }

export default BodyTag
