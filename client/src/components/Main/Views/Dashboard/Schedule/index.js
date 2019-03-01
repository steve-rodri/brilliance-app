import React, { Component, Fragment } from 'react'
import { Redirect } from 'react-router-dom'
import List from '../../../../List/index.js'
import { GOOGLE } from '../../../../../services/google_service'
import { event } from '../../../../../services/event'
import { start, end } from '../../../../Helpers/datetime'
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
    this.setState(
    {
      page: 1
    },
      async () => {
      await this.resetUserEvents()
      await this.findUpcomingUserEvents()
    })
  }

  async componentWillUnmount(){
    window.removeEventListener("resize", this.updateColumnHeaders);
    this.setState({ userEvents: null })
  }

  findAllUserEventsFromGoogle = async() => {
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

  findAllUserEvents = async() => {
    const { page } = this.state
    const { user } = this.props
    if (user) {
      const events = await event.findByEmail(page, user.email)
      return events
    }
  }

  findUpcomingUserEvents = async() => {
    const userEvents = await this.findAllUserEvents();
    if (userEvents) {
      const upcomingEvents = userEvents.filter( evt => {
        const now = moment()
        return (
          start(evt)
          &&
          (
            moment(start(evt)).isSameOrAfter(now)
            ||
            moment(now).isSameOrBefore(end(evt))
          )
        )
      })
      if (upcomingEvents.length > 0) {
        this.setState({ userEvents: upcomingEvents })
      }
      this.incrementPage()
    }
  }

  resetUserEvents = () => {
    this.setState({ userEvents: null })
  }

  resetPage = () => {
    this.setState({ page: 1 })
  }

  incrementPage = () => {
    this.setState(prevState => ({
      page: prevState.page +1
    }))
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
              match={this.props.match}
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
