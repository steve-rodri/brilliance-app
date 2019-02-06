import React from 'react'
import { Link } from 'react-router-dom'
import { clientName } from '../Helpers/clientHelpers'
import { styleConfirmation } from '../Helpers/styleConfirmation'
import moment from 'moment'

export default function Event(props){
  const { item, type, start, end, numColumns, styleColumns, styleSummary } = props
  const event = item
  return (
    <Link to={`/admin/${type.toLowerCase()}/${event.id}`} style={{textDecoration: 'none', color: 'black'}}>
      <div className="List-Item" style={styleColumns(numColumns)}>
        <div>
          <h4 style={styleSummary(event && event.summary)}>{event && event.summary}</h4>
          <p>{event && event.start && moment(start).format('ddd, MMM Do')}</p>
          <p>{event && event.start && event.end && `${moment(start).format('LT')} - ${moment(end).format('LT')}`}</p>
        </div>
        <div>
          {event && clientName(event.client)}
        </div>
        <p>{event && event.placeLocation && event.placeLocation.name}</p>
        <p style={styleConfirmation(event && event.confirmation)}>{event && event.confirmation}</p>
      </div>
    </Link>
  )
}
