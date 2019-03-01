import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { GOOGLE } from '../../services/google_service'
import { event } from '../../services/event'
import { formatFromGoogle } from '../Helpers/googleFormatters'
import Admin from './Admin'

export default class Main extends Component {
  constructor(props){
    super(props)
    this.state = {}
  }

  async componentDidMount(){
    //await this.synchronizeEvents()
  }

  user = () => {
    let user;
    const profileObj = localStorage.getItem('profileObj')
    if (profileObj) {
      user = JSON.parse(profileObj)
    }
    return user
  }

  synchronizeEvents = async() => {
    const user = this.user()
    if (user) {
      const calendars = await GOOGLE.getCalendars();
      if (calendars) {
        const jobsCalendar = calendars.find(calendar => calendar.summary = 'Jobs' && calendar.id.includes('bob@brilliancepro.com'))
        const events = await GOOGLE.getEvents(jobsCalendar.id)
        const evts = await Promise.all(events.map(async evt => {return await formatFromGoogle(evt)}))
        await Promise.all(evts.map(async evt => await event.sync(evt)))
      }
    }
  }

  render(){
    const token = localStorage.getItem('google_access_token')
    if (!token) return (<Redirect to="/login"/>)
    return(
      <div className="App">
        <Switch>
          <Route path="/admin" render={ props => <Admin {...props} user={this.user()} /> } />
          <Redirect to="/"/>
        </Switch>
      </div>
    )
  }
}
