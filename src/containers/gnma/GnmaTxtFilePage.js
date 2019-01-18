import React           from 'react'
import { Component }   from 'react'
import { connect }     from 'react-redux'
import { PropTypes }   from 'prop-types'
import ScrollToTop     from 'react-scroll-up'
import ReactModal      from 'react-modal'

import _               from 'lodash'

import GnmaToolbar     from '../../components/gnma/GnmaToolbar'
import GnmaTxtFile     from '../../components/gnma/GnmaTxtFile'
import ParsedTxtLine   from '../../components/gnma/ParsedTxtLine'
import LoadGnmaTxtFile from '../../components/gnma/LoadGnmaTxtFile'

import * as appActions from '../../state/actions/appActions'

import { RegularArrowAltCircleUp } from '../../components/common/Icons'

class GnmaTxtFilePage extends Component {

    constructor(props) {
        super(props)
        this.state = { 
                        filteredFileName:      '', 
                        filteredTextCriteria:  '', 
                        selectedGnmaTextLine:  '', 
                        selectedPropertyValue: '', 
                        selectedLayouts:       [],  // Expected to be a sub-set Layout Information based on Record Type - e.g. P01, P02, etc. - displayed in a 'ParsedTxtLine'
                        selectedLayoutInfo:    {},  // Expected to be a singular object of one of the 'selectedLayout's - pushed down to and displayed in a 'LayoutInfo'
                        selectedGnmaTextFile:  {},  // The selected file INFO (Path, Name, File Size) - NOT the actual file contents
                        selectedLineNumber:    0, 
                        selectedRecordLevel:   '', 
                        isLoadFileModalOpen:   false, 
                        hideLoans:             false
                    }
    }

    componentDidMount() {
        ReactModal.setAppElement('#gnma-txt-file')
        this.props.dispatch(appActions.getFileInfos())
    }

    onTextFileSelected = (textFile) => {
        this.setState({ 
                        filteredFileName:      '', 
                        filteredTextCriteria:  '', 
                        selectedGnmaTextLine:  '', 
                        selectedPropertyValue: '', 
                        selectedLayouts:       [],
                        selectedLayoutInfo:    {},
                        selectedGnmaTextFile:  textFile, 
                        selectedLineNumber:    0, 
                        selectedRecordLevel:   '', 
                        isLoadFileModalOpen:   false, 
                        hideLoans:             false
                     })
        this.props.dispatch(appActions.getGnmaTextFile({ FullPathAndFileName: textFile.FullName }))
    }
    
    onRefreshFileList = () => {
        this.props.dispatch(appActions.getFileInfos())
    }

    onTxtPropertyMouseOver = (layout, propertyValue, gnmaTextLine) => {

    }
    
    onTxtPropertyClick = (layout, propertyValue, gnmaTextLine) => {

    }
    
    onTxtLineClick = (gnmaTextLine, layouts, lineNumber) => {
        this.setState({
                         selectedLayouts:       layouts, 
                         selectedGnmaTextLine:  gnmaTextLine, 
                         selectedPropertyValue: '',
                         selectedLayoutInfo:    {}, 
                         selectedLineNumber:    lineNumber
                      })
    }

    onLayoutInfoClick = (layout, propertyValue, gnmaTextLine) => {
        this.setState({
                          selectedLayoutInfo:    layout, 
                          selectedPropertyValue: propertyValue 
                     })
    }
    
    onLoadFileClick = () => {
        this.setState({isLoadFileModalOpen: true})
    }

    onSaveFileClick = () => {
        const { selectedGnmaTextFile } = this.state
        const { gnmaTextFile } = this.props.app
        this.props.dispatch(appActions.saveGnmaTextFile({ FullPathAndFileName: selectedGnmaTextFile.FullName, Lines: gnmaTextFile }))
    }

    onRequestLoadFileClose = () => {
        this.setState({isLoadFileModalOpen: false, filteredFileName: ''})
    }

