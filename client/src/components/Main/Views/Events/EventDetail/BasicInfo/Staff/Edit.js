import React, { Component } from 'react'
import SearchField from '../../../../../../SearchField'
import { deleteIcon, addIcon } from '../../../../../../Helpers/icons'

export default class Edit extends Component {
  constructor(props){
    super(props)
    this.state = {
      showInput: false
    }
  }

  styleRow = () => {
    return (
      {
        backgroundColor: '#eeeeee',
        borderRadius: '5px'
      }
    )
  }

  showInput = () => {
    this.setState({
      showInput: true
    })
  }

  render(){
    const { workers, workerField, searchResults, iconSize } = this.props
    return (
      <div className="Staff--container">
        <table className="Staff">
          <thead>
            <tr>
              <th className="Staff--icon-head"></th>
              <th className="Staff--worker-head">name</th>
            </tr>
          </thead>
          <tbody>
          {workers?
            workers.map( (worker, i) => {
              if (worker.isNew) {
                return (
                  (
                    <tr className="Staff--worker" key={worker.id} style={this.styleRow()}>
                      <td className="Staff--icon"><div onClick={() => this.props.removeWorker(i)}>{deleteIcon(iconSize)}</div></td>
                      <td>
                        <SearchField
                          searchResults={searchResults}
                          formClassName='Edit--field'
                          resultClassName='Edit--search-result'
                          resultsClassName='Edit--results'
                          // formDataValue={this.props.formData && this.props.formData.location_id}
                          formatResult={null}
                          input={{
                            className:'Input',
                            placeholder:'search...',
                            name: 'worker',
                            value: workerField? workerField : ''
                          }}
                          handleChange={this.props.handleWorkerSearchChange}
                          onEnter={this.props.onEnter}
                          onSelect={this.props.onSelect}
                        />
                      </td>
                    </tr>
                  )
                )
              } else {
                return (
                  (
                    <tr className="Staff--worker" key={worker.id} style={this.styleRow()}>
                      <td className="Staff--icon"><div onClick={() => this.props.removeWorker(i)}>{deleteIcon(iconSize)}</div></td>
                      <td className="Staff--worker-name">{worker.info.contact.fullName}</td>
                    </tr>
                  )
                )
              }
            })
            :
            null
          }
          <tr style={this.styleRow()}>
            <td className="Staff--icon"><div onClick={this.props.addWorker}>{addIcon(iconSize)}</div></td>
          </tr>
          </tbody>
        </table>
      </div>
    )
  }
}
