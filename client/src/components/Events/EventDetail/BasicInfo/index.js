import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import MainInfo from './MainInfo/index.js'
import Header from './Header'
import './index.css'

export default class BasicInfo extends Component {
  constructor(props){
    super(props)
    this.state = {}
  }

  render(){
    const { event, fields, editMode } = this.props
    return (
      <div className="BasicInfo--container">

        <Header
          {...this.props}
        />

        <MainInfo
          {...this.props}
        />

        <div className="BasicInfo--staff-and-notes">
          <div className="BasicInfo--staff-container"></div>
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
