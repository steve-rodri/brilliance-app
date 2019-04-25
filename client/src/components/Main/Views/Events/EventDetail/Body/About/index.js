import React, { Component } from 'react'
import { styleConfirmation, changeConfirmation } from '../../../../../../../helpers/eventHelpers'
import View from './View'
import Edit from './Edit'
import './index.css'

export default class About extends Component {

  view = () => {
    const { editMode } = this.props

    if (editMode) {

      return (
        <Edit
        {...this.props}
        />
      )

    } else {

      return (
        <View
          {...this.props}
        />
      )

    }
  }

  displayConfirmation = () => {
    const { fields, editMode } = this.props
    if (fields && fields.confirmation && !editMode) {
      return (
        <div
          className="About--event-status"
          name="confirmation"
          onClick={(e) => {
            e.stopPropagation();
            this.props.handleStatusChange('confirmation', changeConfirmation(fields.confirmation)
          )}}
          style={styleConfirmation(fields.confirmation)}
        >
          <p>{fields.confirmation}</p>
        </div>
      )
    } else {
      return null
    }
  }

  render(){
    const { editMode } = this.props
    return (
      <div className="EventDetail-Body--component EventDetail-Body--about">
        <div className="EventDetail-Body--component-title"><h3>About</h3></div>
        <div className="About--container">
          {this.view()}
        </div>
        {
          !editMode?
          <div className="About--event-status-container">
            {this.displayConfirmation()}
          </div>
          :
          null
        }
      </div>
    )
  }
}
