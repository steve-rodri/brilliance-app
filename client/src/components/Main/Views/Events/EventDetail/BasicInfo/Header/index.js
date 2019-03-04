import React from 'react'
import { pencil, check, closeIcon, trash } from '../../../../../../Helpers/icons'
import { styleConfirmation, changeConfirmation } from '../../../../../../Helpers/eventConfirmation'
import './index.css'

export default function Header(props){

  const { evt, fields, isNew, editMode, mobile } = props
  // Functions to Show Summary field based on Mode ----------------------

  function displaySummary(){
    if (editMode && evt && !mobile) {
      return (
        <div className="BasicInfo--event-title-container">
          <input
            className="BasicInfo--event-summary"
            name="summary"
            value={fields.summary? fields.summary : ''}
            onChange={props.handleChange}
          />
        </div>
      )
    } else {
      return (
        <div className="BasicInfo--event-title-container">
          <h1
            className="BasicInfo--event-title"
          >
            {fields && fields.summary}
          </h1>
        </div>
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
        <p>{fields && fields.confirmation}</p>
      </div>
    )
  }

  //----------------------------------------------------------------------

  // Functions to Dynamically change buttons based on Mode ---------------
  function close(){
    if (!isNew && evt) {
      return (
        <div
          className="BasicInfo--icon left"
          onClick={props.close}
        >
          {closeIcon('2x')}
        </div>
      )
    }
  }

  function edit(){
    return (
      <div
        className="BasicInfo--icon right"
        onClick={props.edit}
      >
        {pencil('2x')}
      </div>
    )
  }

  function trashCan(){
    if (evt) {
      return (
        <div
          className="BasicInfo--icon right"
          onClick={props.delete}
        >
          {trash('2x')}
        </div>
      )
    }
  }

  function submit(){
    return (
      <div
        className="BasicInfo--icon right"
        onClick={props.handleSubmit}
      >
        {check('2x')}
      </div>
    )
  }

  function displayButtons(){
    if (editMode) {
      return (
        <div className="BasicInfo--icons">
          {close()}
          {submit()}
        </div>
      )
    } else {
      return (
        <div className="BasicInfo--icons">
          {edit()}
          {trashCan()}
        </div>
      )
    }
  }

//----------------------------------------------------------------------

  return (
    <div className="BasicInfo--header">
      {displaySummary()}
      {displayConfirmation()}
      <div className="BasicInfo--header-right">
        {displayButtons()}
      </div>
    </div>
  )
}
