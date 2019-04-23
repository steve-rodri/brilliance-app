import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { clientName } from '../../../../../../helpers/clientHelpers'
import './index.css'

export default class SubHeader extends Component {

  type = () => {
    const { inv } = this.props
    if (inv && inv.kind) {
      return (
        <Fragment>
          <label>Type</label>
          <div className="Show Field">{inv.kind}</div>
        </Fragment>
      )
    }
  }

  client = () => {
    let event;
    const { inv, evt } = this.props
    if (inv && inv.event) {
      event = inv.event
    } else if (evt) {
      event = evt
    }

    if (event && event.client) {
      return (
        <Fragment>
          <label>Client</label>
          <div className="Show Field">{clientName(event.client)}</div>
        </Fragment>
      )
    }
  }

  event = () => {
    const { inv } = this.props
    if (inv && inv.event) {
      const { event } = inv
      return (
        <Fragment>
          <label>Job</label>
          <Link to={`/admin/events/${event.id}`}><div>View Job</div></Link>
        </Fragment>
      )
    }
  }

  paymentStatus = () => {
    const { inv } = this.props
    if (inv) {
      return <h2>{inv.paymentStatus}</h2>
    }
  }

  paymentType = () => {
    const { inv } = this.props
    if (inv) {
      if (inv.paymentType && inv.paymentType !== "Unknown") {
        return <h4>{inv.paymentType}</h4>
      }
    }
  }

  checkInfo = () => {
    const { inv } = this.props
    if (inv) {
      if (inv.checkInfo) {
        return <p>{inv.checkInfo}</p>
      }
    }
  }

  render(){
    return (
      <div className="SubHeader">

        <div className="SubHeader--Show SubHeader--fields">
          {this.type()}
          {this.client()}
          {this.event()}
        </div>

        <div className="SubHeader--Show SubHeader--status">
        {this.paymentStatus()}
        {this.paymentType()}
        {this.checkInfo()}
        </div>

      </div>
    )
  }
}
