import React              from 'react'
import { Component }      from 'react'

import { Route }          from 'react-router-dom'
import { Switch }         from 'react-router-dom'

import HomePage           from '../home/HomePage'
import GnmaTxtFilePage    from '../gnma/GnmaTxtFilePage'

import './shell.css'

class Shell extends Component {

    render() {

        return (
                <div id="shell" className="shell-container">

                    <Switch>
                        <Route exact path="/"     component={ HomePage        } />
                        <Route exact path="/gnma" component={ GnmaTxtFilePage } />
                    </Switch>

                </div>
               )
    }
}

export default Shell
