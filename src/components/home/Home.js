import React from 'react'

import { RegularCopy } from '../common/Icons'

import { NavLink }              from 'reactstrap'
import { Link }                 from 'react-router-dom'

import './home.css'

const Home = () => (

  <div className="white-a-5">
    
    <div className="home-wrapper">
        <NavLink tag={Link} to="/gnma">
            <div className="gnma-header">
                GNMA
            </div>
            <div className="text-file-header">
                Text Files
            </div>
            <div className="home-header-icon">
                <RegularCopy />
            </div>
        </NavLink>
    </div>
    
  </div>

)

export default Home