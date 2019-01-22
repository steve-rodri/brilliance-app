import React from 'react'
import Schedule from './Schedule'
import Client from './Client'
import { Link } from 'react-router-dom'
import moment from 'moment'
import './ListItem.css'


export default function ListItem(props){
  const { item, type, numColumns } = props
  switch (type) {
    case 'Schedule':
      return (
        <Schedule
          {...props}
          start={start()}
          end={end()}
          timeUntil={timeUntil()}
        />
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

  function start() {
    if (item) {
      if (item.start) {
        if (item.start.date) {
          return item.start.date
        } else if (item.start.dateTime) {
          return item.start.dateTime
        } else {
          return item.start
        }
      }
    }
  }

  function end() {
    if (item) {
      if (item.end) {
        if (item.end.date) {
          return item.end.date
        } else if (item.end.dateTime) {
          return item.end.dateTime
        } else {
          return item.end
        }
      }
    }
  }

  function timeUntil(){
    return moment.utc(start()).fromNow()
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
}
