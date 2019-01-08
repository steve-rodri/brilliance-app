import React from 'react'
import moment from 'moment'
import './ListItem.css'

export default function ListItem(props){
  const item = props.item

  function start() {
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
}

// action:null
// attendees: Array(2)
// 0: {email: "steve@brilliancepro.com", organizer: true, self: true, responseStatus: "accepted"}
// 1: {email: "steve@brilliancepro.com", responseStatus: "needsAction"}
// break:null
// break_start:null
// call_time:"2012-09-06T00:00:00.000Z"
// client_id:37
// clock_out:null
// summary: "Test"
// description: "Test "
// notes: null
// confirmation:"Confirmed"
// created_at: "2019-01-08T15:03:03.024Z"
// driving_time: null
// end: "2012-09-06T00:00:00.000Z"
// end: {dateTime: "2019-01-16T16:30:00-05:00"}
// id: 1
// gc_id: "3sq4uk9tno7qqgcb5fqoal6vp5"
// kind: "Bar Mitzvah"
// staff_status: null
// start: "2012-09-06T00:00:00.000Z"
// start: {dateTime: "2019-01-16T13:30:00-05:00"}
// tags: "Package #4,Custom Monogram"
// location: "948 Mirabelle Ave, Westbury, NY 11590, USA"
// creator: {email: "steve@brilliancepro.com"}
// updated_at: "2019-01-08T15:03:03.024Z"
// htmlLink: "https://www.google.com/calendar/event?eid=M3NxNHVrOXRubzdxcWdjYjVmcW9hbDZ2cDUgYm9iQGJyaWxsaWFuY2Vwcm8uY29t"
// created: "2019-01-08T02:44:48.000Z"
// updated: "2019-01-08T02:44:48.255Z"
