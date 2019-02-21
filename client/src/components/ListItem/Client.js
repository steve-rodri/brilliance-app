import React from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'

export default function Client(props) {
  const { item, type, numColumns, displayColumn, styleColumns, styleSummary } = props
  const client = item.contactInfo
  const company = item.company

  return (
    <Link to={{pathname: `/admin/${type.toLowerCase()}/${item.id}`, state: { modal: true } }} style={{textDecoration: 'none', color: 'black'}}>
      <div className="List-Item" style={styleColumns(numColumns)}>

        <div style={displayColumn('name / company')}>
          <h3>{client && client.fullName}</h3>
          <h4>{company && company.name}</h4>
        </div>

        <div style={displayColumn('contact info')} className="List-Item--contact-info">
          {client && <p>{client.phoneNumber && `${client.phoneNumber}`}</p>}
          {client && client.emailAddresses && client.emailAddresses.length > 0 && <a href={`mailto:${client.emailAddresses[0].address}`}>{client.emailAddresses[0].address}</a>}
          {company && <p>{company.phoneNumber && `${company.phoneNumber}`}</p>}
          {company && company.website && <a href={`${company.website}`} onClick={(e) => e.stopPropagation()}>{company.website}</a>}
        </div>

        <div style={displayColumn('next event')} className="List-Item--next-event">
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
            <p>{event && event.start && moment(event.start).format('ddd, MMM Do')}</p>
            <p>{event && event.start && event.end && `${moment(event.start).format('LT')} - ${moment(event.end).format('LT')}`}</p>
          </div>
        )
      }
    }
  }
}
