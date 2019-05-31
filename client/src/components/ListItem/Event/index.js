import React from 'react'
import { Link } from 'react-router-dom'
import { clientName } from '../../../helpers/clientHelpers'
import { date, time } from '../../../helpers/datetime'
import { styleConfirmation, changeConfirmation } from '../../../helpers/eventHelpers'
import moment from 'moment'
import './index.css';

export default function Event(props){
  const {
    user: { accessLevel },
    item: event,
    view,
    handleStatusChange,
    displayColumn,
    numColumns,
    styleItem,
    styleCell,
    isMonth,
    changeScrollPosition,
  } = props
  const leftCell = styleCell('left', event)
  const middleCell = styleCell('middle', event)
  const rightCell = styleCell('right', event)
  const titleDisplay = displayColumn('title')
  const intelDisplay = displayColumn('intel')
  const scheduleDisplay = displayColumn('schedule')
  const confirmationDisplay = displayColumn('confirmation')

  if (event.isNextEvent) changeScrollPosition()
  return (
    <Link to={`/${accessLevel}/${view.toLowerCase()}/${event.id}`} style={{textDecoration: 'none', color: 'black'}}>
      {numColumns?
        <div className="List-Item" style={styleItem(event, view)}>

          {/* Title */}
          <div className="List-Item--Cell" style={{ ...leftCell, ...titleDisplay, padding: '5px' }}>
            <div className="Event--summary">{summary(event)}</div>
            <div className="Event--time">
              <p>{date(event, true)}</p>
              <p>{time(event)}</p>
            </div>
          </div>

          {/* Date */}
          {/* <div className="List-Item--Cell" style={{ ...middleCell, ...dateDisplay, padding: '5px' }}>
            <div className="Event--time">
              <p>{date(event, true)}</p>
              <p>{time(event)}</p>
            </div>
          </div> */}

          {/* Intel */}
          <div className="List-Item--Cell" style={{ ...middleCell, ...intelDisplay, padding: '5px' }}>
            {event && event.client && <div>{clientName(event.client)}</div>}
            {event && event.location && <p>{event.location.name}</p>}
          </div>

          {/* Schedule */}
          <div className="List-Item--Cell" style={{ ...middleCell, ...scheduleDisplay }}>
            {scheduled(event)}
          </div>

          {/* Confirmation */}
          <div className="List-Item--Cell" style={{ ...rightCell, ...confirmationDisplay }}>
            {
              event && event.start && moment(event.start).isSameOrAfter(moment(), 'days')?

              <div
                className="Event--confirmation"
                style={styleConfirmation(event.confirmation)}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleStatusChange(event, 'confirmation', changeConfirmation(event.confirmation))
                }}
              >
                <p>{event.confirmation.toUpperCase()}</p>
              </div>
              :
              null
            }
          </div>

        </div>
        :
        <div className="List-Item" style={styleItem(event, view)}>
          {event.isNextEvent && isMonth()? <div className="Event--next-event-triangle"></div> : null}
          <div
            className="Event--summary"
            style={styleMobileSummary(event)}
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


function scheduled(evt){
  if (evt && evt.start && moment(evt.start).isSameOrAfter(moment(), 'days')) {
    if (evt && evt.staff && evt.staff.length) {
      let needsAction = 0;
      let declined = 0;
      let tentative = 0;
      let accepted = 0;

      evt.staff.forEach(worker => {
        switch (worker.confirmation) {
          case 'needsAction':
            needsAction += 1
            break;
          case 'declined':
            declined += 1
            break;
          case 'tentative':
            tentative += 1
            break;
          case 'accepted':
            accepted += 1
            break;
          default:
            break;
        }
      })

      if (accepted === evt.staff.length) {
        return (
          <div className="Event--scheduled" style={{ color: 'limegreen'}}>
            <div className="Event--scheduled-details">
              <h4>ALL CONFIRMED</h4>
            </div>
          </div>
        )
      } else if (!accepted) {
        return (
          <div className="Event--scheduled" style={{ color: 'red' }}>
            <div className="Event--scheduled-details">
              <div style={{textAlign: 'left'}}>
                {tentative + needsAction? <p>{`${tentative + needsAction} unconfirmed`}</p> : null}
                {declined? <p>{`${declined} declined`}</p> : null}
              </div>
            </div>
          </div>
        )
      } else {
        return (
          <div className="Event--scheduled">
            <div className="Event--scheduled-details">
              <div style={{textAlign: 'left'}}>
                <p>{`${accepted} confirmed`}</p>
                {tentative + needsAction? <p>{`${tentative + needsAction} unconfirmed`}</p> : null}
                {declined? <p>{`${declined} declined`}</p> : null}
              </div>
            </div>
          </div>
        )
      }
    } else {
      return (
        <div className="Event--scheduled">
          <div className="Event--scheduled-details" style={{gridRow: '1 / span 2'}}>
            <p style={{ color: 'darkred' }}>-----</p>
          </div>
        </div>
      )
    }
  }
}
