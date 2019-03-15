import React from 'react'
import Schedule from './Schedule'
import Event from './Event'
import Invoice from './Invoice'
import Client from './Client'
import moment from 'moment'
import { start, end, timeUntil } from '../Helpers/datetime'
import './index.css'

export default function ListItem(props){
  const { item, type } = props
  switch (type) {
    case 'Schedule':
      return (
        <Schedule
          {...props}
          start={start()}
          end={end()}
          timeUntil={timeUntil(item)}
          styleItem={styleItem}
        />
      )
    case 'Events':
      return (
        <Event
          {...props}
          start={start()}
          end={end()}
          styleItem={styleItem}
          styleSummary={styleSummary}
        />
      )
    case 'Invoices':
      return (
        <Invoice
          {...props}
          styleItem={styleItem}
        />
      )
    case 'Clients':
      return (
        <Client
          {...props}
          styleItem={styleItem}
          styleSummary={styleSummary}
        />
      )
    default:
  }

  function styleItem(item, type, numColumns){
    switch (type) {
      case 'Events':
        const event = item;
        const past = event && event.end && moment(event.end).isBefore(moment())
        const inProgress = event && event.start && event.end && moment(event.start).isSameOrBefore(moment()) && moment(event.end).isSameOrAfter(moment())
        // const iCalUID = event && event.iCalUid;
        let style = {};

        if (numColumns) {
          style.gridTemplateColumns =  `repeat(${numColumns}, 1fr)`
        }

        if (past) {
          style.color = 'rgba(0,0,0,.5)'
          style.backgroundColor = '#999999'
        }

        if (inProgress) {
          style.color = '#eeeeee'
          style.backgroundColor = 'var(--med-dark-blue)'
          style.border = 'none'
        }

        // if (iCalUID) {
        //   style.backgroundColor = 'blue'
        // }

        return style

      case 'Schedule':
        return {
          gridTemplateColumns: `repeat(${numColumns}, 1fr)`
        }
      default:
      return {
        gridTemplateColumns: `repeat(${numColumns}, 1fr)`
      }
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

}
