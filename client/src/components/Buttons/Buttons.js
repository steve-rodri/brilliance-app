import React, { Fragment } from 'react'
import { pencil, check, trash } from '../Helpers/icons'
import { styleConfirmation, changeConfirmation } from '../Helpers/eventConfirmation'
import './Buttons.css'

export default function Buttons(props) {
  // Functions to Dynamically change buttons based on Mode ---------------

  const {
    evt,
    editMode,
    fields,
    edit,
    scrollToTop,
    handleSubmit,
    handleStatusChange,

   } = props

  function editButton(){
    return (
      <button
        className="Button"
        onClick={() => {
          edit()
          scrollToTop()
        }}
      >
        <span className="Button-text">Edit</span>
        {pencil('2x', 'Button-icon')}
      </button>
    )
  }

  function trashCan(){
    if (evt) {
      return (
        <button
          className="Button Delete"
        >
          <span className="Button-text">DELETE</span>
          {trash('2x', 'Button-icon')}
        </button>
      )
    }
  }

  function submit(){
    return (
      <button
        className="Button Submit"
        onClick={handleSubmit}
      >
        <span className="Button-text">SUBMIT</span>
        {check('2x', 'Button-icon')}
      </button>
    )
  }

  function confirmation(){
    if (fields && fields.confirmation) {
      return (
        <div
          className="event-status Button"
          name="confirmation"
          onClick={(e) => {
            e.stopPropagation();
            handleStatusChange('confirmation', changeConfirmation(fields && fields.confirmation)
          )}}
          style={styleConfirmation(fields && fields.confirmation)}
        >
          <p>{fields && fields.confirmation}</p>
        </div>
      )
    } else {
      return null
    }
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
          {editButton()}
        </Fragment>
      )
    }
  }
  return (
    <div className="Buttons">
      {displayButtons()}
    </div>
  )
}
