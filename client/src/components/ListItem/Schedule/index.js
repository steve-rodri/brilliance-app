import React from 'react'
import { Link } from 'react-router-dom'
import { date, time } from '../../../helpers/datetime'
import { statusIcon } from '../../../helpers/icons'
import './index.css'

export default function Schedule(props){
  const {
    user,
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

  return (
    <Link to={`${accessLevel}/events/${item.id}`} style={{textDecoration: 'none', color: 'black'}}>
      <div className="List-Item" style={styleItem(item, view)}>

        <div className="List-Item--Cell" style={{ ...timeUntilDisplay, ...leftCell }}>
          <p>{item && timeUntil}</p>
        </div>

        <div className="List-Item--Cell" style={{ ...eventDisplay, ...middleCell }}>
          <div className="Schedule--event-summary">{summary()}</div>
          <div className="Schedule--event-time">
            <p>{date(item)}</p>
            <p>{time(item)}</p>
          </div>
        </div>

        <div className="List-Item--Cell" style={{ ...notesDisplay, ...middleCell }}>
          <p className="Schedule--notes">{item && item.notes}</p>
        </div>

        <div className="List-Item--Cell" style={{ ...confirmationDisplay, ...rightCell }}>
          <div>{status()}</div>
        </div>

      </div>
    </Link>
  )

  function status(){

    const currentUser = item.staff.find( worker => {
      const employee = worker.info.contact.emailAddresses.find( e => e.emailAddress === user.email)
      if (employee) return employee
      return null
    })

    if (currentUser) return statusIcon(currentUser.confirmation, '2x')
  }
}