    onClearFileClick = () => {
        this.setState({
            filteredTextCriteria:  '', 
            selectedGnmaTextLine:  '', 
            selectedPropertyValue: '',
            selectedLayouts:       [], 
            selectedLayoutInfo:    {}, 
            selectedLineNumber:    0, 
            selectedRecordLevel:   '', 
           })
    }

    onClearSelectionsClick = () => {
        this.setState({
                        filteredFileName:      '', 
                        filteredTextCriteria:  '', 
                        selectedGnmaTextLine:  '', 
                        selectedPropertyValue: '', 
                        selectedLayouts:       [],
                        selectedLayoutInfo:    {},
                        selectedLineNumber:    0, 
                        selectedRecordLevel:   '', 
                        isLoadFileModalOpen:   false, 
                        hideLoans:             false
                     })
    }

    onRecordLevelSelected = (event) => {
        this.setState({ 
                        filteredFileName:      '', 
                        selectedGnmaTextLine:  '', 
                        selectedPropertyValue: '', 
                        selectedLayouts:       [],
                        selectedLayoutInfo:    {},
                        selectedLineNumber:    0, 
                        selectedRecordLevel:   event.target.value, 
                        isLoadFileModalOpen:   false, 
                        hideLoans:             false
                     })
    }
    
    onHideLoansToggleClick = (event) => {

        const hideLoans = event.target.checked

        this.setState({ 
                        hideLoans:           hideLoans, 
                        selectedRecordLevel: '', 
                     })
    }
    
    onPropertyValueChanged = (selectedLayoutInfo, selectedLineNumber, propertyValue) => {

        const { gnmaTextFile } = this.props.app
        const selectedLine = gnmaTextFile[selectedLineNumber-1]

        let paddedPropertyValue = selectedLayoutInfo.Pad.repeat(selectedLayoutInfo.Length)
        let newPropertyValue = ''

        switch(selectedLayoutInfo.Align) {
            case 'Left':
                newPropertyValue = (propertyValue + paddedPropertyValue).substring(0, paddedPropertyValue.length)
                break
            case 'Right':
                newPropertyValue = (paddedPropertyValue + propertyValue).slice(-paddedPropertyValue.length)
                break
            default:
                break
        }

        const finalLine = selectedLine.substr(0, selectedLayoutInfo.Start-1) + newPropertyValue + selectedLine.substr(selectedLayoutInfo.Start + selectedLayoutInfo.Length - 1)

        const spacedTextLine = finalLine.replace(/ /g,'\u00a0')

        gnmaTextFile[selectedLineNumber-1] = spacedTextLine


        this.setState({ 
                          gnmaTextFile:          gnmaTextFile, 
                          selectedGnmaTextLine:  spacedTextLine, 
                          selectedPropertyValue: newPropertyValue
                     })
    }

    onPropertyValueBlurred = (selectedLayoutInfo, selectedLineNumber, propertyValue) => {

        const { gnmaTextFile } = this.props.app
        const selectedLine = gnmaTextFile[selectedLineNumber-1]

        let paddedPropertyValue = selectedLayoutInfo.Pad.repeat(selectedLayoutInfo.Length)
        let newPropertyValue = ''

        switch(selectedLayoutInfo.Align) {
            case 'Left':
                newPropertyValue = (propertyValue + paddedPropertyValue).substring(0, paddedPropertyValue.length)
                break
            case 'Right':
                newPropertyValue = (paddedPropertyValue + propertyValue).slice(-paddedPropertyValue.length)
                break
            default:
                break
        }

        const finalLine = selectedLine.substr(0, selectedLayoutInfo.Start-1) + newPropertyValue + selectedLine.substr(selectedLayoutInfo.Start + selectedLayoutInfo.Length - 1)

        const spacedTextLine = finalLine.replace(/ /g,'\u00a0')

        gnmaTextFile[selectedLineNumber-1] = spacedTextLine

        this.setState({ 
                          gnmaTextFile:          gnmaTextFile, 
                          selectedGnmaTextLine:  spacedTextLine, 
                          selectedPropertyValue: newPropertyValue
                     })
    }

