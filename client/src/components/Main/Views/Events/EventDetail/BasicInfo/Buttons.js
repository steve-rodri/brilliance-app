import React, { Fragment } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPencilAlt, faCheck, faTrash } from '@fortawesome/free-solid-svg-icons'
import { styleConfirmation, changeConfirmation } from '../../../../../Helpers/eventConfirmation'

library.add(faPencilAlt)
library.add(faCheck)
library.add(faTrash)

export default function Buttons(props) {
  // Functions to Dynamically change buttons based on Mode ---------------

  const { evt, editMode, fields } = props

  function edit(){
    return (
      <button
        className="BasicInfo--Button"
        onClick={() => {
          props.edit()
          props.scrollToTop()
        }}
      >
        <span className="BasicInfo--Button-Text">Edit</span>
        {<FontAwesomeIcon className="BasicInfo--Button-Icon" icon="pencil-alt" size="2x"/>}
      </button>
    )
  }

  function trash(){
    if (evt) {
      return (
        <button
          className="BasicInfo--Button Delete"
        >
          <span className="BasicInfo--Button-Text">DELETE</span>
          {<FontAwesomeIcon className="BasicInfo--Button-Icon" icon="trash" size="2x"/>}
        </button>
      )
    }
  }

  function submit(){
    return (
      <button
        className="BasicInfo--Button Submit"
        onClick={props.handleSubmit}
      >
        <span className="BasicInfo--Button-Text">SUBMIT</span>
        {<FontAwesomeIcon className="BasicInfo--Button-Icon" icon="check" size="2x"/>}
      </button>
    )
  }

  function confirmation(){
    return (
      <div
        className="BasicInfo--event-status BasicInfo--Button"
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
          {trash()}
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
    <div className="BasicInfo--Buttons">
      {displayButtons()}
    </div>
  )
}
