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
    user: { accessLevel }
  }
  = props

  return (
    <Link to={`${accessLevel}/events/${item.id}`} style={{textDecoration: 'none', color: 'black'}}>
      <div className="List-Item" style={styleItem(item, view)}>

        <div style={displayColumn('time until')}>{item && timeUntil}</div>

        <div style={displayColumn('event')}>
          <h4>{item && item.summary}</h4>
          <p>{date(item)}</p>
          <p>{time(item)}</p>
        </div>

        <p style={displayColumn('notes')} className="List-Item--description">{item && item.notes}</p>

        <div style={displayColumn('confirmation')}>
          {status()}
        </div>

      </div>
    </Link>
  )

  function status(){

    const currentUser = item.staff.find( worker => {
      const employee = worker.info.contact.emailAddresses.find( e => e.emailAddress === user.email)
      if (employee) {
        return employee
      } else {
        return null
      }
    })

    if (currentUser) {
      return statusIcon(currentUser.confirmation, '2x')
    }
  }

}
