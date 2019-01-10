import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'
import Dashboard from '../Dashboard/index.js'
import Clients from '../Clients/index.js'
import Events from '../Events/index.js'
import Invoices from '../Invoices/index.js'

export default class Main extends Component {
  constructor(props){
    super(props)
    this.state = {}
  }

  user = () => {
    let user;
    const profileObj = localStorage.getItem('profileObj')
    if (profileObj) {
      user = JSON.parse(profileObj)
    }
    return user
  }

  render(){
    const token = localStorage.getItem('google_access_token')
    if (!token ) return (<Redirect to="/login"/>)
    return(
      <div className="App">
        <Route exact path="/admin" render={() => <Dashboard user={this.user()} /> } />
        <Route  path="/admin/events" render={(props) => <Events {...props} user={this.user()} /> } />
        <Route  path="/admin/clients" render={() => <Clients user={this.user()} /> } />
        <Route  path="/admin/invoices" render={() => <Invoices user={this.user()} /> } />
      </div>
    )
  }
}


// async fetchAllGoogleEvents(){
//   const calendars = await getGoogleCalendars();
//   const jobsCalendar = calendars.find(calendar => calendar.summary = 'Jobs' && calendar.id.includes('bob@brilliancepro.com'))
//   const events = await getGoogleEvents(jobsCalendar.id)
//   console.log(events)
// }
//
// async mergeGoogleCalendar(){
//   const events = await this.fetchAllGoogleEvents()
// }
