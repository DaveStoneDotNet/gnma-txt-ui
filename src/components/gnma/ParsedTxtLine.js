import React         from 'react'
import { Component } from 'react'
import { PropTypes } from 'prop-types'

import { ENTER }     from '../common/Keys'
import { ESC }       from '../common/Keys'

import TxtLine       from './TxtLine'
import LayoutInfo    from './LayoutInfo'

import { RegularArrowAltCircleLeft } from '../common/Icons'
import { SolidChevronUp }            from '../common/Icons'
import { SolidChevronDown }          from '../common/Icons'

import './parsed-txt-line.css'

// This is the right-hand side of a 'GnmaTxtFilePage' that displays the LAYOUT information of a singular line clicked in a 'GnmaTxtFile'.
// Each ROW of the LAYOUT information can be clicked to get additional information regarding the 'meta-data' used to parse the LINE as a 'LayoutInfo'.

class ParsedTxtLine extends Component {

    constructor(props) {
        super(props)
        this.state = {
                        isCollapsed:   false, 
                        value:         '', 
                        originalValue: ''
                     }
    }    

    componentDidMount = () => {

    }

    handleInputKeyUp(e, selectedLayoutInfo, selectedLineNumber) {
        switch (e.keyCode) {
            case ESC:
                this.setState({value: this.state.originalValue})
                e.target.value = this.state.originalValue
                this.onPropertyValueBlurred(e, selectedLayoutInfo, selectedLineNumber)
                this.typeaheadReference.blur()
                break
            case ENTER:
                this.typeaheadReference.blur()
                break
            default:
                break
        }
    }

    onTxtPropertyMouseOver = (layout, propertyValue, gnmaTextLine) => {

    }
    
    onTxtPropertyClick = (layout, propertyValue, gnmaTextLine) => {

    }
    
    onTxtLineClick = (gnmaTextLine, layouts, lineNumber) => {

    }

    onLayoutInfoClick = (layout, propertyValue, gnmaTextLine) => {

        const {onLayoutInfoClick} = this.props

        onLayoutInfoClick(layout, propertyValue, gnmaTextLine)

        this.setState({value: propertyValue.trim()})
    }
    
    onToggleIsCollapsedClick = () => {
        this.setState({ isCollapsed: !this.state.isCollapsed })
    }
    
    onPropertyValueChanged = (e, selectedLayoutInfo, selectedLineNumber) => {
        this.setState({ value: e.target.value })
        const {onPropertyValueChanged} = this.props
        onPropertyValueChanged(selectedLayoutInfo, selectedLineNumber, e.target.value)
    }

    onPropertyValueFocused = (e, selectedLayoutInfo, selectedLineNumber) => {
        this.setState({originalValue: e.target.value})
    }

    onPropertyValueBlurred = (e, selectedLayoutInfo, selectedLineNumber) => {
        const {onPropertyValueBlurred} = this.props
        onPropertyValueBlurred(selectedLayoutInfo, selectedLineNumber, e.target.value)
    }

    renderPropertyValueInput = (selectedLayoutInfo, layout, propertyValue, selectedLineNumber, selectedRecordLevel) => {

        // 'selectedRecordLevel' is the 'M01, M02, M03, etc.) selected from the drop-down to filter the lines by a Record Level
        // It will be EMPTY (length = 0) if no selection has been made.

        // 'layout' is the singular instance definition for this singular rendered input. e.g. Borrower First Name - Length = 25, etc.
        // The 'selectedRecordLevel' is the 'layout' clicked on by the user. That is, if the 'selectedRecordLevel' clicked on by the user matched the 'current' layout being rendered here, then different rendering occurs. e.g. an editable 'input' element rather than a non-editable 'label' element'

        const isReadOnly = this.getIsReadOnly(layout)
        const isSelected = this.getIsSelected(selectedLayoutInfo, layout)

        return isSelected && !isReadOnly ? <div>
                                               <input className = "parsed-input" 
                                                      type      = "text" 
                                                      value     = {this.state.value} 
                                                      onFocus   = {(e) => this.onPropertyValueFocused(e, selectedLayoutInfo, selectedLineNumber)} 
                                                      onBlur    = {(e) => this.onPropertyValueBlurred(e, selectedLayoutInfo, selectedLineNumber)} 
                                                      onChange  = {(e) => this.onPropertyValueChanged(e, selectedLayoutInfo, selectedLineNumber)} 
                                                      onKeyUp   = {(e) => this.handleInputKeyUp(e, selectedLayoutInfo, selectedLineNumber)} 
                                                      ref       = {(typeahead) => this.typeaheadReference = typeahead } 
                                                      maxLength = {layout.Length} 
                                                      readOnly  = {isReadOnly} />
                                           </div> 
                                         : <div className="property-value">{propertyValue}</div>
    }

    getIsReadOnly = (layout) => {
        return layout.FieldName === 'Record Type' || layout.FieldName === 'Filler'
    }

    getIsSelected = (selectedLayoutInfo, layout) => {
        return (selectedLayoutInfo.FieldName === layout.FieldName) && (layout.Index === selectedLayoutInfo.Index)
    }

