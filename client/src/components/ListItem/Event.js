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

          <div className="List-Item--Cell" style={displayColumn('title')}>
            <div>
              <h4 style={styleSummary(event && event.summary)}>{event && event.summary}</h4>
              <p>{date(event, true)}</p>
              <p>{time(event)}</p>
            </div>
          </div>

          <div className="List-Item--Cell" style={displayColumn('client')}>
            {event && clientName(event.client)}
          </div>

          <div className="List-Item--Cell" style={displayColumn('location')}>{event && event.location && event.location.name}</div>

          <div className="List-Item--Cell" style={displayColumn('staff')}>
            {scheduled(event)}
          </div>

          <div className="List-Item--Cell" style={displayColumn('confirmation')}>
            {
              event && event.start && moment(event.start).isSameOrAfter(moment(), 'days')?

              <div
                className="Event--confirmation"
                style={styleConfirmation(event && event.confirmation)}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleStatusChange(item, 'confirmation', changeConfirmation(event && event.confirmation))
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
          <div className="Event--scheduled" style={{ backgroundColor: 'limegreen', color: 'white'}}>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', borderBottom: '1px solid white', width: '100%', height: '100%'}}>
              <p>{`${evt.staff.length} scheduled`}</p>
            </div>
            <div className="Event--scheduled-details">
              <h4>ALL CONFIRMED</h4>
            </div>
          </div>
        )
      } else if (!accepted) {
        return (
          <div className="Event--scheduled" style={{ backgroundColor: 'red', color: 'white' }}>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', borderBottom: '1px solid white', width: '100%', height: '100%'}}>
              <p>{`${evt.staff.length} scheduled`}</p>
            </div>
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
          <div className="Event--scheduled" style={{ backgroundColor: 'gold', color: 'black' }}>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', borderBottom: '1px solid black', width: '100%', height: '100%'}}>
              <p>{`${evt.staff.length} scheduled`}</p>
            </div>
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
        <div className="Event--scheduled" style={{ border: '2px dashed darkred' }}>
          <div className="Event--scheduled-details" style={{gridRow: '1 / span 2'}}>
            <p style={{ color: 'darkred' }}>NONE</p>
          </div>
        </div>
      )
    }
  }
}
