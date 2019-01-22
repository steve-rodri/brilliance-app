import React from 'react'
import Client from './Client'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCircle, faCheckCircle, faTimesCircle, faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'
import './ListItem.css'

library.add(faCircle)
library.add(faCheckCircle)
library.add(faTimesCircle)
library.add(faQuestionCircle)

export default function ListItem(props){
  const { item, type, numColumns } = props
  switch (type) {
    case 'Schedule':
      return (
        <a href={item.htmlLink} target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none', color: 'black', backgroundColor: 'white'}}>
          <div className="List-Item" style={styleColumns(numColumns)}>
            <p>{item && timeUntil()}</p>
            <div>
              <h4>{item && item.summary}</h4>
              <p>{item && item.start && moment.utc(start()).format('dddd, MMMM Do')}</p>
              <p>{item && item.start && item.end && `${moment.utc(start()).format('LT')} - ${moment.utc(end()).format('LT')}`}</p>
            </div>
            <p className="List-Item--description">{item && item.description}</p>
            <p>{status(props)}</p>
          </div>
        </a>
      )
    case 'Events':
    const event = item
      return (
        <Link to={`/admin/${type.toLowerCase()}/${event.id}`} style={{textDecoration: 'none', color: 'black'}}>
          <div className="List-Item" style={styleColumns(numColumns)}>
            <div>
              <h4 style={styleSummary(event && event.summary)}>{event && event.summary}</h4>
              <p>{event && event.start && moment.utc(start()).format('ddd, MMM Do')}</p>
              <p>{event && event.start && event.end && `${moment.utc(start()).format('LT')} - ${moment.utc(end()).format('LT')}`}</p>
            </div>
            <div>
              <p>{event && clientName(event)}</p>
              <h5>{event && companyName(event)}</h5>
            </div>
            <p>{event && event.placeLocation && event.placeLocation.name}</p>
            <p style={styleConfirmation(event && event.confirmation)}>{event && event.confirmation}</p>
          </div>
        </Link>
      )
    case 'Invoices':
    const invoice = item
      return (
        <Link to={`/admin/${type.toLowerCase()}/${item.id}`} style={{textDecoration: 'none', color: 'black'}}>
          <div className="List-Item" style={styleColumns(numColumns)}>
            <div></div>
            <h4>{invoice.kind}</h4>
            <div className="List-Item--status">
              <h3>{invoice.payment_status}</h3>
              <h4>{invoice.payment_type}</h4>
            </div>
          </div>
        </Link>
      )
    case 'Clients':
      return (
        <Client {...props} styleColumns={styleColumns}/>
      )
    default:
  }

  function status(props){
    const { user, item } = props
    const currentUser = item.attendees.find( attendee => attendee.email === user.email)
    switch (currentUser.responseStatus) {
      case 'needsAction':
        return <FontAwesomeIcon icon="circle" size="3x"/>
      case 'accepted':
        return <FontAwesomeIcon color="green" icon="check-circle" size="3x"/>
      case 'tentative':
        return <FontAwesomeIcon color="gold" icon="question-circle" size="3x"/>
      case 'declined':
        return <FontAwesomeIcon color="red" icon="times-circle" size="3x"/>
      default:
    }
  }

  function styleColumns(numColumns){
    return {
      gridTemplateColumns: `repeat(${numColumns}, 1fr)`
    }
  }

  function styleSummary(summary) {
    if (summary) {
      if (summary.length > 30) {
        return {
          fontSize: '12px'
        }
      } else {
        return {}
      }
    } else {
      return {}
    }
  }

  function checkStartType() {
    if (item) {
      if (item.start) {
        if (item.start.date) {
          return item.start.date
        } else if (item.start.dateTime) {
          return item.start.dateTime
        }
      }
    }
  }

  function checkEndType() {
    if (item) {
      if (item.end) {
        if (item.end.date) {
          return item.end.date
        } else if (item.end.dateTime) {
          return item.end.dateTime
        }
      }
    }
  }

  function start(){
    if (!checkStartType()) {
      return item.start
    } else {
      return checkStartType()
    }
  }

  function end() {
    if (!checkEndType()) {
      return item.end
    } else {
      return checkEndType()
    }
  }

  function timeUntil(){
    return moment.utc(start()).fromNow()
  }

  function clientName(event) {
    if (event.client) {
      if (event.client.contactInfo) {
        return event.client.contactInfo.fullName
      }
    }
  }

  function companyName(event) {
    if (event.client) {
      if (event.client.company) {
        return event.client.company.name
      }
    }
  }

  function styleConfirmation(msg){
    switch (msg) {
      case "Unconfirmed":
        return {
          backgroundColor: 'gold',
          borderRadius: '10px',
          padding: '5px',
          width: '70%'
        }
      case "Confirmed":
        return {
          backgroundColor: 'limegreen',
          fontWeight: 'bold',
          padding: '5px',
          color: 'white',
          borderRadius: '10px',
          width: '70%'
        }
      default:
        return {}
    }
  }
}
