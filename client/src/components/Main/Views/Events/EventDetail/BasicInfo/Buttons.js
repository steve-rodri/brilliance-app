import React, { Fragment } from 'react'
import { pencil, check, trash } from '../../../../../Helpers/icons'
import { styleConfirmation, changeConfirmation } from '../../../../../Helpers/eventConfirmation'

export default function Buttons(props) {
  // Functions to Dynamically change buttons based on Mode ---------------

  const { evt, editMode, fields } = props

  function edit(){
    return (
      <button
        className="BasicInfo--button"
        onClick={() => {
          props.edit()
          props.scrollToTop()
        }}
      >
        <span className="BasicInfo--button-text">Edit</span>
        {pencil('2x', 'BasicInfo--button-icon')}
      </button>
    )
  }

  function trashCan(){
    if (evt) {
      return (
        <button
          className="BasicInfo--button Delete"
        >
          <span className="BasicInfo--button-text">DELETE</span>
          {trash('2x', 'BasicInfo--button-icon')}
        </button>
      )
    }
  }

  function submit(){
    return (
      <button
        className="BasicInfo--button Submit"
        onClick={props.handleSubmit}
      >
        <span className="BasicInfo--button-text">SUBMIT</span>
        {check('2x', 'BasicInfo--button-icon')}
      </button>
    )
  }

  function confirmation(){
    return (
      <div
        className="BasicInfo--event-status BasicInfo--button"
        name="confirmation"
        onClick={(e) => {
          e.stopPropagation();
          props.handleStatusChange('confirmation', changeConfirmation(fields && fields.confirmation)
        )}}
        style={styleConfirmation(fields && fields.confirmation)}
      >
        <p>{fields && fields.confirmation}</p>
      </div>
    )
  }

  function displayButtons(){
    if (editMode) {
      return (
        <Fragment>
          {trashCan()}
          {submit()}
        </Fragment>
      )
    } else {
      return (
        <Fragment>
          {confirmation()}
          {edit()}
        </Fragment>
      )
    }
  }
  return (
    <div className="BasicInfo--buttons">
      {displayButtons()}
    </div>
  )
}
