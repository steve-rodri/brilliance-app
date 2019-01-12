import React, { Component } from 'react'
import MainInfo from './MainInfo/index.js'
import moment from 'moment'
import { event } from '../../../../services/event'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPencilAlt, faCheck } from '@fortawesome/free-solid-svg-icons'
import './index.css'

library.add(faPencilAlt)
library.add(faCheck)

export default class BasicInfo extends Component {
  constructor(props){
    super(props)
    this.state = {
      editMode: false
    }
  }

  render(){
    const { editMode } = this.state
    const { event, searchFieldData, fields } = this.props
    return (
      <div className="BasicInfo--container">
        <div className="BasicInfo--header">
          <h1 className="BasicInfo--event-title">Event Title</h1>
          {editMode?
            <div className="BasicInfo--editButton" onClick={this.props.handleSubmit}><FontAwesomeIcon icon="check" size="2x"/></div>
            :
            <div className="BasicInfo--editButton" onClick={this.edit}><FontAwesomeIcon icon="pencil-alt" size="2x"/></div>}
        </div>

        <MainInfo
          event={event}
          searchFieldData={searchFieldData}
          fields={fields}
          editMode={this.state.editMode}
          handleSelect={this.props.handleSelect}
          handleChange={this.props.handleChange}
          handleSearchChange={this.props.handleSearchChange}
        />

        <div className="BasicInfo--staff-and-notes">
          <div className="BasicInfo--staff-container">
          </div>
          <div className="BasicInfo--notes-container">
            <label>Notes</label>
            <p className="BasicInfo--notes">{event && event.notes? event.notes : ''}</p>
          </div>
        </div>
      </div>
    )
  }
}
