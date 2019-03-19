import React, { Component, Fragment } from 'react'
import moment from 'moment'
import { clientName } from '../../../../Helpers/clientHelpers'
import './Header.css'

export default class Header extends Component{

  clientAndDate = () => {
    const { invoice } = this.props
    if (invoice && invoice.event) {
      const { event } = invoice
      const { client } = event
      if (client) {
        return (
          <Fragment>
            <h2>{clientName(event.client, true)}</h2>
            <h2 style={{fontWeight: '400'}}>{moment(event.start).format('MMMM Do YYYY')}</h2>
          </Fragment>
        )
      } else {
        return moment(event.start).format('MMMM Do YYYY')
      }
    }
  }

  render(){
    return (
      <div className="Header">
        <div className="Header--name">{this.clientAndDate()}</div>
      </div>
    )
  }
}
