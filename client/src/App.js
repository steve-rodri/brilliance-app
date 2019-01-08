import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Login from './components/Login/index.js'
import Dashboard from './components/Dashboard/index.js'
import Clients from './components/Clients/index.js'
import Events from './components/Events/index.js'
import Invoices from './components/Invoices/index.js'
import './App.css';
import { event } from './services/event'
import { getGoogleCalendars, getGoogleEvents } from './services/calendar_service'

class App extends Component {
  constructor(props){
    super(props)
    this.state = {}
  }

  async componentDidMount(){

    const user = JSON.parse(localStorage.getItem('profileObj'));
    if (user) {
      await this.fetchAllGoogleEvents()
      const events = await event.getAll()
      console.log(events)
      this.setState({
        user: user,
      })
    }
  }

  setUser = (user) => {
    this.setState({
      user
    })
  }

  removeUser = () => {
    this.setState({
      user: null
    })
  }

  async fetchAllGoogleEvents(){
    const calendars = await getGoogleCalendars();
    const jobsCalendar = calendars.find(calendar => calendar.summary = 'Jobs' && calendar.id.includes('bob@brilliancepro.com'))
    const events = await getGoogleEvents(jobsCalendar.id)
    console.log(events)
  }

  async mergeGoogleCalendar(){
    const events = await this.fetchAllGoogleEvents()
  }

  render() {
    return (
      <Router>
        <div className="App">
          <Route exact path="/" render={() => this.Login()}/>
          <Route exact path="/login" render={() => this.Login()}/>
          <Route exact path="/admin" render={() => this.Dashboard()}/>
          <Route  path="/admin/events" render={() => this.Events()}/>
          <Route  path="/admin/clients" render={() => this.Clients()}/>
          <Route  path="/admin/invoices" render={() => this.Invoices()}/>
        </div>
      </Router>
    );
  }

  Login(){
    return (
      <Login
        setUser={this.setUser}
      />
    )
  }

  Dashboard(){
    return (
      <Dashboard
        removeUser={this.removeUser}
        user={this.state.user}
      />
    )
  }

  Events(){
    return (
      <Events
        removeUser={this.removeUser}
      />
    )
  }

  Clients(){
    return (
      <Clients
        removeUser={this.removeUser}
      />
    )
  }

  Invoices(){
    return (
      <Invoices
        removeUser={this.removeUser}
      />
    )
  }
}

export default App;
