import React from 'react'
import Schedule from './Schedule'
import Event from './Event'
import Invoice from './Invoice'
import Client from './Client'
import moment from 'moment'
import './ListItem.css'

export default function ListItem(props){
  const { item, type } = props
  switch (type) {
    case 'Schedule':
      return (
        <Schedule
          {...props}
          start={start()}
          end={end()}
          timeUntil={timeUntil()}
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

  function styleItem(item, type, numColumns){
    switch (type) {
      case 'Events':
      const event = item;
        if ( event && event.start && moment(event.start).isSameOrAfter(moment()) ) {
          return {
            gridTemplateColumns: `repeat(${numColumns}, 1fr)`
          }
        } else {
          return {
            color: 'rgba(0,0,0,.5)',
            backgroundColor: 'rgba(0,0,0,.5)',
            gridTemplateColumns: `repeat(${numColumns}, 1fr)`
          }
        }
      case 'Schedule':
        return {
          backgroundColor: '#eeeeee',
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
