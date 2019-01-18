import React         from 'react'
import { Component } from 'react'
import { PropTypes } from 'prop-types'

import _             from 'lodash'

import { ENTER }     from '../common/Keys'
import { ESC }       from '../common/Keys'

import { pluralize } from '../../util/dataFormatter'

import { RegularTimesCircle } from '../../components/common/Icons'

import './gnma-toolbar.css'

class GnmaToolbar extends Component {

    constructor(props) {
        super(props)
        this.state = {
                     }
    }    

    componentDidMount = () => {

    }

    handleInputKeyUp(e) {
        switch (e.keyCode) {
            case ESC:
                console.log('ESCAPE')
                break
            case ENTER:
                console.log('ENTER')
                break
            default:
                break
        }
    }

    onFileNameFilterValueChanged = (e) => {

    }

    onClearTextFileFilter = () => {

        const { onFilterTextFile } = this.props
        
        onFilterTextFile('')
        
        this.typeaheadReference.focus()
        this.typeaheadReference.value = ''
    }

    onTextFileFilterInput = (e) => {
        const filteredTextCriteria = e.target.value
        const {onFilterTextFile} = this.props
        onFilterTextFile(filteredTextCriteria)
    }

    onSaveFileClick = () => {
        const { selectedGnmaTextFile, onSaveFileClick } = this.props
        if (selectedGnmaTextFile.Name) {
            onSaveFileClick()
        }
    }

    getSelectedTextFileHeader = () => {

        const { gnmaTextFile, selectedGnmaTextFile } = this.props

        let loanCount = 0

         _.forEach(gnmaTextFile, (o) => { if (o.startsWith('M01')) { loanCount++ } })

        const selectedTextFileName = selectedGnmaTextFile.Name ? selectedGnmaTextFile.Name.toUpperCase() : 'Load a GNMA TXT file'

        return loanCount > 0 ? `${selectedTextFileName} - ${pluralize(loanCount,'Loan')}` : selectedTextFileName

    }

    render () {

        const { selectedRecordLevel, selectedGnmaTextFile, onLoadFileClick, onRecordLevelSelected, onClearSelectionsClick, onHideLoansToggleClick, filteredTextCriteria, hideLoans } = this.props

        const onSaveButtonCss = selectedGnmaTextFile.Name ? 'toolbar-btn' : 'toolbar-btn-disabled'

        const selectedTextFileHeader = this.getSelectedTextFileHeader()

        return (
            <div className="gnma-toolbar">

                <div className="flexed-gnma-toolbar">
                    <div className="toolbar-btn" onClick={onLoadFileClick}>Load</div>
                    <div className={onSaveButtonCss} onClick={this.onSaveFileClick}>Save</div>
                    <div className="toolbar-btn" onClick={onClearSelectionsClick}>Clear</div>
                    <div className="toolbar-item">
                            <select value={selectedRecordLevel} onChange={onRecordLevelSelected}>
                                <option value="" default> </option>
                                <option value="M01">M01</option>
                                <option value="M02">M02</option>
                                <option value="M03">M03</option>
                                <option value="M04">M04</option>
                                <option value="M05">M05</option>
                                <option value="M06">M06</option>
                                <option value="M07">M07</option>
                                <option value="M08">M08</option>
                                <option value="M10">M10</option>
                                <option value="M11">M11</option>
                            </select>
                    </div>
                    <div className="toolbar-item">
                        <div className="form-check hide-loans">
                            <input className="form-check-input" type="checkbox" id="hide-loans-checkbox" onChange={onHideLoansToggleClick} checked={hideLoans} />
                            <label className="form-check-label hide-loans" htmlFor="hide-loans-checkbox">
                                Hide Loans
                            </label>
                        </div>
                    </div>
                    <div className="toolbar-input">
                        <input className   = "search-file-input" 
                               placeholder = "Filter lines in file..."
                               value       = {filteredTextCriteria } 
                               onInput     = {this.onTextFileFilterInput} 
                               onChange    = {(e) => this.onFileNameFilterValueChanged(e)} 
                               onKeyUp     = {(e) => this.handleInputKeyUp(e)} 
                               ref         = {(typeahead) => this.typeaheadReference = typeahead } 
                        />
                    </div>
                    <div className="toolbar-item" onClick={this.onClearTextFileFilter} title="Clear filter"><div className="clear-search-file-input"><RegularTimesCircle /></div></div>
                </div>

                <div className="selected-text-file-name" onClick={onLoadFileClick}>
                    {selectedTextFileHeader}
                </div>

            </div>
        )
    
    }

}

GnmaToolbar.propTypes = {
                            selectedRecordLevel:    PropTypes.string.isRequired, 
                            filteredTextCriteria:   PropTypes.string.isRequired, 
                            selectedGnmaTextFile:   PropTypes.object.isRequired, 
                            gnmaTextFile:           PropTypes.array.isRequired, 
                            hideLoans:              PropTypes.bool.isRequired, 
                            onRecordLevelSelected:  PropTypes.func.isRequired, 
                            onFilterTextFile:       PropTypes.func.isRequired, 
                            onLoadFileClick:        PropTypes.func.isRequired, 
                            onSaveFileClick:        PropTypes.func.isRequired,
                            onClearFileClick:       PropTypes.func.isRequired,
                            onClearSelectionsClick: PropTypes.func.isRequired, 
                            onHideLoansToggleClick: PropTypes.func.isRequired
                        }

GnmaToolbar.contextTypes = {
                             store: PropTypes.object
                           }

export default GnmaToolbar