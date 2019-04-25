import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { clientName } from '../../../../../../helpers/clientHelpers'
import { styleStatus } from '../../../../../../helpers/invoiceStatus'
import numeral from 'numeral'
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
          <label style={{justifySelf: 'center'}}>Job</label>
          <Link to={`/admin/events/${event.id}`}><div className="Field">View Job</div></Link>
        </Fragment>
      )
    }
  }

  total = () => {
    const { inv } = this.props
    if (inv) {
      return <h2 style={{ textAlign: 'left'}}>{numeral(inv.total).format('$0,0.00')}</h2>
    }
  }

  paymentStatus = () => {
    const { inv } = this.props
    if (inv) {
      return <p style={this.stylePaymentStatus(inv.paymentStatus)} >{inv.paymentStatus}</p>
    }
  }

  paymentType = () => {
    const { inv } = this.props
    if (inv) {
      if (inv.paymentType && inv.paymentType !== "Unknown") {
        return (
          <div style={{justifySelf: 'start'}}>
            <h4 style={{paddingBottom: '5px'}}>{inv.paymentType}</h4>
            {inv.check? <p>{inv.check}</p> : null}
          </div>
        )
      }
    }
  }

  status = () => {
    return (
      <Fragment>
        <label>Payment Status</label>
        {this.paymentStatus()}
        <label style={{justifySelf: 'start'}}>Type</label>
        {this.paymentType()}
        <label>Total</label>
        {this.total()}
      </Fragment>
    )
  }


  stylePaymentStatus = (status) => {
    let style = styleStatus(status);
    style.width = 'auto'
    style.padding = '5px 10px'
    style.fontSize = '18px'
    style.fontWeight = 'bold'
    return style;
  }

  render(){
    const { inv } = this.props
    return (
      <div className="SubHeader">

        <div className="SubHeader--Show SubHeader--fields-container">
          <div className="SubHeader--Show SubHeader--component-title"><h3>About</h3></div>
          <div className="SubHeader--Show SubHeader--fields">
            {this.type()}
            {this.client()}
            {this.event()}
          </div>
        </div>

        {
          inv && inv.kind !== 'Proposal'?
          <div className="SubHeader--Show SubHeader--status-container">
            <div className="SubHeader--Show SubHeader--component-title"><h3>Status</h3></div>
            <div className="SubHeader--Show SubHeader--status">
              {this.status()}
            </div>
          </div>
          :
          null
        }

      </div>
    )
  }
}
