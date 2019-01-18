import React         from 'react'
import { Component } from 'react'
import { PropTypes } from 'prop-types'

import './txt-line.css'

class TxtLine extends Component {

    constructor(props) {
        super(props)
        this.state = {}
    }    

    componentDidMount = () => {

    }

    renderHtmlTextLine = () => {

        const { gnmaTextLine, layouts, lineNumber, selectedLayoutInfo, selectedLineNumber, onTxtPropertyClick, onTxtPropertyMouseOver } = this.props

        let htmlLine

        if (layouts && layouts.length > 0) {
            const propertyValueSpans = layouts.map((layout, index) => {

            const propertyValue = gnmaTextLine.substring(layout.Start-1, layout.End)

            const isMatched    = selectedLayoutInfo && (selectedLayoutInfo.FieldName === layout.FieldName && selectedLayoutInfo.Index === layout.Index)
            const css = isMatched ? 'txt-match' : 'txt-value'

            return <span key         = {index+1} 
                            className   = {css} 
                            title       = {layout.FieldName}
                            onClick     = {() => onTxtPropertyClick(layout, propertyValue, gnmaTextLine)} 
                            onMouseOver = {() => onTxtPropertyMouseOver(layout, propertyValue, gnmaTextLine)}
                    >
                        {propertyValue}
                    </span>
            })

            const lineNumberCss = selectedLineNumber === lineNumber ? 'selected-line-number' : 'line-number'

            const formattedLineNumber = lineNumber ? lineNumber.toString().padStart(4, '0') : ''
            propertyValueSpans.unshift(<span key="0" className={lineNumberCss}>{formattedLineNumber}</span>)

            htmlLine = propertyValueSpans
        }
        else {
            htmlLine = <div>Select a line to parse from the loaded GNMA Text File</div>
        }
        return htmlLine
    }

    getLineNumberRowCss = (selectedLineNumber, lineNumber, htmlLine) => {

        let lineNumberCss = 'line-number-row'

        if (selectedLineNumber === lineNumber) {
            lineNumberCss = 'selected-line-number-row'
        } else {
            if (htmlLine && (htmlLine.length >= 2)) {
                const recordType = htmlLine[1].props.children
                switch (recordType) {
                    case 'P06':
                    case 'M11':
                        lineNumberCss = 'bordered-line-number-row'
                        break
                    default:
                        break
                }
            }
        }

        return lineNumberCss
    }

    onTxtLineClick = () => {

        const { gnmaTextLine, layouts, lineNumber, onTxtLineClick } = this.props

        onTxtLineClick(gnmaTextLine, layouts, lineNumber)
    }

    render () {

        const htmlLine = this.renderHtmlTextLine()

        const { lineNumber, selectedLineNumber } = this.props

        const lineNumberCss = this.getLineNumberRowCss(selectedLineNumber, lineNumber, htmlLine)

        return (
            <div className={lineNumberCss} onClick={this.onTxtLineClick}>
                {htmlLine}
            </div>
        )
    
    }

}

TxtLine.propTypes = {
                        gnmaTextLine:           PropTypes.string.isRequired, 
                        layouts:                PropTypes.array.isRequired, 
                        lineNumber:             PropTypes.number.isRequired, 
                        selectedLayoutInfo:     PropTypes.object.isRequired, 
                        onTxtPropertyClick:     PropTypes.func.isRequired, 
                        onTxtPropertyMouseOver: PropTypes.func.isRequired, 
                        onTxtLineClick:         PropTypes.func.isRequired, 
                    }

TxtLine.contextTypes = {
                          store: PropTypes.object
                       }

export default TxtLine