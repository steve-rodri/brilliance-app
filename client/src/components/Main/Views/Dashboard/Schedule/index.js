import React, { Component, Fragment } from 'react'
import { Redirect } from 'react-router-dom'
import List from '../../../../List/index.js'
import moment from 'moment'
import './Schedule.css'

import { getGoogleCalendars, getGoogleEvents } from '../../../../../services/google_service'

export default class Schedule extends Component {
  constructor(props){
    super(props)
    this.state = {
      userEvents: [],
      redirectToLogin: false
    }
  }

  updateColumnHeaders = (e) => {
    const width = window.innerWidth
    if (width < 500) {
      this.setState({
        columnHeaders: ['title', 'confirmation']
      })
    } else if (width < 700) {
      this.setState({
        columnHeaders: ['time until', 'title', 'confirmation']
      })
    } else {
      this.setState({
        columnHeaders: ['time until', 'title', 'notes', 'confirmation']
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
      const calendars = await getGoogleCalendars();
      if (calendars) {
        const jobsCalendar = calendars.find(calendar => calendar.summary = 'Jobs' && calendar.id.includes('bob@brilliancepro.com'))
        const events = await getGoogleEvents(jobsCalendar.id)
        const userEvents = events.filter(event =>
          event.attendees?
          event.attendees.find(attendee => (attendee.email = user.email))
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
        return moment(start(event)).isAfter(now)
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
              <p></p>
            </div>
            <List
              user={this.props.user}
              type="Schedule"
              items={userEvents}
              subtitles={columnHeaders}
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
