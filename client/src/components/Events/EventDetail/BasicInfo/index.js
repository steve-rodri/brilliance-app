import React, { Component } from 'react'
import MainInfo from './MainInfo/index.js'
import Header from './Header'
import './index.css'

export default class BasicInfo extends Component {
  constructor(props){
    super(props)
    this.state = {}
  }

  render(){
    const { fields, editMode } = this.props
    return (
      <div className="BasicInfo--container">

        <Header
          {...this.props}
        />

        <MainInfo
          {...this.props}
        />

        <div className="BasicInfo--staff-and-notes">
          <div className="BasicInfo--staff-container">
            <label>Staff</label>
          </div>
          <div className="BasicInfo--notes-container">
            <label>Notes</label>
            {editMode?
              <textarea
                className="BasicInfo--notes"
                type="text" name='notes'
                value={fields.notes? fields.notes : ''}
                onChange={this.props.handleChange}
                tabIndex="9"
              />
              :
              <textarea
                className="BasicInfo--notes-readonly"
                value={fields && fields.notes? fields.notes : ''}
                readOnly="readonly"
              />
            }
          </div>
        </div>
      </div>
    )
  }
}
