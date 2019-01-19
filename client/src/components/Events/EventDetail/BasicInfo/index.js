import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import MainInfo from './MainInfo/index.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPencilAlt, faCheck, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons'
import './index.css'

library.add(faPencilAlt)
library.add(faCheck)
library.add(faTimes)
library.add(faTrash)

export default class BasicInfo extends Component {
  constructor(props){
    super(props)
    this.state = {
      redirectToEvents: false
    }
  }

  delete = () => {
    const { event } = this.props
    this.props.delete(event.id)
    this.setState({
      redirectToEvents: true
    })
  }

  styleSummary = (summary) => {
    if (summary) {
      if (summary.length > 35) {
        return {
          fontSize: '45px'
        }
      } else {
        return {}
      }
    } else {
      return {}
    }
  }

  render(){
    const { event, fields, searchFieldData, editMode, match } = this.props
    if (this.state.redirectToEvents) return (<Redirect to={match.path}/>)
    return (
      <div className="BasicInfo--container">
        <div className="BasicInfo--header">
          {editMode && event?
          <input className="BasicInfo--event-summary" style={this.styleSummary(fields && fields.summary)} name="summary" value={fields.summary? fields.summary : ''} onChange={this.props.handleChange}/>
          :
          <h1 className="BasicInfo--event-title" style={this.styleSummary(fields && fields.summary)}>{fields && fields.summary}</h1>
          }
          {editMode?
            <div className="BasicInfo--buttons">
              <div className="BasicInfo--button close" onClick={this.props.close}><FontAwesomeIcon icon="times" size="2x"/></div>
              <div className="BasicInfo--button edit" onClick={this.props.handleSubmit}><FontAwesomeIcon icon="check" size="2x"/></div>
            </div>
            :
            <div className="BasicInfo--buttons">
              <div className="BasicInfo--button edit" onClick={this.props.edit}><FontAwesomeIcon icon="pencil-alt" size="2x"/></div>
              {event?
              <div className="BasicInfo--button delete" onClick={this.delete}><FontAwesomeIcon icon="trash" size="2x"/></div>
              : ''}
            </div>
          }
        </div>

        <MainInfo
          event={event}
          searchFieldData={searchFieldData}
          fields={fields}
          editMode={editMode}
          handleSelect={this.props.handleSelect}
          handleChange={this.props.handleChange}
          handleSearchChange={this.props.handleSearchChange}
        />

        <div className="BasicInfo--staff-and-notes">
          <div className="BasicInfo--staff-container">
          </div>
          <div className="BasicInfo--notes-container">
            <label>Notes</label>
            {editMode?
              <textarea className="BasicInfo--notes" type="text" name='notes' value={fields.notes? fields.notes : ''} onChange={this.props.handleChange}/>
              :
              <textarea readOnly="readonly" value={event && event.notes? event.notes : ''} className="BasicInfo--notes-readonly"/>
            }
          </div>
        </div>
      </div>
    )
  }
}
