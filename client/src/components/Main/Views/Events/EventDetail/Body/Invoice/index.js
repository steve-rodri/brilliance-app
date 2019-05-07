import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './index.css'

export default class Invoice extends Component {
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
        return (
          <Link to={`/${accessLevel}/invoices/${evt.invoice.id}`}>View Invoice</Link>
        )
      } else {
        return(
          <div className="Event-Invoice--no-invoice">
            <p>There is no Invoice associated with this Event.</p>
            <p>Add one below...</p>
            <Link to={addNewPath()}>Create Invoice</Link>
          </div>
        )
      }
    } else {
      return null
    }
  }

  render(){
    return (
      <div className="EventDetail-Body--component EventDetail-Body--invoice">
        <div className="EventDetail-Body--component-title"><h3>Invoice</h3></div>
          <div className="Event-Invoice--container">
            <div className="Event-Invoice">
              {this.view()}
            </div>
          </div>
      </div>
    )
  }
}