    getPropertyValueLength = (selectedLayoutInfo, layout) => {
        const isReadOnly = this.getIsReadOnly(layout)
        const isSelected = this.getIsSelected(selectedLayoutInfo, layout)
        if (!isReadOnly) {
            return isSelected ? this.state.value.length.toString() + ' of ' + layout.Length.toString() + (layout.Length === 1 ? ' character' : ' characters') : ''
        } else {
            return isSelected ? 'non-editable' : ''
        }
    }

    renderLayoutValues = () => {

        const { selectedLayout, selectedGnmaTextLine, selectedLineNumber, selectedLayoutInfo, selectedRecordLevel } = this.props

        const elements = selectedLayout.map((layout, index) => {

            const propertyValue = selectedGnmaTextLine.substring(layout.Start-1, layout.End)

            const fieldNameCss = (selectedLayoutInfo.FieldName === layout.FieldName) && (layout.Index === selectedLayoutInfo.Index) ? 'selected-gnma-field-name' : 'gnma-field-name'

            const propertyValueInput = this.renderPropertyValueInput(selectedLayoutInfo, layout, propertyValue, selectedLineNumber, selectedRecordLevel)

            const propertyValueLength = this.getPropertyValueLength(selectedLayoutInfo, layout)

            return <tr className="gnma-txt-line-row" key={index} onClick={() => this.onLayoutInfoClick(layout, propertyValue)}>
                        <td className={fieldNameCss}>{layout.FieldName}</td>
                        <td className="property-value-cell">{propertyValueInput}</td>
                        <td className="layout-meta">{propertyValueLength}</td>
                   </tr>
        })

        return elements
    }

    renderCollapseIcon = () => {
        const { isCollapsed } = this.state
        const { selectedGnmaTextFile } = this.props
        return selectedGnmaTextFile.Name ? isCollapsed ? <SolidChevronDown /> : <SolidChevronUp /> : null
    }

    renderLineNumberHeader = () => {

        const { selectedLineNumber, selectedGnmaTextFile } = this.props

        if (selectedGnmaTextFile.Name) {
            const fileName = <span className="file-name">{selectedGnmaTextFile.Name}</span>
            const lineNumber = selectedLineNumber > 0 ? <span> - Line {selectedLineNumber.toString().padStart(4, '0')}</span> : <span></span>
            return <div>{fileName}{lineNumber}</div>
        } else {
            return <div><span className="left-arrow"><RegularArrowAltCircleLeft /></span> Load a GNMA TXT File</div>
        }
    }

    render () {

        const { isCollapsed } = this.state

        const { selectedGnmaTextLine, selectedLayout, selectedLayoutInfo, selectedPropertyValue, selectedLineNumber, selectedGnmaTextFile } = this.props

        const layoutValues = this.renderLayoutValues()

        const collapseIcon = this.renderCollapseIcon()

        const isVisibleCss = isCollapsed ? 'hidden' : 'gnma-layout-wrapper'

        const isSelectedTextLineVisibleCss = selectedGnmaTextFile.Name ? 'selected-txt-line' : 'hidden'

        const lineNumberHeader = this.renderLineNumberHeader(selectedGnmaTextFile)

        const layoutTooltip = selectedLayoutInfo.Index ? '' : 'Select to edit and/or view description'

        return (
            <div className="parsed-txt-line">
                <div className="line-number-toggle" onClick={this.onToggleIsCollapsedClick}>
                    <div className="float-right-toggle">
                        { collapseIcon }
                    </div>
                    <div className="line-number-header">
                        { lineNumberHeader }
                    </div>
                </div>
                <div className={isSelectedTextLineVisibleCss}>
                    <TxtLine gnmaTextLine           = {selectedGnmaTextLine} 
                             layouts                = {selectedLayout} 
                             lineNumber             = {selectedLineNumber}
                             selectedLayoutInfo     = {selectedLayoutInfo}
                             onTxtPropertyClick     = {this.onTxtPropertyClick} 
                             onTxtPropertyMouseOver = {this.onTxtPropertyMouseOver}
                             onTxtLineClick         = {this.onTxtLineClick}
                    />
                </div>
                <div className={isVisibleCss}>
                    <table className="gnma-layout-values" title={layoutTooltip}>
                        <tbody>
                            { layoutValues }
                        </tbody>
                    </table>
                </div>
                <div className='selected-layout-info'>
                    <LayoutInfo selectedLayoutInfo    = {selectedLayoutInfo} 
                                selectedPropertyValue = {selectedPropertyValue}/>
                </div>
            </div>
        )
    
    }

}

ParsedTxtLine.propTypes = {
                                selectedGnmaTextLine:   PropTypes.string.isRequired, 
                                selectedPropertyValue:  PropTypes.string.isRequired, 
                                selectedRecordLevel:    PropTypes.string.isRequired, 
                                selectedLineNumber:     PropTypes.number.isRequired, 
                                selectedLayout:         PropTypes.array.isRequired, 
                                selectedLayoutInfo:     PropTypes.object.isRequired, 
                                selectedGnmaTextFile:   PropTypes.object.isRequired, 
                                onLayoutInfoClick:      PropTypes.func.isRequired, 
                                onPropertyValueChanged: PropTypes.func.isRequired, 
                                onPropertyValueBlurred: PropTypes.func.isRequired
                          }

ParsedTxtLine.contextTypes = {
                                store: PropTypes.object
                             }

export default ParsedTxtLine