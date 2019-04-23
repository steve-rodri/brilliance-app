import React, { Component } from 'react'
import { Route, Switch, Redirect  } from 'react-router-dom'
import Admin from './Admin'
import { GOOGLE } from '../../services/google_service'
import { event } from '../../services/event'
import { formatFromGoogle } from '../../helpers/googleFormatters'
import moment from 'moment'
import axios from 'axios'

export default class Main extends Component {

  constructor(props){
    super(props)
    this.state = {
      date: {
        start: moment().startOf('day').toISOString(true),
        end: moment().endOf('day').toISOString(true)
      }
    }
  }

  axiosRequestSource = axios.CancelToken.source()

  async componentDidMount(){
    await this.getGoogleCalendarId()
    // await this.synchronizeAllEvents()
  }

  async componentWillUnmount(){
    this.axiosRequestSource && this.axiosRequestSource.cancel()
  }

  getGoogleCalendarId = async() => {
    const { getUser } = this.props
    const user = await getUser()
    if (user) {
      const calendars = await GOOGLE.getCalendars(this.axiosRequestSource.token);
      if (calendars) {
        const jobsCalendar = calendars.find(calendar => calendar.summary = 'Jobs' && calendar.id.includes('bob@brilliancepro.com'))
        localStorage.setItem("google_calendar_id", jobsCalendar.id)
        return jobsCalendar.id
      }
    }
  }

  synchronizeAllEvents = async() => {
    const calendarId = await this.getGoogleCalendarId()
    const events = await GOOGLE.getEvents(calendarId, this.axiosRequestSource.token)
    const evts = await Promise.all( events.map( async evt => await formatFromGoogle( evt, this.axiosRequestSource.token ) ) )
    await Promise.all( evts.map( async evt => await event.sync(evt, this.axiosRequestSource.token ) ) )
  }

  render(){
    return(
      <div className="App">
        <Switch>

          <Route
            path="/admin"
            render={ props =>
              <Admin
                {...this.state}
                {...this.props}
                {...props}
                getGoogleCalendarId={this.getGoogleCalendarId}
                syncAllEvents={this.synchronizeAllEvents}
              />
            }
          />

          <Redirect to="/"/>

        </Switch>
      </div>
    )
  }
}
