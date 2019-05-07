import React, { Fragment } from 'react'
import { pencilIcon, checkIcon, trashIcon } from '../../helpers/icons'
import { styleConfirmation, changeConfirmation } from '../../helpers/eventHelpers'
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
    if (fields && fields.summary) {
      return (
        <div
          className="Button"
          onClick={() => {
            edit()
            scrollToTop()
          }}
        >
          <div className="Button--text"><p>Edit</p></div>
          <div className="Button--icon">{pencilIcon()}</div>
        </div>
      )
    } else return null
  }

  function trashCan(){
    if (evt) {
      return (
        <div
          className="Button Delete"
        >
          <div className="Button--text"><p>DELETE</p></div>
          <div className="Button--icon">{trashIcon()}</div>
        </div>
      )
    }
  }

  function submit(){
    return (
      <div
        className="Button Submit"
        onClick={handleSubmit}
      >
        <div className="Button--text"><p>SUBMIT</p></div>
        <div className="Button--icon">{checkIcon()}</div>
      </div>
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
          <div className="Button--text"><p>{fields && fields.confirmation}</p></div>
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
          {/* {trashCan()} */}
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
