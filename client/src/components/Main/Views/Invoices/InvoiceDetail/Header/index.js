import React from 'react'
import { Link } from 'react-router-dom'
import { pencilIcon, checkIcon, timesIcon } from '../../../../../../helpers/icons'
import { clientName } from '../../../../../../helpers/clientHelpers'
import moment from 'moment'
import './index.css'

export default function Header(props){

  const { inv, evt, isNew, editMode, user: { accessLevel }, mobile } = props
  // Functions to Show Summary field based on Mode ----------------------

  function displaySummary(){
    return clientAndDate()
  }

  function displayJob(){
    if (!mobile && !editMode) {
      return (
        <div className="InvoiceDetail-header--view-job">
          {job()}
        </div>
      )
    }
  }

  function job(){
    if (inv && inv.event) {
      const { event } = inv
      return (
        <Link
          style={{textDecoration: 'none', color: "var(--light-gray)"}}
          to={`/${accessLevel}/events/${event.id}`}
        >
          <h2>View Job</h2>
        </Link>
      )
    }
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
        <div className="InvoiceDetail-header--title">
          {c? <h2 className="InvoiceDetail-header--client" style={!mobile && c && e? {justifySelf: "right"} : {justifySelf: "center"}}>{clientName(c)}</h2> : null}
          {!mobile && c && e? <div className="InvoiceDetail-header--client-date-seperator"></div> : null}
          {e? <h2 className="InvoiceDetail-header--date" style={!mobile && c && e? {justifySelf: "left"} : {justifySelf: "center"}}>{moment(e.start).format('MMMM Do YYYY')}</h2> : null}
        </div>
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
          {timesIcon('2x')}
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
        {pencilIcon('2x')}
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
        {checkIcon('2x')}
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
    <div className="InvoiceDetail-header">
      {displaySummary()}
      <div className="InvoiceDetail-header--right">
        {displayJob()}
        {displayButtons()}
      </div>
    </div>
  )
}
