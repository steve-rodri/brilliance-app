import React, { Component, Fragment } from 'react'
import { clientName } from '../../../../Helpers/clientHelpers'
import './SubHeader.css'

export default class SubHeader extends Component {

  type = () => {
    const { invoice } = this.props
    if (invoice) {
      return (
        <Fragment>
          <label>Type</label>
          <div className="Field">{invoice.kind}</div>
        </Fragment>
      )
    }
  }

  client = () => {
    const { invoice } = this.props
    if (invoice && invoice.event) {
      const { event } = invoice
      if (event && event.client) {
        return (
          <Fragment>
            <label>Client</label>
            <div className="Field">{clientName(event.client)}</div>
          </Fragment>
        )
      }
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
