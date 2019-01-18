import React         from 'react'
import { Component } from 'react'
import { PropTypes } from 'prop-types'

import './layout-info.css'

// This is the right-hand side of a 'ParsedTxtLine' containing additional information regarding the 'meta-data' used to parse a GNMA LINE.

class LayoutInfo extends Component {

    constructor(props) {
        super(props)
        this.state = {}
    }    

    componentDidMount = () => {

    }

    getPositionDescription = () => {

        const { selectedLayoutInfo } = this.props

        let positionDescription = ''

        if (selectedLayoutInfo) {
            if (selectedLayoutInfo.Start) {
                const characters = `${selectedLayoutInfo.Length} ${selectedLayoutInfo.Length === 1 ? 'character ' : 'characters'}`
                positionDescription = `${characters} [${selectedLayoutInfo.Start} to ${selectedLayoutInfo.End}]`
            }
        }

        return positionDescription
    }

    render () {

        const { selectedLayoutInfo, selectedPropertyValue } = this.props

        const positionDescription = this.getPositionDescription()

        return (
            selectedLayoutInfo.RecordType ? 
            <div className="layout-info">
                <div className="flexed-layout-header">
                    <div className="line-layout-header">
                        {selectedLayoutInfo.FieldName}
                    </div>
                    <div className="layout-header-value">
                        {selectedPropertyValue}
                    </div>
                </div>
                <table className="layout-info-table">
                    <tbody>
                        <tr className="layout-info-row">
                            <td className="layout-info-label">RecordType</td><td className="layout-info-value">{selectedLayoutInfo.RecordType}</td>
                        </tr>

                        <tr className="layout-info-row">
                            <td className="layout-info-label">FieldName</td><td className="layout-info-value">{selectedLayoutInfo.FieldName}</td>
                        </tr>

                        <tr className="layout-info-row">
                            <td className="layout-info-label">Length</td><td className="layout-info-value">{positionDescription}</td>
                        </tr>

                        <tr className="layout-info-row">
                            <td className="layout-info-label">Type</td><td className="layout-info-value">{selectedLayoutInfo.Type}</td>
                        </tr>
                        <tr className="layout-info-row">
                            <td className="layout-info-label">DecimalPlaces</td><td className="layout-info-value">{selectedLayoutInfo.DecimalPlaces}</td>
                        </tr>
                        <tr className="layout-info-row">
                            <td className="layout-info-label">Format</td><td className="layout-info-value">{selectedLayoutInfo.Format}</td>
                        </tr>

                        <tr className="layout-info-row">
                            <td className="layout-info-label">Align</td><td className="layout-info-value">{selectedLayoutInfo.Align}</td>
                        </tr>
                        <tr className="layout-info-row">
                            <td className="layout-info-label">Pad</td><td className="layout-info-value">{selectedLayoutInfo.Pad}</td>
                        </tr>
                        <tr className="layout-info-row">
                            <td className="layout-info-label">Value</td><td className="layout-info-value"><span className="selected-layout-info-value">{selectedPropertyValue}</span></td>
                        </tr>
                        <tr className="layout-info-row">
                            <td className="layout-info-label">IsRequired</td><td className="layout-info-value">{selectedLayoutInfo.IsRequired ? 'YES' : 'NO'}</td>
                        </tr>
                        <tr className="layout-info-row">
                            <td className="layout-info-label">Description</td><td className="layout-info-description">{selectedLayoutInfo.Description}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            : null
        )
    
    }

}

LayoutInfo.propTypes = {
                            selectedLayoutInfo:    PropTypes.object.isRequired, 
                            selectedPropertyValue: PropTypes.string.isRequired
                       }

LayoutInfo.contextTypes = {
                                store: PropTypes.object
                             }

export default LayoutInfo

