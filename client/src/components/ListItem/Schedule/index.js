import React from 'react'
import { Link } from 'react-router-dom'
import { date, time } from '../../../helpers/datetime'
import { statusIcon } from '../../../helpers/icons'
import { styleWorkerStatus } from '../../../helpers/eventHelpers'
import './index.css'

export default function Schedule(props){
  const {
    user,
    mobile,
    item,
    view,
    timeUntil,
    displayColumn,
    styleItem,
    styleCell,
    // styleMobileEventSummary,
    eventSummary: summary,
    user: { accessLevel }
  }
  = props

  const leftCell = styleCell('left', item)
  const middleCell = styleCell('middle', item)
  const rightCell = styleCell('right', item)
  const timeUntilDisplay = displayColumn('time until')
  const eventDisplay = displayColumn('event')
  const notesDisplay = displayColumn('notes')
  const confirmationDisplay = displayColumn('confirmation')

  const currentUser = item.staff.find( worker => {
    const employee = worker.info.contact.emailAddresses.find( e => e.emailAddress === user.profile.email)
    if (employee) return employee
    return null
  })

  return (
    <Link to={`${accessLevel}/events/${item.id}`} style={{textDecoration: 'none', color: 'black'}}>
      <div className="List-Item" style={styleItem(item, view)}>

        {/* Time Until */}
        <div className="List-Item--Cell" style={{ ...timeUntilDisplay, ...leftCell }}>
          <p>{item && timeUntil}</p>
        </div>

        {/* Event */}
        <div className="List-Item--Cell" style={{ ...eventDisplay, ...leftCell }}>
          <div className="Event--summary">{summary()}</div>
          {mobile? <p>{item && timeUntil}</p> : null}
          <div className="Event--time">
            <p>{date(item, true, true)}</p>
            <p>{time(item)}</p>
          </div>
        </div>

        {/* Notes */}
        <div className="List-Item--Cell" style={{ ...notesDisplay, ...middleCell }}>
          <p className="Schedule--notes">{item && item.notes}</p>
        </div>

        {/* Confirmation */}
        <div className="List-Item--Cell" style={{ ...confirmationDisplay, ...rightCell }}>
          <div
            className="Schedule--confirmation"
            style={styleWorkerStatus(currentUser.confirmation)}
          >
            {statusIcon(currentUser.confirmation, '2x')}
          </div>
        </div>

      </div>
    </Link>
  )
}
