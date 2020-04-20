import React from 'react'
import { Link } from 'react-router-dom'
import { clientDisplay } from '../../../helpers/clientHelpers'
import { styleStatus } from '../../../helpers/invoiceStatus'
import { locationName } from '../../../helpers/locationName'
import moment from 'moment'
import numeral from 'numeral'
import './index.css'

export default function Invoice(props){
  const {
    user: { accessLevel },
    item,
    view,
    displayColumn,
    numColumns,
    styleItem,
    
  } = props
  const invoice = item;
  const { event } = invoice

  const leftCell = ('left')
  const middleCell = ('middle')
  const rightCell = ('right')
  const clientDateDisplay = displayColumn('clientDate')
  const typeDisplay = displayColumn('type')
  const balanceDisplay = displayColumn('balance')
  const statusDisplay = displayColumn('status')

  return (
    <Link to={`/${accessLevel}/${view.toLowerCase()}/${item.id}`} style={{textDecoration: 'none', color: 'black'}}>
      {numColumns?
        <div className="List-Item" style={styleItem(item, view, numColumns)}>

          {/* client & date */}
          <div className="List-Item--Cell" style={{ ...leftCell, ...clientDateDisplay }}>
              <div className="Invoice--client-date">{event && event.client && clientDisplay(event.client)}</div>
              <p>{event && event.start && moment(event.start).format('MMM Do YYYY')}</p>
          </div>

          {/* Type */}
          <div className="List-Item--Cell" style={{ ...middleCell, ...typeDisplay }}>
            <h4>{invoice.kind}</h4>
            {invoice.kind === 'On Premise Contract'? <h4>{locationName(event.location)}</h4> : null}
          </div>

          {/* Balance */}
          <div className="List-Item--Cell" style={{ ...middleCell, ...balanceDisplay }}>
            <div className="Invoice--balance">
              {numeral(invoice.balance).format('$0,0.00')}
            </div>
          </div>

          {/* Status */}
          <div className="List-Item--Cell" style={{ ...rightCell, ...statusDisplay }}>
            <div className="Invoice--status" style={styleStatus(invoice.paymentStatus, invoice.kind)}>
              <h3>{invoice.paymentStatus}</h3>
            </div>
          </div>

        </div>

        :

        <div className="List-Item">

          <div className="Invoice--title">
            {event && event.client && clientDisplay(event.client)}
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
