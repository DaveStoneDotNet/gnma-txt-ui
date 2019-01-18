import React              from 'react'
import { PropTypes }      from 'prop-types'

import { SolidSync        } from './Icons'
import { RegularCircle    } from './Icons'
import { SolidCheckSquare } from './Icons'
import { SolidCheckCircle } from './Icons'
import { SolidTimesCircle } from './Icons'
import { SolidBolt        } from './Icons'


import './css/icons.css'

const StatusIcon = (props) =>  {

    const { isTrue, type } = props

    let icon = <RegularCircle />

    switch(type){
        case 'Connection':
            if (isTrue === null){
                icon = <SolidSync />
            } else {
                icon = <SolidBolt />
            }
            break

        case 'SolidCheckSquare':
            if (isTrue === null){
                icon = <SolidSync />
            } else {
                if (isTrue) {
                    icon = <SolidCheckSquare />
                } 
            }
            break

        default:
            if (isTrue === null){
                icon = <SolidSync />
            } else {
                if (isTrue) {
                    icon = <SolidCheckCircle />
                } else {
                    icon = <SolidTimesCircle />
                }
            }
            break
    }

    return <div>
               { icon }
           </div>
}

StatusIcon.propTypes = {
                            isTrue: PropTypes.bool, 
                            type:   PropTypes.string
                       }

export default StatusIcon
