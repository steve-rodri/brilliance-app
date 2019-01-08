import React from 'react'
import moment from 'moment'
import './ListItem.css'

export default function ListItem(props){
  const item = props.item
  const type = props.type

  switch (type) {
    case 'Schedule':
      return (
        <div className="List-Item">
          <p>{item && timeUntil()}</p>
          <div>
            <h6>{item && item.summary}</h6>
            <p>{item && moment(start()).format('dddd, MMMM Do')}</p>
            <p>{item && `${moment(start()).format('LT')} - ${moment(end()).format('LT')}`}</p>
          </div>
          <p className="List-Item--description">{item && item.description}</p>
        </div>
      )
    case 'Events':
      return (
        <div className="List-Item">
          <div>
            <h6>{item && item.summary}</h6>
            <p>{item && moment(start()).format('dddd, MMMM Do')}</p>
            <p>{item && `${moment(start()).format('LT')} - ${moment(end()).format('LT')}`}</p>
          </div>
          <p>{item && item.client_id}</p>
          <p>{item && item.location}</p>
          <p>{item && item.confirmation}</p>
          <p>Scheduled?</p>
        </div>
      )
    case 'Invoices':
      return (
        <div className="List-Item">

        </div>
      )
    case 'Clients':
      return (
        <div className="List-Item">

        </div>
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
}
