import React, { Fragment } from 'react'
import { pencil, check, closeIcon, trash } from '../../../../../Helpers/icons'
import { clientName } from '../../../../../Helpers/clientHelpers'
import moment from 'moment'
import './index.css'

export default function Header(props){

  const { invoice, evt, isNew, editMode  } = props
  // Functions to Show Summary field based on Mode ----------------------

  function displaySummary(){
    return (
      <div className="Header--name">
        {clientAndDate()}
      </div>
    )
  }

  function clientAndDate(){
    if (invoice) {
      let c;
      let e;
      if (invoice.event) {
        c = invoice.event.client
        e = invoice.event
      } else if (evt) {
        c = evt.client
        e = evt
      }

      return (
        <Fragment>
          {c? <h2>{clientName(c, true)}</h2> : null}
          {e? <h2 style={{fontWeight: '400'}}>{moment(e.start).format('MMMM Do YYYY')}</h2> : null}
        </Fragment>
      )
    }
  }

  //----------------------------------------------------------------------


  // Functions to Dynamically change buttons based on Mode ---------------
  function close(){
    if (!isNew && invoice) {
      return (
        <div
          className="Header--icon left"
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
        className="Header--icon right"
        onClick={props.edit}
      >
        {pencil('2x')}
      </div>
    )
  }

  function trashCan(){
    if (invoice) {
      return (
        <div
          className="Header--icon right"
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
        className="Header--icon right"
        onClick={props.handleSubmit}
      >
        {check('2x')}
      </div>
    )
  }

  function displayButtons(){
    if (editMode) {
      return (
        <div className="Header--icons">
          {close()}
          {submit()}
        </div>
      )
    } else {
      return (
        <div className="Header--icons">
          {edit()}
          {trashCan()}
        </div>
      )
    }
  }

//----------------------------------------------------------------------

  return (
    <div className="Header">
      {displaySummary()}
      <div className="Header--right">
        {displayButtons()}
      </div>
    </div>
  )
}
