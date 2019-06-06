import React from 'react'
import { Link } from 'react-router-dom'
import { date, time } from '../../../helpers/datetime'
import { statusIcon } from '../../../helpers/icons'
import { styleWorkerStatus } from '../../../helpers/eventHelpers'
import './index.css'

export default function Schedule(props){
  const {
    user,
    item,
    view,
    displayColumn,
    styleItem,
    styleCell,
    // styleMobileEventSummary,
    eventSummary: summary,
    user: { accessLevel },

    changeConfirmation
  }
  = props

  const leftCell = styleCell('left', item)
  const rightCell = styleCell('right', item)
  const eventDisplay = displayColumn('event')
  const confirmationDisplay = displayColumn('confirmation')

  const currentUser = item.staff.find( worker => {
    const email = worker.info.contact.emailAddresses.find( e => e.emailAddress === user.profile.email)
    if (email) return worker
    return null
  })

  return (
    <div className="List-Item" style={styleItem(item, view)}>

      {/* Event */}
      <div className="List-Item--Cell" style={{ ...eventDisplay, ...leftCell }}>
        <Link
          to={`${accessLevel}/events/${item.id}`}
          style={{textDecoration: 'none', color: 'black'}}
          className="Schedule--event"
        >
          <div>
            <div className="Schedule--event-summary">{summary()}</div>
            {/* <div className="Schedule--event-time-until">
              <p>{item && timeUntil}</p>
            </div> */}
            <div className="Schedule--event-time">
              <p>{date(item, true, true)}</p>
              <p>{time(item)}</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Confirmation */}
      <div className="List-Item--Cell" style={{ ...confirmationDisplay, ...rightCell }}>
        <div
          className="Schedule--confirmation"
          style={styleWorkerStatus(currentUser.confirmation)}
          onClick={(e) => {
            e.stopPropagation();
            changeConfirmation(item.id, currentUser.id)
          }}
        >
          {statusIcon(currentUser.confirmation, '2x')}
        </div>
      </div>

    </div>
  )
}