    onFilterFiles = (filteredFileName) => {
        this.setState({ filteredFileName: filteredFileName })
    }

    onSortFiles = (sortField) => {
        this.props.dispatch(appActions.sortFileInfos(sortField))
    }

    onFilterTextFile = (filteredTextCriteria) => {
        this.setState({filteredTextCriteria: filteredTextCriteria})
    }

    getFilteredFiles = () => {

        const { textFiles } = this.props.app
        const { filteredFileName } = this.state

        let filteredFiles = []
        
        if (filteredFileName) {
            filteredFiles = _.filter(textFiles, (o) => o.Name.toUpperCase().startsWith(filteredFileName.toUpperCase()))
        } else {
            filteredFiles = textFiles
        }
        return filteredFiles
    }

    getHideLoansForLargeFiles = () => {

        const { selectedRecordLevel, hideLoans, selectedGnmaTextFile } = this.state

        let shouldHideLoansForLargeFiles = hideLoans

        if (selectedGnmaTextFile.Length > 100000) {
            if (selectedRecordLevel.length === 0) {
                shouldHideLoansForLargeFiles = true
            }
        }

        return shouldHideLoansForLargeFiles
    }

    filterGnmaTextFile = () => {

        // Currently, line numbers aren't actual line numbers in the file. Instead, they are 'calculated' by the INDEX of a line in an Array.
        // This means that when lines are FILTERED by RECORD TYPE - e.g. Only show 'M01' lines - the 'line numbers' are inaccurate because the 
        // filtered lines are no longer in the same index position they were in the original array.

        // Is it possible to 'FITLER' and return not only the TEXT LINE but also the LINE NUMBER?

        // Filter the TEXT LINES in a FOR LOOP: 
        //      - For each FOUND LINE return the Original Line
        //      - For every NOT-FOUND LINE return an 'X' for the line
        //   This would ensure the array sizes stay the same for line numbering and then lines that are 'X' could be ignored for RENDERING.
        //   Lines are RENDERED in the 'renderTxtLines' method of 'GnmaTxtFile.js'. If the LINE in the FILTERED ARRAY equals 'X', then IGNORE the line and do NOT RENDER.

        const { gnmaTextFile } = this.props.app
        const { selectedRecordLevel, filteredTextCriteria } = this.state

        let filteredGnmaTextFile = []

        const isFilteredByRecordLevel = selectedRecordLevel.length  > 0
        const isFilteredByUserInput   = filteredTextCriteria.length > 0

        if (isFilteredByRecordLevel || isFilteredByUserInput) {

            if (isFilteredByRecordLevel && isFilteredByUserInput) {
                gnmaTextFile.forEach((line) => {
                    const recordType = line.substring(0, 3)
                    if (isFilteredByRecordLevel) {
                        filteredGnmaTextFile.push( recordType.startsWith(selectedRecordLevel) && line.toUpperCase().includes(filteredTextCriteria.toUpperCase()) ? line : 'X' )
                    }
                })
            } else if (isFilteredByRecordLevel) {
                gnmaTextFile.forEach((line) => {
                    const recordType = line.substring(0, 3)
                    filteredGnmaTextFile.push( recordType.startsWith(selectedRecordLevel) ? line : 'X' )
                })
            } else if (isFilteredByUserInput) {
                gnmaTextFile.forEach((line) => {
                    if (isFilteredByUserInput) {
                        filteredGnmaTextFile.push( line.toUpperCase().includes(filteredTextCriteria.toUpperCase()) ? line : 'X' )
                    }
                })
            }

        } else {
            filteredGnmaTextFile = gnmaTextFile
        }

        return filteredGnmaTextFile
    }

