import React, { Component } from 'react'
import InvoiceDetail from '../../../Invoices/InvoiceDetail'
import AddNew from '../../../../../Buttons/AddNew'
import './index.css'

export default class Invoice extends Component {
  render(){
    const { evt, match } = this.props

    const addNewPath = () => {
      if (match) {
        return {
          pathname: `/admin/invoices/new`,
          state: { eventId: match.params.id }
        }
      }
    }

    if (evt) {
      if (evt.invoice) {
        return (
          <InvoiceDetail inv={evt.invoice} evt={evt} />
        )
      } else {
        return  (
          <div className="Event--invoice">
            <div className="Event--no-invoice">
              <h2>There is no Invoice associated with this Event.</h2>
              <p>Add one below...</p>
              <AddNew linkPath={addNewPath()}/>
            </div>
          </div>
        )
      }
    }
  }
}
