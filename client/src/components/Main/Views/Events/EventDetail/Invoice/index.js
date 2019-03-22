import React, { Component } from 'react'
import InvoiceDetail from '../../../Invoices/InvoiceDetail'

export default class Invoice extends Component {
  render(){
    const { evt } = this.props
    console.log(evt)
    if (evt) {
      if (evt.invoice) {
        return (
          <InvoiceDetail inv={evt.invoice} evt={evt} />
        )
      } else {
        return  (
          <div>
            <h1>There is no Invoice associated with this Event.</h1>
            <p>Add One below...</p>
            <button>Create Invoice</button>
          </div>
        )
      }
    }
  }
}
