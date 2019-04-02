import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { clientName } from '../../../../../Helpers/clientHelpers'
import './index.css'

export default class SubHeader extends Component {

  type = () => {
    const { invoice } = this.props
    if (invoice && invoice.kind) {
      return (
        <Fragment>
          <label>Type</label>
          <div className="Field">{invoice.kind}</div>
        </Fragment>
      )
    }
  }

  client = () => {
    let event;
    const { invoice, evt } = this.props
    if (invoice && invoice.event) {
      event = invoice.event
    } else if (evt) {
      event = evt
    }

    if (event && event.client) {
      return (
        <Fragment>
          <label>Client</label>
          <div className="Field">{clientName(event.client)}</div>
        </Fragment>
      )
    }
  }

  event = () => {
    const { invoice } = this.props
    if (invoice && invoice.event) {
      const { event } = invoice
      return (
        <Fragment>
          <label>Job</label>
          <Link to={`/admin/events/${event.id}`}><div>View Job</div></Link>
        </Fragment>
      )
    }
  }

  paymentStatus = () => {
    const { invoice } = this.props
    if (invoice) {
      return <h2>{invoice.paymentStatus}</h2>
    }
  }

  paymentType = () => {
    const { invoice } = this.props
    if (invoice) {
      if (invoice.paymentType && invoice.paymentType !== "Unknown") {
        return <h4>{invoice.paymentType}</h4>
      }
    }
  }

  checkInfo = () => {
    const { invoice } = this.props
    if (invoice) {
      if (invoice.checkInfo) {
        return <p>{invoice.checkInfo}</p>
      }
    }
  }

  render(){
    return (
      <div className="SubHeader">

        <div className="SubHeader--fields">
          {this.type()}
          {this.client()}
          {this.event()}
        </div>

        <div className="SubHeader--status">
        {this.paymentStatus()}
        {this.paymentType()}
        {this.checkInfo()}
        </div>

      </div>
    )
  }
}
