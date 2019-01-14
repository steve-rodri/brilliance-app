import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import List from '../List/index.js'
import moment from 'moment'
import './Schedule.css'

import { getGoogleCalendars, getGoogleEvents } from '../../services/google_service'

export default class Schedule extends Component {
  constructor(props){
    super(props)
    this.state = {
      userEvents: [],
      redirectToLogin: false
    }
  }

  async componentDidMount(){
    await this.findUpcomingUserEvents()
  }

  async componentWillUnmount(){
    this.setState({
      userEvents: []
    })
  }

  findAllUserEvents = async() => {
    const user = this.props.user
    if (user) {
      const calendars = await getGoogleCalendars();
      if (calendars) {
        const jobsCalendar = calendars.find(calendar => calendar.summary = 'Jobs' && calendar.id.includes('bob@brilliancepro.com'))
        const events = await getGoogleEvents(jobsCalendar.id)
        const userEvents = events.filter(function(event) {
            if (event.attendees) {
              return event.attendees.find(attendee => (attendee.email = user.email))
            }
          }
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
      this.setState({userEvents:upcomingEvents})
    }
  }

  render(){
    const { redirectToLogin, userEvents} = this.state
    const subtitles = ['','title', 'call', 'notes', 'confirmation']
    if (redirectToLogin) return (<Redirect to="/login"/>)
    return (
      <div className="schedule--container">
        <h2 className='schedule--title'>Schedule</h2>
        <List
          user={this.props.user}
          type="Schedule"
          items={userEvents}
          subtitles={subtitles}
        />
      </div>
    )
  }
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
