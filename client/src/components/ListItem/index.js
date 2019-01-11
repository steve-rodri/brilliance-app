import React from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import './ListItem.css'

export default function ListItem(props){
  const { item, type, numColumns } = props
  switch (type) {
    case 'Schedule':
      return (
        <Link to={`/admin/${type.toLowerCase()}/${item.id}`} style={{textDecoration: 'none', color: 'black'}}>
          <div className="List-Item" style={styleColumns(numColumns)}>
            <p>{item && timeUntil()}</p>
            <div>
              <h6>{item && item.summary}</h6>
              <p>{item && moment(start()).format('dddd, MMMM Do')}</p>
              <p>{item && `${moment(start()).format('LT')} - ${moment(end()).format('LT')}`}</p>
            </div>
            <p className="List-Item--description">{item && item.description}</p>
          </div>
        </Link>
      )
    case 'Events':
    const event = item
      return (
        <Link to={`/admin/${type.toLowerCase()}/${event.id}`} style={{textDecoration: 'none', color: 'black'}}>
          <div className="List-Item" style={styleColumns(numColumns)}>
            <div>
              <h6>{event && event.summary}</h6>
              <p>{event && moment(start()).format('dddd, MMMM Do')}</p>
              <p>{event && `${moment(start()).format('LT')} - ${moment(end()).format('LT')}`}</p>
            </div>
            <p>{event && clientName(event)}</p>
            <p>{event && event.location}</p>
            <p>{event && event.confirmation}</p>
            <p>Scheduled?</p>
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
      const client = item.contactInfo
      return (
        <Link to={`/admin/${type.toLowerCase()}/${item.id}`} style={{textDecoration: 'none', color: 'black'}}>
          <div className="List-Item" style={styleColumns(numColumns)}>
            <h3>{client && client.fullName}</h3>
          </div>
        </Link>
      )
    default:
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

  function styleColumns(numColumns){
    return {
      gridTemplateColumns: `repeat(${numColumns}, 1fr)`
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

  function timeUntil(){
    return moment(start()).fromNow()
  }

  function clientName(event) {
    if (event.client) {
      if (event.client.contactInfo) {
        return event.client.contactInfo.fullName
      }
    }
  }
}
