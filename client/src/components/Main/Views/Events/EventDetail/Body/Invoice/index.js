import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { styleStatus } from '../../../../../../../helpers/invoiceStatus'
import numeral from 'numeral'
import './index.css'

export default class Invoice extends Component {

  paymentStatus = (inv) => {
    if (inv) {
      return (
        <div className="Event-Invoice--status" style={this.stylePaymentStatus(inv.paymentStatus)}>
          <p>{inv.paymentStatus}</p>
        </div>
      )
    }
  }

  paymentType = (inv) => {
    if (inv) {
      if (inv.paymentType && inv.paymentType !== "Unknown") {
        return (
          <div>
            {
              inv.check?
              <p>{inv.paymentType}</p>
              :
              <p>{`${inv.paymentType} - ${inv.check}`}</p>
            }
          </div>
        )
      }
    }
  }

  status = (inv) => {
    return (
      <Fragment>
        {this.paymentStatus(inv)}
      </Fragment>
    )
  }


  stylePaymentStatus = (status) => {
    let style = styleStatus(status);
    style.padding = '5px 15px'
    return style;
  }

  total = (inv) => {
    return (
      <Fragment>
        <div>
          <h2>
            {numeral(inv.total).format('$0,0.00')}
          </h2>
        </div>
      </Fragment>
    )
  }

  view = () => {
    const { evt, match, user: { accessLevel } } = this.props
    const addNewPath = () => {
      if (match) {
        return {
          pathname: `/${accessLevel}/invoices/new`,
          state: { eventId: match.params.id }
        }
      }
    }

    if (evt) {
      if (evt.invoice) {
        const inv = evt.invoice
        return (
          <Fragment>
            <div className="Event-Invoice--summary">
              <div className="Event-Invoice--total">{this.total(inv)}</div>
              <Link to={`/${accessLevel}/invoices/${evt.invoice.id}`}>View Invoice</Link>
            </div>
            {inv.kind !== 'Proposal'? this.status(inv) : null}
          </Fragment>
        )
      } else {
        return(
          <div className="Event-Invoice--no-invoice">
            <p>There is no Invoice created for this Job.</p>
            <Link to={addNewPath()}>Create Invoice</Link>
          </div>
        )
      }
    } else {
      return null
    }
  }

  render(){
    const { styleComp, mobile } = this.props
    return (
      <div style={styleComp('Invoice')} className="EventDetail-Body--component EventDetail-Body--invoice">
        {!mobile? <div className="EventDetail-Body--component-title"><h4>Invoice</h4></div>: null}
          <div className="Event-Invoice--container">
          {mobile? <label>Invoice</label> : null}
            <div className="Event-Invoice">
              {this.view()}
            </div>
          </div>
      </div>
    )
  }
}
