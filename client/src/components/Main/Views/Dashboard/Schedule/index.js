import React, { Component, Fragment } from 'react'
import { Redirect } from 'react-router-dom'
import List from '../../../../List/index.js'
import { GOOGLE } from '../../../../../services/google_service'
import moment from 'moment'
import './Schedule.css'

export default class Schedule extends Component {
  constructor(props){
    super(props)
    this.state = {
      userEvents: null,
      redirectToLogin: false
    }
  }

  updateColumnHeaders = (e) => {
    const width = window.innerWidth
    if (width < 500) {
      this.setState({
        columnHeaders: ['event', 'confirmation']
      })
    } else if (width < 700) {
      this.setState({
        columnHeaders: ['time until', 'event', 'confirmation']
      })
    } else {
      this.setState({
        columnHeaders: ['time until', 'event', 'notes', 'confirmation']
      })
    }
  }

  async componentDidMount(){
    this.updateColumnHeaders();
    window.addEventListener("resize", this.updateColumnHeaders);
    await this.findUpcomingUserEvents()
  }

  async componentWillUnmount(){
    window.removeEventListener("resize", this.updateColumnHeaders);
    this.setState({ userEvents: null })
  }

  findAllUserEvents = async() => {
    const user = this.props.user
    if (user) {
      const calendars = await GOOGLE.getCalendars();
      if (calendars) {
        const jobsCalendar = calendars.find(calendar => calendar.summary = 'Jobs' && calendar.id.includes('bob@brilliancepro.com'))
        const events = await GOOGLE.getEvents(jobsCalendar.id)
        const userEvents = events.filter(
          event =>
          event.attendees?
          event.attendees.find(attendee => (attendee.email === user.email))
          : null
        )
        return userEvents
      } else {
        this.setState({ redirectToLogin:true })
      }
    }
  }

  findUpcomingUserEvents = async() => {
    const userEvents = await this.findAllUserEvents();
    if (userEvents) {
      const upcomingEvents = userEvents.filter(function(event){
        const now = moment().format()
        return ( moment(start(event)).isSameOrAfter(now) || moment(now).isSameOrBefore(end(event)) )
      })
      if (upcomingEvents.length > 0) {
        this.setState({ userEvents: upcomingEvents })
      }
    }
  }

  render(){
    const { redirectToLogin, userEvents, columnHeaders } = this.state

    if (redirectToLogin) return (<Redirect to="/login"/>)
    return (
      <Fragment>
        {userEvents && userEvents.length?
          <div className="Schedule--container">
            <div className='Schedule--dialog'>
              <p>{schedule(userEvents)}</p>
              <p>Please confirm if you will be able to work by clicking/tapping on the confirmation button</p>
            </div>
            <List
              user={this.props.user}
              type="Schedule"
              items={userEvents}
              columnHeaders={columnHeaders}
              load={this.findUpcomingUserEvents}
              hasMore={false}
            />
          </div>
          :
          <p className="Schedule--not-currently">Not currently scheduled...</p>
        }
      </Fragment>
    )
  }
}

function schedule(userEvents) {
  if (numEventsGreaterThanOne(userEvents)) {
    return `You are currently scheduled on ${userEvents.length} events.`
  } else {
    return `You are currently scheduled on 1 event.`
  }
}

function numEventsGreaterThanOne(userEvents){
  return userEvents.length > 1
}

function start(event) {
  if (event) {
    if (event.start) {
      if (event.start.date) {
        return event.start.date
      } else if (event.start.dateTime) {
        return event.start.dateTime
      }
    }
  }
}

function end(event) {
  if (event) {
    if (event.end) {
      if (event.end.date) {
        return event.end.date
      } else if (event.end.dateTime) {
        return event.end.dateTime
      }
    }
  }
}
