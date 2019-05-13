import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { pencilIcon, checkIcon, timesIcon } from '../../../../../../helpers/icons'
import { clientName } from '../../../../../../helpers/clientHelpers'
import moment from 'moment'
import './index.css'

export default function Header(props){

  const { inv, evt, isNew, editMode, user: { accessLevel }, mobile } = props
  // Functions to Show Summary field based on Mode ----------------------

  function displaySummary(){
    return (
      <div className="InvoiceDetail-header--title">
        {clientAndDate()}
      </div>
    )
  }

  function displayJob(){
    if (!mobile) {
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
        <Fragment>
          {c? <h3 className="InvoiceDetail-header--client">{clientName(c, {oneLine: true})}</h3> : null}
              <div className="InvoiceDetail-header--client-date-seperator"></div>
          {e? <h3 className="InvoiceDetail-header--date">{moment(e.start).format('MMMM Do YYYY')}</h3> : null}
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
