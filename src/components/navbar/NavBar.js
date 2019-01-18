import React                    from 'react'
import { Component }            from 'react'
import { PropTypes }            from 'prop-types'

import { Navbar }               from 'reactstrap'
import { NavbarBrand }          from 'reactstrap'
import { Nav }                  from 'reactstrap'
import { NavItem }              from 'reactstrap'
import { NavLink }              from 'reactstrap'
import { UncontrolledDropdown } from 'reactstrap'
import { DropdownToggle }       from 'reactstrap'
import { DropdownMenu }         from 'reactstrap'
import { DropdownItem }         from 'reactstrap'

import { Link }                 from 'react-router-dom'

import { FontAwesomeIcon }      from '@fortawesome/react-fontawesome'
import sUserCircle              from '@fortawesome/fontawesome-free-solid/faUserCircle'

import $                        from 'jquery'

import './navbar.css'

class NavBar extends Component {

    constructor(props) {

        super(props)

        this.state = { 
                         isOpen: true
                     }
    }    

    componentDidMount() {

        // Example of accessing by 'ref' to potentially attach potential third-party library...

        $(this.user).on('click', this.onUserClick)
    }

    componentWillUnmount() {
        $(this.user).off('click')
    }

    toggle = () => {
        this.setState({ isOpen: !this.state.isOpen })
    }

    onUserClick = () => {
        console.log('CLICK')
    }

    getUserNameDropDown(authenticatedUser) {
        if (authenticatedUser.isAuthenticated) {
            return <DropdownToggle nav><FontAwesomeIcon icon={sUserCircle} /> { authenticatedUser.displayName }</DropdownToggle>
        } else {
            return <DropdownToggle nav><FontAwesomeIcon icon={sUserCircle} /> Login</DropdownToggle>
        }
    }

    render() {

        const { onThemeChanged, onLogOut, authenticatedUser, isDark, apiStatus } = this.props

        const themeName = isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'

        const progressBarCss = apiStatus.count > 0 ? 'progress' : 'hidden'

        return (
                <div id="navbar">
                    <Navbar fixed="top" expand="xs">
                        <NavbarBrand tag={Link} to="/"><div className="inner-brand">cma</div></NavbarBrand>
                        <Nav navbar className="mr-auto">
                            <NavItem><NavLink tag={Link} to="/gnma">GNMA</NavLink></NavItem>
                        </Nav>
                        <Nav navbar className="ml-auto">
                            <UncontrolledDropdown>
                                { this.getUserNameDropDown(authenticatedUser) }
                                <DropdownMenu>
                                    <DropdownItem onClick={ onThemeChanged }>{ themeName }</DropdownItem>
                                    <DropdownItem divider />
                                    {
                                        authenticatedUser.isAuthenticated ? <DropdownItem onClick={ onLogOut }>Logout</DropdownItem> : <div />
                                    }
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </Nav>
                        <div className={progressBarCss}>
                            <div className="progress-bar progress-bar-striped progress-bar-animated bg-warning" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style={{ width: '2rem' }}></div>
                        </div>               
                    </Navbar>

                </div>
               )
    }
}

NavBar.propTypes = {
                        onThemeChanged:    PropTypes.func.isRequired, 
                        onLogOut:          PropTypes.func.isRequired, 
                        isDark:            PropTypes.bool.isRequired, 
                        authenticatedUser: PropTypes.object.isRequired, 
                        apiStatus:         PropTypes.object.isRequired
                   }

export default NavBar
