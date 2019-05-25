import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { clientName } from '../../../../../../helpers/clientHelpers'
import { styleStatus } from '../../../../../../helpers/invoiceStatus'
import numeral from 'numeral'
import './index.css'

export default class SubHeader extends Component {

  type = () => {
    const { inv, mobile } = this.props
    if (inv && inv.kind) {
      return (
        <Fragment>
          { mobile? <label>Type</label> : null }
          <h4>{inv.kind}</h4>
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
        <div><h3>{clientName(event.client)}</h3></div>
      )
    }
  }

  event = () => {
    const { inv, user: { accessLevel } } = this.props
    if (inv && inv.event) {
      const { event } = inv
      return (
        <Link to={`/${accessLevel}/events/${event.id}`}><div className="SubHeader Field">View Job</div></Link>
      )
    }
  }

  paymentStatus = () => {
    const { inv } = this.props
    if (inv) {
      return (
        <p style={this.stylePaymentStatus(inv.paymentStatus)}>
          {inv.paymentStatus}
        </p>
      )
    }
  }

  paymentType = () => {
    const { inv } = this.props
    if (inv) {
      if (inv.paymentType && inv.paymentType !== "Unknown") {
        return (
          <div>
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
        {this.paymentStatus()}
        {this.paymentType()}
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

  summary = () => {
    const { inv } = this.props
    if (inv) {
      const paid = inv.paymentStatus === 'Paid In Full'
      return (
        <Fragment>
          {this.total(inv)}
          {!paid? this.deposit(inv) : null}
          {!paid? this.balance(inv) : null}
        </Fragment>
      )
    }
  }

  total = (inv) => {
    return (
      <Fragment>
        <label>Total</label>
          <h3>
            {numeral(inv.total).format('$0,0.00')}
          </h3>
      </Fragment>
    )
  }

  deposit = (inv) => {
    return (
      <Fragment>
        <label>Deposit</label>
        <h3>
          {numeral(inv.total).format('$0,0.00')}
        </h3>
      </Fragment>
    )
  }

  balance = (inv) => {
    return (
      <Fragment>
        <label>Balance</label>
        <h3>
          {numeral(inv.balance).format('$0,0.00')}
        </h3>
      </Fragment>
    )
  }

  render(){
    const { inv, mobile, styleComp } = this.props
    return (
      <Fragment>

        <div className="SubHeader--Show SubHeader--fields-container" style={styleComp()}>
          <div className="SubHeader--Show SubHeader--component-title"><h4>About</h4></div>
          <div className="SubHeader--Show SubHeader--fields">
            {this.type()}
          </div>
        </div>

        {
          !mobile && inv && inv.kind !== 'Proposal'?
          <div className="SubHeader--Show SubHeader--status-container" style={styleComp()}>
            <div className="SubHeader--Show SubHeader--component-title"><h4>Status</h4></div>
            <div className="SubHeader--Show SubHeader--status">
              {this.status()}
            </div>
          </div>
          :
          null
        }

        {/* {
          !mobile?
          <div className="SubHeader--Show SubHeader--summary-container">
            <div className="SubHeader--Show SubHeader--component-title"><h3>Summary</h3></div>
            <div className="SubHeader--Show SubHeader--summary">
              {this.summary()}
            </div>
          </div>
          :
          null
        } */}

      </Fragment>
    )
  }
}
