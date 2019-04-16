import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import Admin from './Admin'
import { GOOGLE } from '../../services/google_service'
import { event } from '../../services/event'
import { formatFromGoogle } from '../Helpers/googleFormatters'
import axios from 'axios'

export default class Main extends Component {
  constructor(props){
    super(props)
    this.state = {
      loggedIn: true
    }
    this.axiosRequestSource = axios.CancelToken.source()
  }

  async componentDidMount(){
    await this.getUser()
    await this.getGoogleCalendarId()
    // await this.synchronizeAllEvents()
  }

  async componentWillUnmount(){
    this.axiosRequestSource && this.axiosRequestSource.cancel()
  }

  getUser = async() => {
    const user = await GOOGLE.getUser(this.axiosRequestSource.token)
    if (user) {
      this.setState({
        user,
        loggedIn: true
      })
    } else {
      this.setState({ loggedIn: false })
    }
  }

  getGoogleCalendarId = async() => {
    const { user } = this.state
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
    const evts = await Promise.all(events.map(async evt => {return await formatFromGoogle(evt, this.axiosRequestSource.token)}))
    await Promise.all(evts.map(async evt => await event.sync(evt, this.axiosRequestSource.token)))
  }

  render(){
    const { loggedIn } = this.state
    if (!loggedIn) return (<Redirect to="/login"/>)
    return(
      <div className="App">
        <Switch>
          <Route path="/admin" render={ props => <Admin {...props} user={this.state.user} /> } />
          <Redirect to="/"/>
        </Switch>
      </div>
    )
  }
}
