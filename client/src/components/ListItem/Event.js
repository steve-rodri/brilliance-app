import React from 'react'
import { Link } from 'react-router-dom'
import { clientName } from '../Helpers/clientHelpers'
import { date, time } from '../Helpers/datetime'
import { styleConfirmation, changeConfirmation } from '../Helpers/eventConfirmation'
import moment from 'moment'
import './Event.css';

export default function Event(props){
  const {
    item,
    type,
    start,
    end,
    handleStatusChange,
    displayColumn,
    numColumns,
    styleItem,
    styleSummary } = props

  const event = item

  return (
    <Link to={`/admin/${type.toLowerCase()}/${event.id}`} style={{textDecoration: 'none', color: 'black'}}>
      {numColumns?
        <div className="List-Item" style={styleItem(item, type, numColumns)}>

          <div style={displayColumn('title')}>
            <h4 style={styleSummary(event && event.summary)}>{event && event.summary}</h4>
            <p>{event && event.start && moment(start).format('ddd, MMM Do')}</p>
            <p>{event && event.start && event.end && `${moment(start).format('LT')} - ${moment(end).format('LT')}`}</p>
          </div>

          <div style={displayColumn('client')}>
            {event && clientName(event.client)}
          </div>

          <div style={displayColumn('location')}>{event && event.placeLocation && event.placeLocation.name}</div>

          <div style={displayColumn('scheduled')}></div>

          <div className="List-Item--Cell" style={displayColumn('confirmation')}>
            {
              event && event.start && moment(event.start).isSameOrAfter(moment(), 'days')?
              <div
                className="Event--confirmation"
                style={styleConfirmation(event && event.confirmation)}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleStatusChange(item.id, 'confirmation', changeConfirmation(event && event.confirmation))
                }}
              >
                <p>{event && event.confirmation.toUpperCase()}</p>
              </div>
              :
              null
            }
          </div>

        </div>
        :
        <div className="List-Item">
          <div className="Event--summary" style={styleMobileSummary(event)}
          >
            {summary(event)}
          </div>
          <div className="Event--time">
            <p>{date(event, true)}</p>
            <p>{time(event)}</p>
          </div>
        </div>
      }
    </Link>
  )
}

function styleMobileSummary(event) {
  if (event && event.summary && event.summary.length > 30) {
    return { fontSize: '15px'}
  } else {
    return {}
  }
}

function summary(event){
  if (event && event.summary) {

    let summary = event.summary;
    let slashWords = [];
    let hyphenWords = [];

    if (summary.search('/')) {
      slashWords = summary.split('/')
    }

    if (summary.search('-')) {
      hyphenWords = summary.split('-')
    }

    const words = slashWords.length > 1? slashWords : hyphenWords
    if (words.length > 1) {
      summary = words.join(' ')
      return <h4>{summary}</h4>
    } else {
      return <h4>{summary}</h4>
    }
  }
}
