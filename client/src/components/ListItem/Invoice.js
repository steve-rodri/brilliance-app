import React from 'react'
import { Link } from 'react-router-dom'
import { clientName } from '../Helpers/clientName'
import moment from 'moment'

export default function Invoice(props){
  const { item, type, numColumns, styleColumns  } = props
  const invoice = item
  const event = invoice.event
  const client = invoice.event.client
  return (
    <Link to={`/admin/${type.toLowerCase()}/${item.id}`} style={{textDecoration: 'none', color: 'black'}}>
      <div className="List-Item" style={styleColumns(numColumns)}>
        <div>
          <h4>{clientName(client)}</h4>
          <p>{event && event.start && moment.utc(event.start).format('MMM Do YYYY')}</p>
        </div>
        <h4>{invoice.kind}</h4>
        <div className="List-Item--status">
          <h3>{invoice.paymentStatus}</h3>
          <h4>{invoice.paymentType}</h4>
        </div>
      </div>
    </Link>
  )
}