    filterLargeGnmaTextFile = () => {

        // 'Large' files will crash the browser - not so much due to the actual TEXT size of the file - but rather due to the huge size of the HTML generated to display in the browser.
        // Currently using a 'magic-number' of '100,000' lines in the 'getHideLoansForLargeFiles' method to defined a 'large' file.
        // If the file is defined as 'large' then only POOL-Level lines will be displayed when the file loads. A user can then, at most, only view singular 'M-Level' lines, e.g. all M01 lines, all M02 lines, etc.

        const { gnmaTextFile } = this.props.app
        const { filteredTextCriteria } = this.state

        let filteredGnmaTextFile = []

        gnmaTextFile.forEach((line) => {
            const recordType = line.substring(0, 3)
            if (filteredTextCriteria) {
                filteredGnmaTextFile.push( !recordType.startsWith('M') && line.toUpperCase().includes(filteredTextCriteria.toUpperCase()) ? line : 'X' )
            }
            else {
                filteredGnmaTextFile.push( !recordType.startsWith('M') ? line : 'X' )
            }
        })

        return filteredGnmaTextFile
    }

    getFilteredGnmaTextFile = () => {

        // Currently, line numbers aren't actual line numbers in the file. Instead, they are 'calculated' by the INDEX of the line in an Array.
        // This means that when lines are FILTERED by RECORD TYPE - e.g. Only show 'M01' lines - the 'line numbers' are inaccurate because the 
        // filtered lines are no longer in the same index position they were in the original array.

        // One way to fix this could be to return an object array where each object in the array contains the line number and the actual text of the line.
        // The other way to fix this would be to 'mark' excluded lines and then 'ignore' these 'marked' lines during rendering.
        // For example, if a line matches some criteria, then return the line. Otherwise, just return an arbtrarily assigned 'X'.
        // Then - during rendering - just ignore any lines in the resulting array that begin with 'X'.

        // Filter the TEXT LINES in a FOR LOOP: 
        //      - For each FOUND LINE return the Original Line
        //      - For every NOT-FOUND LINE return an 'X' for the line
        //   This would ensure the array sizes stay the same for line numbering and then lines that are 'X' could be ignored for RENDERING.
        //   Lines are RENDERED in the 'renderTxtLines' method of 'GnmaTxtFile.js'. If the LINE in the FILTERED ARRAY equals 'X', then IGNORE the line and do NOT RENDER.

        let filteredGnmaTextFile = []

        const shouldHideLoansForLargeFiles = this.getHideLoansForLargeFiles()

        if (shouldHideLoansForLargeFiles) {

            filteredGnmaTextFile = this.filterLargeGnmaTextFile()

        } else {
            filteredGnmaTextFile = this.filterGnmaTextFile()
        }

        return filteredGnmaTextFile
    }

