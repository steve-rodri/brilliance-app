import React from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'

export default function Client(props) {
  const { item, type, numColumns, styleColumns, styleSummary } = props
  const client = item.contactInfo
  const company = item.company

  return (
    <Link to={`/admin/${type.toLowerCase()}/${item.id}`} style={{textDecoration: 'none', color: 'black'}}>
      <div className="List-Item" style={styleColumns(numColumns)}>
        <div>
          <h3>{client && client.fullName}</h3>
          <h4>{company && company.name}</h4>
        </div>
        <div className="List-Item--contact-info">
          {client && <p>{client.phoneNumber && `${client.phoneNumber}`}</p>}
          {client && client.emailAddresses.length > 0 && <a href={`mailto:${client.emailAddresses[0].address}`}>{client.emailAddresses[0].address}</a>}
          {company && <p>{company.phoneNumber && `${company.phoneNumber}`}</p>}
          {company && company.website && <a href={`${company.website}`} onClick={(e) => e.stopPropagation()}>{company.website}</a>}
        </div>
        <div className="List-Item--next-event">
          {latestEvent(client)}
        </div>
      </div>
    </Link>
  )

  function latestEvent(){
    if (item) {
      if (item.events) {
        item.events.sort(event => event.start)
        const event = item.events[0]
        return (
          <div>
            <h4 style={styleSummary(event && event.summary)}>{event && event.summary}</h4>
            <p>{event && event.start && moment.utc(event.start).format('ddd, MMM Do')}</p>
            <p>{event && event.start && event.end && `${moment.utc(event.start).format('LT')} - ${moment.utc(event.end).format('LT')}`}</p>
          </div>
        )
      }
    }
  }
}
