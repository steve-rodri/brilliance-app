import React from 'react'
import { Link } from 'react-router-dom'
import { clientName } from '../Helpers/clientHelpers'
import moment from 'moment'
import './Invoice.css'

export default function Invoice(props){
  const { item, type, displayColumn, numColumns, styleItem  } = props
  const invoice = item
  const event = invoice.event
  return (
    <Link to={`/admin/${type.toLowerCase()}/${item.id}`} style={{textDecoration: 'none', color: 'black'}}>
      {numColumns?
        <div className="List-Item" style={styleItem(item, type, numColumns)}>

          <div className="Invoice--title" style={displayColumn('client & date')}>
            <h4>{event && event.client && clientName(event.client)}</h4>
            <p>{event && event.start && moment(event.start).format('MMM Do YYYY')}</p>
          </div>

          <h4 style={displayColumn('type')}>{invoice.kind}</h4>


          <div className="Invoice--status" style={displayColumn('status')}>
            <h3>{invoice.paymentStatus}</h3>
            <h4>{invoice.paymentType !== 'Unknown'? invoice.paymentType : null}</h4>
          </div>

          <div className="Invoice--balance" style={displayColumn('balance')}>$0.00</div>
        </div>
        :
        <div className="List-Item">

          <div className="Invoice--title">
            <h4>{event && event.client && clientName(event.client)}</h4>
            <p>{event && event.start && moment(event.start).format('MMM Do YYYY')}</p>
          </div>

          <div className="Invoice--status">
            <div className="Invoice--balance">$0.00</div>
            <h3>{invoice.paymentStatus}</h3>
            <h4>{invoice.paymentType !== 'Unknown'? invoice.paymentType : null}</h4>
          </div>
          
        </div>
      }
    </Link>
  )
}
