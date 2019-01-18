import React                    from 'react'
import { Component }            from 'react'
import { PropTypes }            from 'prop-types'
import { connect }              from 'react-redux'

import Home                     from '../../components/home/Home'

import * as notificationActions from '../../state/actions/notificationActions'
import * as appActions          from '../../state/actions/appActions'

class HomePage extends Component {

    constructor(props) {
        super(props)
        this.state = { 
                        application:  '-', 
                     }
    }    

    componentDidMount() {

    }


    handleClick = () => {

        // success, error, warning, or default.

        this.props.dispatch( notificationActions.message('Loans Loaded Successfully', 'success') )
        this.props.dispatch( appActions.updateStatus({ status: 'default', message: 'Loans Loaded' }) )
    }

    render() {

        return (
                   <div id="home">
   
                       <Home />
   
                   </div>
               )
    }
}

HomePage.contextTypes = {
                            store: PropTypes.object
                        }

export default connect()(HomePage)
