import React, { Fragment } from 'react'
import { pencil, check, closeIcon } from '../../../../../../helpers/icons'
import { clientName } from '../../../../../../helpers/clientHelpers'
import moment from 'moment'
import './index.css'

export default function Header(props){

  const { inv, evt, isNew, editMode  } = props
  // Functions to Show Summary field based on Mode ----------------------

  function displaySummary(){
    return (
      <div className="InvoiceDetail-header--name">
        {clientAndDate()}
      </div>
    )
  }

  function clientAndDate(){
    if (inv) {
      let c;
      let e;
      if (inv.event) {
        c = inv.event.client
        e = inv.event
      } else if (evt) {
        c = evt.client
        e = evt
      }

      return (
        <Fragment>
          {c? <h2>{clientName(c, true)}</h2> : null}
          {e? <h2 style={{fontWeight: '400', padding: '0 20px'}}>{moment(e.start).format('MMMM Do YYYY')}</h2> : null}
        </Fragment>
      )
    }
  }

  //----------------------------------------------------------------------


  // Functions to Dynamically change buttons based on Mode ---------------
  function close(){
    if (!isNew && inv) {
      return (
        <div
          className="InvoiceDetail-header--icon left"
          onClick={() => props.close(true)}
        >
          {closeIcon('2x')}
        </div>
      )
    }
  }

  function edit(){
    return (
      <div
        className="InvoiceDetail-header--icon right"
        onClick={props.edit}
      >
        {pencil('2x')}
      </div>
    )
  }

  // function trashCan(){
  //   if (inv) {
  //     return (
  //       <div
  //         className="InvoiceDetail-header--icon right"
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
        className="InvoiceDetail-header--icon right"
        onClick={props.submit}
      >
        {check('2x')}
      </div>
    )
  }

  function displayButtons(){
    if (editMode) {
      return (
        <div className="InvoiceDetail-header--icons">
          {close()}
          {submit()}
        </div>
      )
    } else {
      return (
        <div className="InvoiceDetail-header--icons">
          {edit()}
          {/* {trashCan()} */}
        </div>
      )
    }
  }

//----------------------------------------------------------------------

  return (
    <div className="InvoiceDetail-header--container">
      <div className="InvoiceDetail-header">
        {displaySummary()}
        <div className="InvoiceDetail-header--right">
          {displayButtons()}
        </div>
      </div>
    </div>
  )
}
