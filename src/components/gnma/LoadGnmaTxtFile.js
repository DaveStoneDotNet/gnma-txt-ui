import React         from 'react'
import { Component } from 'react'
import { PropTypes } from 'prop-types'

import moment        from 'moment'
import _             from 'lodash'

import { ENTER }     from '../common/Keys'
import { ESC }       from '../common/Keys'

import { RegularTimesCircle }  from '../common/Icons'
import { SolidSyncAlt       }  from '../common/Icons'
import { SolidChevronUp     }  from '../common/Icons'
import { SolidChevronDown   }  from '../common/Icons'

import './load-gnma-txt-file.css'

class LoadGnmaTxtFile extends Component {

    constructor(props) {
        super(props)
        this.state = { 
                        filteredFileName: '', 
                        sortFields:       [
                                            { name: 'Name', direction: 'asc'}, 
                                            { name: 'Size', direction: ''}, 
                                            { name: 'Date', direction: ''}
                                          ]
                     }
    }

    componentDidMount() {
        this.typeaheadReference.focus()
    }

    handleInputKeyUp(e) {
        switch (e.keyCode) {
            case ESC:
                this.onCloseModal()
                break
            case ENTER:
                const { textFiles } = this.props
                if (textFiles.length === 1) {
                    this.onCloseModal()
                }
                break
            default:
                break
        }
    }

    onFileNameFilterValueChanged = (e) => {
        this.setState({ filteredFileName: e.target.value.toUpperCase() })
    }

    onClearFilter = () => {

        const { onFilterFiles } = this.props
        
        this.setState({ filteredFileName: '' })
        onFilterFiles('')
        
        this.typeaheadReference.focus()
    }

    onFindFile = (e) => {
        const fileName = e.target.value
        const {onFilterFiles} = this.props
        _.debounce(onFilterFiles, 500)(fileName)
    }

    onRefreshFileList = () => {
        const { onRefreshFileList } = this.props
        onRefreshFileList()
    }

    onCloseModal = () => {
        const { onRequestClose } = this.props
        this.onClearFilter()
        onRequestClose()
    }

    onRowSelected = (textFile) => {
        const { onRequestClose, onTextFileSelected } = this.props
        onTextFileSelected(textFile)
        onRequestClose()
    }

    onSortFiles = (name) => {

        const { onSortFiles } = this.props

        const { sortFields } = this.state
        const sortIndex = _.findIndex(sortFields, { name: name })
        const sortField = sortFields[sortIndex]

        let direction = ''

        switch (sortField.direction) {
            case 'asc':
                direction = 'desc'
                break
            case 'desc':
                direction = 'asc'
                break
            default:
                direction = 'asc'
                break
        }

        // Clone all the sort fields, reset the direction of all items to empty, then update the selected field

        this.setState(prevState => {
            const clonedSortFields = [...prevState.sortFields]
            _.forEach(clonedSortFields, o => o.direction = '')
            clonedSortFields[sortIndex].direction = direction
            return {sortFields: clonedSortFields};
        })

        onSortFiles({name, direction})
    }

    getSortIcon = (name) => {
        const { sortFields } = this.state
        const sort = _.find(sortFields, { name: name })
        if (sort.name === name) {
            switch (sort.direction) {
                case 'asc':
                    return <SolidChevronUp />
                case 'desc':
                    return <SolidChevronDown />
                default:
                    return null
            }
        }
    }

    renderTextFiles = () => {

        const { textFiles } = this.props

        return textFiles ? textFiles.map((textFile, index) => {
            return <tr key={index} className="load-file-row" onClick={(e) => this.onRowSelected(textFile)}>
                        <td className="load-file-item">{textFile.Name.toUpperCase()}</td>
                        <td className="load-file-item align-right">{textFile.Size}</td>
                        <td className="load-file-item">{moment(textFile.LastWriteTime).format('ddd MM-DD-YYYY HH:mm:ss A')}</td>
                   </tr>
        }) : null
        
    }

    render() {

        const textFiles = this.renderTextFiles()

        const nameSortIcon = this.getSortIcon('Name')
        const sizeSortIcon = this.getSortIcon('Size')
        const dateSortIcon = this.getSortIcon('Date')

        return (
                   <div className="load-gnma-txt-file">
                       <div className="flexed-load-file-header">
                            <div className="load-file-header">
                                    Load GNMA TXT File
                            </div>
                            <div>
                                <input className="find-file-input" onInput={this.onFindFile} value={this.state.filteredFileName } onChange={(e) => this.onFileNameFilterValueChanged(e)} onKeyUp={(e) => this.handleInputKeyUp(e)} ref={(typeahead) => this.typeaheadReference = typeahead } />
                            </div>
                            <div className="close-load-file" onClick={this.onClearFilter}><RegularTimesCircle /></div>
                            <div className="close-load-file" onClick={this.onRefreshFileList}><SolidSyncAlt /></div>
                            <div className="close-load-file" onClick={this.onCloseModal}>close</div>
                       </div>
                       <div className="load-file-hint">
                           { textFiles.length > 0 ? 'Select a file name below...' : 'No TXT files found in folder' }
                       </div>
                       <div className="gnma-txt-file-list">
                           <table className="load-file-table">
                               <thead>
                                   <tr>
                                        <th onClick={() => this.onSortFiles('Name')} className="load-file-table-header"><div className="flexed-sort-header"><div className="sort-head">Name</div><div className="sort-icon">{nameSortIcon}</div></div></th>
                                        <th onClick={() => this.onSortFiles('Size')} className="load-file-table-header"><div className="flexed-sort-header"><div className="sort-head">Size</div><div className="sort-icon">{sizeSortIcon}</div></div></th>
                                        <th onClick={() => this.onSortFiles('Date')} className="load-file-table-header"><div className="flexed-sort-header"><div className="sort-head">Date</div><div className="sort-icon">{dateSortIcon}</div></div></th>
                                   </tr>
                               </thead>
                               <tbody>
                                    {textFiles}
                               </tbody>
                           </table>
                            
                       </div>
                   </div>
               )
    }
}

LoadGnmaTxtFile.propTypes = {
                                textFiles:          PropTypes.array.isRequired, 
                                onRequestClose:     PropTypes.func.isRequired, 
                                onFilterFiles:      PropTypes.func.isRequired, 
                                onTextFileSelected: PropTypes.func.isRequired, 
                                onRefreshFileList:  PropTypes.func.isRequired, 
                                onSortFiles:        PropTypes.func.isRequired
                            }

LoadGnmaTxtFile.contextTypes = {
                                  store: PropTypes.object
                               }

export default LoadGnmaTxtFile
