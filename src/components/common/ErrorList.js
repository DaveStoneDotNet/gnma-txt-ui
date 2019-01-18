import React                 from 'react'
import { PropTypes }         from 'prop-types'

import {  SolidTimesCircle } from './Icons'

import './css/error-list.css'

const ErrorList = (props) =>  {

    const errors = props.errors

    const items = errors.map((e, index) => { 
        return <tr key={index}>
                   <td className="error-index-cell">
                        <div className="error-index">{ e.index+1 }</div>
                   </td>
                   <td>
                       <div>
                            <div className="error-title">{ e.title}</div>
                            <div className="error-message">{ e.error.message}</div>
                       </div>
                   </td>
                   <td>
                        <div className="delete-error-icon">
                            <SolidTimesCircle />
                        </div>
                   </td>
               </tr>
     })

    return <div className="error-list-container">
               <table className="error-list-table">
                   <tbody>
                        {items}
                   </tbody>
               </table>
           </div>

}

ErrorList.propTypes = {
                            errors: PropTypes.array.isRequired
                      }

export default ErrorList
