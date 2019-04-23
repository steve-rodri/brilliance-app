import React from 'react'
import { Link } from 'react-router-dom'
import { clientName } from '../../../helpers/clientHelpers'
import { styleStatus } from '../../../helpers/invoiceStatus'
import moment from 'moment'
import numeral from 'numeral'
import './index.css'

export default function Invoice(props){
  const { item, type, displayColumn, numColumns, styleItem  } = props
  const invoice = item;
  const { event } = invoice
  return (
    <Link to={`/admin/${type.toLowerCase()}/${item.id}`} style={{textDecoration: 'none', color: 'black'}}>
      {numColumns?
        <div className="List-Item" style={styleItem(item, type, numColumns)}>

          <div className="List-Item--Cell" style={displayColumn('client & date')}>
            <div className="Invoice--title">
              <h4>{event && event.client && clientName(event.client)}</h4>
              <p>{event && event.start && moment(event.start).format('MMM Do YYYY')}</p>
            </div>
          </div>

          <div className="List-Item--Cell" style={displayColumn('type')}>
            <h4>{invoice.kind}</h4>
          </div>


          <div className="List-Item--Cell" style={displayColumn('status')}>
            <div className="Invoice--status" style={styleStatus(invoice.paymentStatus, invoice.kind)}>
              <h3>{invoice.paymentStatus}</h3>
            </div>
          </div>

          <div className="List-Item--Cell" style={displayColumn('balance')}>
            <div className="Invoice--balance">
              {numeral(invoice.balance).format('$0,0.00')}
            </div>
          </div>

        </div>
        :
        <div className="List-Item">

          <div className="Invoice--title">
            <h4>{event && event.client && clientName(event.client)}</h4>
            <p>{event && event.start && moment(event.start).format('MMM Do YYYY')}</p>
          </div>

          <div className="Invoice--status">
            <div className="Invoice--balance">{numeral(invoice.balance).format('$0,0.00')}</div>
            <h3>{invoice.kind !== 'Proposal'? invoice.paymentStatus : null}</h3>
            <h4>{invoice.paymentType !== 'Unknown'? invoice.paymentType : null}</h4>
          </div>

        </div>
      }
    </Link>
  )

}
