import React from 'react'
import { Link } from 'react-router-dom'

export default function Client(props) {
  const { item, type, styleColumns, numColumns } = props
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
          {<p>{latestEvent(client)}</p>}
        </div>
      </div>
    </Link>
  )

  function latestEvent(client){
    if (client) {
      console.log(client)
      if (client.events) {
        client.events.sort(event => event.start)
        return client.events[0].summary
      }
    }
  }
}
