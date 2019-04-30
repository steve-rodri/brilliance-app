import React from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import './index.css'

export default function Client(props) {
  const { item, type, numColumns, displayColumn } = props
  const client = item.contactInfo
  const company = item.company

  return (
    <Link to={{pathname: `/admin/${type.toLowerCase()}/${item.id}`, state: { modal: true } }} style={{textDecoration: 'none', color: 'black'}}>
      {
        numColumns?
        <div className="List-Item">

          <div className="Client--name" style={displayColumn('name / company')}>
            <h3>{client && client.fullName}</h3>
            <h4>{company && company.name}</h4>
            {client && <p>{client.phoneNumber && `${client.phoneNumber}`}</p>}
            {client && client.emailAddresses && client.emailAddresses.length > 0 && <a href={`mailto:${client.emailAddresses[0].address}`}>{client.emailAddresses[0].address}</a>}
          </div>

          <div className="Client--event" style={displayColumn('next event')}>
            {latestEvent(client)}
          </div>

          <div className="Client--balance" style={displayColumn('balance')}>$0.00</div>

        </div>
        :
        <div className="List-Item">

          <div className="Client--name">
            <h3>{client && client.fullName}</h3>
            <h4>{company && company.name}</h4>
            {client && <p>{client.phoneNumber && `${client.phoneNumber}`}</p>}
            {client && client.emailAddresses && client.emailAddresses.length > 0 && <a href={`mailto:${client.emailAddresses[0].address}`}>{client.emailAddresses[0].address}</a>}
          </div>

          <div className="Client--balance">$0.00</div>

        </div>
      }
    </Link>
  )

  function latestEvent(){
    if (item) {
      if (item.events) {
        item.events.sort(event => event.start)
        const event = item.events[0]
        if (event) {
          if (moment(event.start).isSameOrAfter(moment(), 'days')) {
            return (
              <div>
                <h3>UPCOMING EVENT</h3>
                {/* <h4 style={styleSummary(event && event.summary)}>{event && event.summary}</h4> */}
                <p>{event && event.start && moment(event.start).format('ddd, MMM Do')}</p>
                <p>{event && event.start && event.end && `${moment(event.start).format('LT')} - ${moment(event.end).format('LT')}`}</p>
              </div>
            )
          }
        }
      }
    }
  }
}
