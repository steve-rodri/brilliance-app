import React from 'react'
import { pencilIcon, checkIcon, timesIcon } from '../../../../../../helpers/icons'
// import { styleConfirmation, changeConfirmation } from '../../../../../../Helpers/eventHelpers'
import './index.css'

export default function Header(props){

  const {
    evt,
    fields,
    isNew,
    editMode,
    mobile,
    handleChange,
    // handleStatusChange,

    close,
    edit,
    handleSubmit

  } = props

  // Functions to Show Summary field based on Mode ----------------------

  const handleFocusSelect = (e) => {
    e.target.select()
  }

  function displaySummary(){
    if (editMode && evt && !mobile) {
      return (
        <div className="EventDetail--event-title-container">
          <input
            className="EventDetail--event-summary"
            name="summary"
            value={fields.summary? fields.summary : ''}
            onChange={handleChange}
            onFocus={handleFocusSelect}
          />
        </div>
      )
    } else {
      return (
        <div className="EventDetail--event-title-container">
          <h3
            className="EventDetail--event-title"
          >
            {fields && fields.summary}
          </h3>
        </div>
      )
    }
  }

  //----------------------------------------------------------------------

  //Function to display status of event (confirmation)--------------------
  // function displayConfirmation(){
  //   if (fields && fields.confirmation && !editMode) {
  //     return (
  //       <div
  //         className="EventDetail--event-status"
  //         name="confirmation"
  //         onClick={(e) => {
  //           e.stopPropagation();
  //           props.handleStatusChange('confirmation', changeConfirmation(fields.confirmation)
  //         )}}
  //         style={styleConfirmation(fields.confirmation)}
  //       >
  //         <p>{fields.confirmation}</p>
  //       </div>
  //     )
  //   } else {
  //     return null
  //   }
  // }

  //----------------------------------------------------------------------

  // Functions to Dynamically change buttons based on Mode ---------------
  function cancel(){
    if (!isNew && evt) {
      return (
        <div
          className="EventDetail--icon left"
          onClick={close}
        >
          {timesIcon('2x')}
        </div>
      )
    }
  }

  function Edit(){
    return (
      <div
        className="EventDetail--icon right"
        onClick={edit}
      >
        {pencilIcon('2x')}
      </div>
    )
  }

  // function trashCan(){
  //   if (evt) {
  //     return (
  //       <div
  //         className="EventDetail--icon right"
  //         onClick={props.delete}
  //       >
  //         {trash('2x')}
  //       </div>
  //     )
  //   }
  // }

  function submit(){
    return (
      <div
        className="EventDetail--icon right"
        onClick={handleSubmit}
      >
        {checkIcon('2x')}
      </div>
    )
  }

  function displayButtons(){
    if (editMode) {
      return (
        <div className="EventDetail--icons">
          {cancel()}
          {submit()}
        </div>
      )
    } else {
      return (
        <div className="EventDetail--icons">
          {Edit()}
          {/* {trashCan()} */}
        </div>
      )
    }
  }

//----------------------------------------------------------------------

  return (
    <div className="EventDetail--header">
      {displaySummary()}
      <div className="EventDetail--header-right">
        {displayButtons()}
      </div>
    </div>
  )
}
