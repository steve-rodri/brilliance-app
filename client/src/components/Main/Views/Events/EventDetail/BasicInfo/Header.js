import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPencilAlt, faCheck, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons'
import { styleConfirmation } from '../../../../../Helpers/styleConfirmation'

library.add(faPencilAlt)
library.add(faCheck)
library.add(faTimes)
library.add(faTrash)

export default function Header(props){

  const { evt, fields, isNew, editMode } = props

  // Functions to Show Summary field based on Mode ----------------------

  function displaySummary(){
    if (editMode && evt) {
      return (
        <input
          className="BasicInfo--event-summary"
          name="summary" value={fields.summary? fields.summary : ''}
          onChange={props.handleChange}
        />
      )
    } else {
      return (
        <h1
          className="BasicInfo--event-title"
        >
          {fields && fields.summary}
        </h1>
      )
    }
  }

  //----------------------------------------------------------------------

  //Function to display status of event (confirmation)--------------------
  function displayConfirmation(){
    return (
      <div
        className="BasicInfo--event-status"
        name="confirmation"
        onClick={(e) => {
          e.stopPropagation();
          props.handleStatusChange('confirmation', changeConfirmation(fields && fields.confirmation)
        )}}
        style={styleConfirmation(fields && fields.confirmation)}
      >
        {fields && fields.confirmation}
      </div>
    )
  }

  function changeConfirmation(msg){
    switch (msg) {
      case "Unconfirmed":
        return "Confirmed"
      case "Confirmed":
        return "Cancelled"
      case "Cancelled":
        return "Unconfirmed"
      default:
      break;
    }
  }


  //----------------------------------------------------------------------

  // Functions to Dynamically change buttons based on Mode ---------------
  function close(){
    if (!isNew && evt) {
      return (
        <div
          className="BasicInfo--button left"
          onClick={props.close}
        >
          <FontAwesomeIcon icon="times" size="2x"/>
        </div>
      )
    }
  }

  function edit(){
    return (
      <div
        className="BasicInfo--button right"
        onClick={props.edit}
      >
        <FontAwesomeIcon icon="pencil-alt" size="2x"/>
      </div>
    )
  }

  function trash(){
    if (evt) {
      return (
        <div
          className="BasicInfo--button right"
          onClick={props.delete}
        >
          <FontAwesomeIcon icon="trash" size="2x"/>
        </div>
      )
    }
  }

  function submit(){
    return (
      <div
        className="BasicInfo--button right"
        onClick={props.handleSubmit}
      >
        <FontAwesomeIcon icon="check" size="2x"/>
      </div>
    )
  }

  function displayButtons(){
    if (editMode) {
      return (
        <div className="BasicInfo--buttons">
          {close()}
          {submit()}
        </div>
      )
    } else {
      return (
        <div className="BasicInfo--buttons">
          {edit()}
          {trash()}
        </div>
      )
    }
  }

//----------------------------------------------------------------------

  return (
    <div className="BasicInfo--header">
      {displaySummary()}
      <div className="BasicInfo--header-right">
        {displayConfirmation()}
        {displayButtons()}
      </div>
    </div>
  )
}
