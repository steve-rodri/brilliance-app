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
        if (numColumns) {
          if (
            event &&
            event.start &&
            event.end &&
            moment(event.start).isSameOrBefore(moment()) &&
            moment(event.end).isSameOrAfter(moment())
          ) {
            return {
              color: '#eeeeee',
              backgroundColor: 'var(--med-dark-blue)',
              gridTemplateColumns: `repeat(${numColumns}, 1fr)`,
              border: 'none'
            }
          }
          if ( event && event.end && moment(event.end).isSameOrAfter(moment()) ) {
            return {
              gridTemplateColumns: `repeat(${numColumns}, 1fr)`
            }
          } else {
            return {
              color: 'rgba(0,0,0,.5)',
              backgroundColor: '#999999',
              gridTemplateColumns: `repeat(${numColumns}, 1fr)`
            }
          }
        } else {
          if ( event && event.start && moment(event.end).isSameOrAfter(moment()) ) {
            return {}
          } else {
            return {
              color: 'rgba(0,0,0,.5)',
              backgroundColor: '#999999',
            }
          }
        }
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