    render() {

        const { poolRecordLayouts, fileShareLocation, gnmaTextFile } = this.props.app

        const { selectedLayouts, selectedGnmaTextLine, selectedPropertyValue, selectedLayoutInfo, selectedLineNumber, selectedRecordLevel, selectedGnmaTextFile, filteredTextCriteria, isLoadFileModalOpen, hideLoans } = this.state

        const filteredGnmaTextFile = this.getFilteredGnmaTextFile()
        const textFiles = this.getFilteredFiles()

        return (
                   <div>
                       <div className="gnma-flair">
                           gnma text files
                       </div>
                       <div id="gnma-txt-file" className="gnma-flex">
                           <div className="gnma-flex-left">
                                <GnmaToolbar selectedRecordLevel      = {selectedRecordLevel}
                                             selectedGnmaTextFile     = {selectedGnmaTextFile}
                                             filteredTextCriteria     = {filteredTextCriteria}
                                             gnmaTextFile             = {gnmaTextFile} 
                                             onLoadFileClick          = {this.onLoadFileClick}
                                             onSaveFileClick          = {this.onSaveFileClick}
                                             onClearFileClick         = {this.onClearFileClick}
                                             onRecordLevelSelected    = {this.onRecordLevelSelected} 
                                             onClearSelectionsClick   = {this.onClearSelectionsClick}
                                             onHideLoansToggleClick   = {this.onHideLoansToggleClick}
                                             onFilterTextFile         = {this.onFilterTextFile}
                                             hideLoans                = {hideLoans}
                                />
                                <GnmaTxtFile filteredGnmaTextFile     = {filteredGnmaTextFile} 
                                             poolRecordLayouts        = {poolRecordLayouts}
                                             selectedLayoutInfo       = {selectedLayoutInfo}
                                             selectedLineNumber       = {selectedLineNumber}
                                             selectedGnmaTextFile     = {selectedGnmaTextFile}
                                             fileShareLocation        = {fileShareLocation}
                                             onTxtPropertyClick       = {this.onTxtPropertyClick} 
                                             onTxtPropertyMouseOver   = {this.onTxtPropertyMouseOver}
                                             onTxtLineClick           = {this.onTxtLineClick}
                                />
                           </div>
                           <div className="gnma-flex-right">
                                <ParsedTxtLine selectedLayout         = {selectedLayouts} 
                                               selectedGnmaTextLine   = {selectedGnmaTextLine} 
                                               selectedPropertyValue  = {selectedPropertyValue}
                                               selectedLayoutInfo     = {selectedLayoutInfo}
                                               selectedLineNumber     = {selectedLineNumber}
                                               selectedRecordLevel    = {selectedRecordLevel}
                                               selectedGnmaTextFile   = {selectedGnmaTextFile}
                                               onLayoutInfoClick      = {this.onLayoutInfoClick} 
                                               onPropertyValueChanged = {this.onPropertyValueChanged}
                                               onPropertyValueBlurred = {this.onPropertyValueBlurred}
                                />
                           </div>
                           <ScrollToTop showUnder={160}>
                               <span className="to-top"><RegularArrowAltCircleUp /></span>
                           </ScrollToTop>
                       </div>
                       <ReactModal isOpen         = {isLoadFileModalOpen}
                                   onRequestClose = {this.onRequestLoadFileClose}
                                   style          = {{
                                                         overlay: {
                                                                    position:       'fixed',
                                                                    top:             '5.0em',
                                                                    bottom:          '4em',
                                                                    left:            '33%',
                                                                    right:           '33%',
                                                                    borderRadius:    '8px',
                                                                    backgroundColor: 'rgba(255, 255, 255, 0.25)'
                                                                  },
                                                         content: {
                                                                    position:        'absolute',
                                                                    top:             '0.50em',
                                                                    bottom:          '0.50em',
                                                                    left:            '0.50em',
                                                                    right:           '0.50em',
                                                                    border:          '1px solid rgba(255, 255, 255, 0.75)',
                                                                    borderRadius:    '4px',
                                                                    outline:         'none',
                                                                    padding:         '1em 2em 1em 2em', 
                                                                    backgroundColor: 'rgba(64, 64, 64, 1.0)', 
                                                                    overflow:        'none'
                                                                  }
                                                    }}
                       >
                            <LoadGnmaTxtFile textFiles          = {textFiles} 
                                             onRequestClose     = {this.onRequestLoadFileClose} 
                                             onFilterFiles      = {this.onFilterFiles} 
                                             onTextFileSelected = {this.onTextFileSelected} 
                                             onRefreshFileList  = {this.onRefreshFileList}
                                             onSortFiles        = {this.onSortFiles}
                            />
                       </ReactModal>
                   </div>
               )
    }
}

GnmaTxtFilePage.contextTypes = {
                                   store: PropTypes.object
                               }

const mapStateToProps = (state) => {
  
    return { 
               app: state.app 
           }
}

export default connect(mapStateToProps)(GnmaTxtFilePage)
