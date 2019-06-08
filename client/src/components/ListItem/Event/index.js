import React from 'react'
import { Link } from 'react-router-dom'
import { clientDisplay } from '../../../helpers/clientHelpers'
import { date, time } from '../../../helpers/datetime'
import { styleConfirmation, changeConfirmation, styleWorkerStatus } from '../../../helpers/eventHelpers'
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
    changeScrollPosition,
  } = props
  const leftCell = styleCell('left', event)
  const middleCell = styleCell('middle', event)
  const rightCell = styleCell('right', event)
  const titleDisplay = displayColumn('job')
  const intelDisplay = displayColumn('intel')
  const scheduleDisplay = displayColumn('staff')
  const confirmationDisplay = displayColumn('status')

  const hasInvoiceStyling = () => {
    let style = {};
    if (event && event.invoice) {
      style.borderLeft = '10px solid limegreen'
      style.paddingLeft = '10px'
    }
    return style;
  }

  if (event.isNextEvent) changeScrollPosition()
  return (
    <Link to={`/${accessLevel}/${view.toLowerCase()}/${event.id}`} style={{textDecoration: 'none', color: 'black'}}>
      {numColumns?
        <div className="List-Item" style={styleItem(event, view)}>

          {/* Title */}
          <div className="List-Item--Cell Event--title" style={{ ...leftCell, ...titleDisplay, ...hasInvoiceStyling() }}>
            <div className="Event--summary">{summary(event)}</div>
            <div className="Event--time">
              <p>{date(event, true, true)}</p>
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
            {event && event.client && clientDisplay(event.client)}
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
          {/* {event.isNextEvent && isMonth()? <div className="Event--next-event-triangle"></div> : null} */}
          {/* Title */}
          <div className="List-Item--Cell Event--title" style={hasInvoiceStyling()}>
            <div className="Event--summary" style={styleMobileSummary(event)}>{summary(event)}</div>
            <div className="Event--time">
              <p>{date(event, true, true)}</p>
              <p>{time(event)}</p>
            </div>
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
  // if (evt && evt.start && moment(evt.start).isSameOrAfter(moment(), 'days')) {
    if (evt && evt.staff && evt.staff.length) {
      return (
        <div className="Event--scheduled">
          <div className="Event--scheduled-workers">
          {
            evt.staff.map( worker => {
              const initials = () => {
                const { fullName } = worker.info.contact
                let words = fullName.split(' ');
                let letters  =  words.map(word => word.charAt(0).toUpperCase())
                return letters.join('')
              }
              return (
                <div key={worker.id} className="Event--scheduled-worker" style={styleWorkerStatus(worker.confirmation)}>
                  <p>{initials()}</p>
                </div>
              )
            })
          }
          </div>
        </div>
      )
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
