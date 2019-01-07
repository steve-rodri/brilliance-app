import React, { Component } from 'react'
import List from '../List/index.js'
import './Schedule.css'

import {
  getGoogleCalendars,
  getGoogleEvents,
  createGoogleEvent
} from '../../services/calendar_service'

export default class Schedule extends Component {
  constructor(props){
    super(props)
    this.state = {
      userEvents: []
    }
  }

  async componentDidMount(){
    await this.findUserEvents()
  }

  findUserEvents = async() => {
    const user = this.props.user
    if (user) {
      const calendars = await getGoogleCalendars();
      const jobsCalendar = calendars.find(calendar => calendar.summary = 'Jobs' && calendar.id.includes('bob@brilliancepro.com'))
      const events = await getGoogleEvents(jobsCalendar.id)
      const userEvents = events.find(function(event) {
          if (event.attendees) {
            return event.attendees.find(attendee => (attendee.email = user.email))
          }
        }
      )
      console.log(userEvents)
    }
  }

  render(){
    return (
      <div className="schedule--container">
        <h2 className='schedule--title'>Schedule</h2>
        <List events={this.state.userEvents}/>
      </div>
    )
  }
}
