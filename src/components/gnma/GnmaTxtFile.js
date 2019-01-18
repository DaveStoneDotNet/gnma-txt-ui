import React         from 'react'
import { Component } from 'react'
import { PropTypes } from 'prop-types'

import TxtLine       from './TxtLine'

import './gnma-txt-file.css'

// This is the left-hand side of a 'GnmaTxtFilePage' that displays the contents of a GNMA TXT file.
// Each line of the GNMA TXT file can be clicked to get additional LAYOUT information as a 'ParsedTxtLine'.
// Each PROPERTY of each line of the GNMA TXT file can be hovered to display the FIELD NAME of the property as a tooltip.

class GnmaTxtFile extends Component {

    constructor(props) {
        super(props)
        this.state = {}
    }    

    componentDidMount = () => {

    }

    getLayouts = (poolRecordLayouts, type) => {

        let layouts = []

        switch (type) {
            case 'P01':
                layouts = poolRecordLayouts.P01
                break;
            case 'P02':
                layouts = poolRecordLayouts.P02
                break;
            case 'P03':
                layouts = poolRecordLayouts.P03
                break;
            case 'P04':
                layouts = poolRecordLayouts.P04
                break;
            case 'P05':
                layouts = poolRecordLayouts.P05
                break;
            case 'P06':
                layouts = poolRecordLayouts.P06
                break;

            case 'S01':
                layouts = poolRecordLayouts.S01
                break;
            case 'S02':
                layouts = poolRecordLayouts.S02
                break;

            case 'M01':
                layouts = poolRecordLayouts.M01
                break;
            case 'M02':
                layouts = poolRecordLayouts.M02
                break;
            case 'M03':
                layouts = poolRecordLayouts.M03
                break;
            case 'M04':
                layouts = poolRecordLayouts.M04
                break;
            case 'M05':
                layouts = poolRecordLayouts.M05
                break;
            case 'M06':
                layouts = poolRecordLayouts.M06
                break;
            case 'M07':
                layouts = poolRecordLayouts.M07
                break;
            case 'M08':
                layouts = poolRecordLayouts.M08
                break;
            case 'M10':
                layouts = poolRecordLayouts.M10
                break;
            case 'M11':
                layouts = poolRecordLayouts.M11
                break;

            case 'A01':
                layouts = poolRecordLayouts.A01
                break;

            case 'N01':
                layouts = poolRecordLayouts.N01
                break;
            case 'N02':
                layouts = poolRecordLayouts.N02
                break;

            case 'F01':
                layouts = poolRecordLayouts.F01
                break;
            case 'F02':
                layouts = poolRecordLayouts.F02
                break;

            case 'B01':
                layouts = poolRecordLayouts.B01
                break;
            case 'B02':
                layouts = poolRecordLayouts.B02
                break;

            default:
                break;
        }

        return layouts
    }

    renderTxtLines = () => {

        const { filteredGnmaTextFile, poolRecordLayouts, selectedLayoutInfo, selectedLineNumber, onTxtPropertyClick, onTxtPropertyMouseOver, onTxtLineClick } = this.props

        // Replace all the SPACE characters with a UNICODE version since browsers render MULTIPLE spaces as a SINGLE space.
        // This should be done when obtained from the server instead of doing it here on every render.
        // This will result in rendering HTML non-breaking spaces for ever SPACE character.

        // Rendered lines are FILTERED in a FOR LOOP in 'GnmaTxtFilePage.js' 
        //      - For each FOUND LINE the Original Line is returned
        //      - For every NOT-FOUND LINE an 'X' is returned for the line to filter out.
        //   This ensures array sizes stay the same for line numbering and then lines that are 'X' can be ignored for RENDERING.
        //   Ingore LINES that are 'X' here by returning NULL instead of a 'TxtLine'

        const spacedTextFile = filteredGnmaTextFile.map(line => line.replace(/ /g,'\u00a0'))

        const htmlLines = spacedTextFile.map((line, index) => { 

            const type = line.substring(0, 3)

            const layouts = this.getLayouts(poolRecordLayouts, type)
            
            return line !== 'X' ? <TxtLine key                    = {index} 
                                           gnmaTextLine           = {line} 
                                           layouts                = {layouts} 
                                           lineNumber             = {index+1} 
                                           selectedLineNumber     = {selectedLineNumber}
                                           selectedLayoutInfo     = {selectedLayoutInfo}
                                           onTxtPropertyClick     = {onTxtPropertyClick} 
                                           onTxtPropertyMouseOver = {onTxtPropertyMouseOver}
                                           onTxtLineClick         = {onTxtLineClick}
                                  /> 
                                : null
        })

        return htmlLines
    }

    render () {

        const txtLines = this.renderTxtLines()

        const { fileShareLocation } = this.props

        return (
            <div className="txt-file">

                { txtLines }

                <div className="shared-folder-location">
                    {fileShareLocation.Path}
                </div>

            </div>
        )
    
    }

}

GnmaTxtFile.propTypes = {
                            filteredGnmaTextFile:   PropTypes.array.isRequired, 
                            selectedLineNumber:     PropTypes.number.isRequired, 
                            poolRecordLayouts:      PropTypes.object.isRequired, 
                            selectedLayoutInfo:     PropTypes.object.isRequired, 
                            selectedGnmaTextFile:   PropTypes.object.isRequired, 
                            fileShareLocation:      PropTypes.object.isRequired, 
                            onTxtPropertyClick:     PropTypes.func.isRequired, 
                            onTxtPropertyMouseOver: PropTypes.func.isRequired, 
                            onTxtLineClick:         PropTypes.func.isRequired
                        }


GnmaTxtFile.contextTypes = {
                             store: PropTypes.object
                           }

export default GnmaTxtFile