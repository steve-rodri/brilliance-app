import React from 'react'
import Schedule from './Schedule/'
import Event from './Event/'
import Invoice from './Invoice/'
import Client from './Client/'
import Staff from './Staff/'
import moment from 'moment'
import { start, end, timeUntil } from '../../helpers/datetime'
import './index.css'

export default function ListItem(props){
  const { item, view, total, index, mobile } = props
  switch (view) {
    case 'Dashboard':
      return (
        <Schedule
          {...props}
          start={start()}
          end={end()}
          timeUntil={timeUntil(item)}
          styleItem={styleItem}
          styleCell={styleCell}
        />
      )
    case 'Events':
      return (
        <Event
          {...props}
          start={start()}
          end={end()}
          styleItem={styleItem}
          styleCell={styleCell}
          styleSummary={styleSummary}
        />
      )
    case 'Invoices':
      return (
        <Invoice
          {...props}
          styleItem={styleItem}
          styleCell={styleCell}
        />
      )
    case 'Clients':
      return (
        <Client
          {...props}
          styleItem={styleItem}
          styleCell={styleCell}
          styleSummary={styleSummary}
        />
      )
    case 'Workers':
      return (
        <Staff
          {...props}
          styleItem={styleItem}
          styleCell={styleCell}
        />
      )
    default:
  }

  function styleItem(item, view){
    const style = {}
    switch (view) {
      case 'Events':
        const event = item;
        // const past = event && event.end && moment(event.end).isBefore(moment())
        const hasInvoice = event && event.invoice
        const inProgress = event && event.start && event.end && moment(event.start).isSameOrBefore(moment()) && moment(event.end).isSameOrAfter(moment())
        const nextEvent = event && event.isNextEvent
        // const iCalUID = event && event.iCalUid;

        // if (past) {
        //   style.color = 'rgba(0,0,0,.5)'
        //   style.backgroundColor = '#999999'
        // }

        if (hasInvoice) {
          style.borderLeft = '10px solid limegreen'
        }

        if (inProgress) {
          style.color = '#eeeeee'
          style.backgroundColor = 'var(--light-blue)'
          style.border = 'none'
        }

        if (nextEvent) {
          style.borderTop = '2px solid red'
        }

        // if (iCalUID) {
        //   style.backgroundColor = 'blue'
        // }

        if (mobile) {
          style.padding = '5px'
        }
      break;

      default:

      break;
    }

    if (index + 1 === total) {
      style.borderBottom = 'none'
    }

    return style;
  }

  function styleCell(position, event){
    const past = event && event.end && moment(event.end).isBefore(moment())
    const style = {}
    if (past) {
      switch (position) {
        case 'left':
          // style.borderRight = '1px solid #999999'
        break;
        case 'middle':
          // style.borderRight = '1px solid #999999'
        break;
        case 'right':
        break;
        default:
        break;
      }
    } else {
      switch (position) {
        case 'left':
          style.borderRight = '1px solid var(--light-gray)'
        break;
        case 'middle':
          style.borderRight = '1px solid var(--light-gray)'
        break;
        case 'right':
        break;
        default:
        break;
      }
    }

    return style
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
}
