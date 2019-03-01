import React from 'react'
import { Link } from 'react-router-dom'
import { statusIcon } from '../Helpers/icons'
import moment from 'moment'

export default function Schedule(props){
  const {
    user,
    item,
    type,
    start,
    end,
    timeUntil,
    displayColumn,
    numColumns,
    styleItem,
    match
  }
  = props

  return (
    <Link to={`${match.path}/events/${item.id}`} style={{textDecoration: 'none', color: 'black'}}>
      <div className="List-Item" style={styleItem(item, type, numColumns)}>

        <div style={displayColumn('time until')}>{item && timeUntil}</div>

        <div style={displayColumn('event')}>
          <h4>{item && item.summary}</h4>
          <p>{item && item.start && moment(start).format('dddd, MMMM Do')}</p>
          <p>{item && item.start && item.end && `${moment(start).format('LT')} - ${moment(end).format('LT')}`}</p>
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
      return statusIcon(currentUser.confirmation)
    }
  }

}
