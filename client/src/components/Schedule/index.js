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
        const userEvents = events.filter(event => {
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
      if (upcomingEvents.length > 0) {
        this.setState({ userEvents: upcomingEvents })
      }
    }
  }

  styleContainer(){
    if (this.state.userEvents.length > 0) {
      return {
        display: 'block'
      }
    } else {
      return {
        display: 'none'
      }
    }
  }

  render(){
    const { redirectToLogin, userEvents} = this.state
    const subtitles = ['','title', 'call', 'notes', 'confirmation']
    if (redirectToLogin) return (<Redirect to="/login"/>)
    return (
      <React.Fragment>
        <div className="schedule--container" style={this.styleContainer()}>
          <h2 className='schedule--title'>Schedule</h2>
          <List
            user={this.props.user}
            type="Schedule"
            items={userEvents}
            subtitles={subtitles}
            load={this.findUpcomingUserEvents}
            hasMore={false}
          />
        </div>
        {!userEvents && userEvents.length === 0 && <p className="schedule--not-currently" >Not currently scheduled...</p>}
      </React.Fragment>

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
