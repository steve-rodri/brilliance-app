import React from 'react'
import { Link } from 'react-router-dom'
import { clientName } from '../Helpers/clientHelpers'
import moment from 'moment'

export default function Invoice(props){
  const { item, type, displayColumn, numColumns, styleItem  } = props
  const invoice = item
  const event = invoice.event
  return (
    <Link to={`/admin/${type.toLowerCase()}/${item.id}`} style={{textDecoration: 'none', color: 'black'}}>
      <div className="List-Item" style={styleItem(item, type, numColumns)}>

        <div style={displayColumn('client & date')}>
          <h4>{event && event.client && clientName(event.client)}</h4>
          <p>{event && event.start && moment.utc(event.start).format('MMM Do YYYY')}</p>
        </div>

        <h4 style={displayColumn('type')}>{invoice.kind}</h4>

        <div style={displayColumn('status')} className="List-Item--status">
          <h3>{invoice.paymentStatus}</h3>
          <h4>{invoice.paymentType}</h4>
        </div>

      </div>
    </Link>
  )
}
