import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import List from '../List/index.js'
import moment from 'moment'
import './Schedule.css'

import { getGoogleCalendars, getGoogleEvents } from '../../services/calendar_service'

export default class Schedule extends Component {
  constructor(props){
    super(props)
    this.state = {
      userEvents: []
    }
  }

  async componentDidMount(){
    await this.findUpcomingUserEvents()
  }

  findAllUserEvents = async() => {
    const user = this.props.user
    const calendars = await getGoogleCalendars();
    if (!calendars) return (<Redirect to="/login"/>)
    const jobsCalendar = calendars.find(calendar => calendar.summary = 'Jobs' && calendar.id.includes('bob@brilliancepro.com'))
    const events = await getGoogleEvents(jobsCalendar.id)
    const userEvents = events.filter(function(event) {
        if (event.attendees) {
          return event.attendees.find(attendee => (attendee.email = user.email))
        }
      }
    )
    return userEvents
  }

  findUpcomingUserEvents = async() => {
    const userEvents = await this.findAllUserEvents();
    const upcomingEvents = userEvents.filter(function(event){

      if (event.start.dateTime) {

        const eventStart = event.start.dateTime
        const now = moment().format()
        return moment(eventStart).isAfter(now)

      } else if (event.start.date) {

        const eventStart = event.start.date
        const now = moment().format()
        return moment(eventStart).isAfter(now)
      }

    })


  }

  render(){
    return (
      <div className="schedule--container">
        <h2 className='schedule--title'>Schedule</h2>
        <List items={this.state.userEvents}/>
      </div>
    )
  }
}
