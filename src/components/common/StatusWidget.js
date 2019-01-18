import React               from 'react'
import { PropTypes }       from 'prop-types'

import StatusIcon          from './StatusIcon'

import { STATUS_CONSTANTS } from '../footer/StatusIndicatorConstants'

import './css/status-widget.css'

// Accepts a 'statusBit' where:
// 
//   - NULL  = WORKING
//   - TRUE  = OK / SUCCESS
//   - FALSE = ERROR
//

const StatusWidget = (props) => {

  const { title, message, statusBit, type } = props

  let text      = ''
  let statusCss = ''

  const status = statusBit === null ? STATUS_CONSTANTS.working : statusBit ? STATUS_CONSTANTS.success : STATUS_CONSTANTS.error

  switch (status)
  {
      case STATUS_CONSTANTS.success:
           text = 'ok'
           statusCss = 'status-widget-column-ok'
           break;
      case STATUS_CONSTANTS.error:
           text = message || STATUS_CONSTANTS.error
           statusCss = 'status-widget-column-error'
           break;
      case STATUS_CONSTANTS.working:
           text = STATUS_CONSTANTS.working
           statusCss = 'status-widget-column-working'
           break;
      default:
           break;
  }

  return <div className="status-widget-column">
             <div className={statusCss}>
                 <div className="status-widget-icon-header">{title}</div>
                 <div className="status-widget-icon"><StatusIcon isTrue={statusBit} type={type} /></div>
                 <div className="status-widget-icon-footer">{text}</div>
             </div>
         </div>
}

StatusWidget.propTypes = {
                            title:     PropTypes.string.isRequired, 
                            statusBit: PropTypes.bool, 
                            message:   PropTypes.string, 
                            type:      PropTypes.string
                         }

export default StatusWidget