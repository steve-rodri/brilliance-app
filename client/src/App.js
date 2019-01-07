import React, { Component } from 'react';
import Login from './components/Login'
import { getGoogleCalendars, getGoogleEvents, createGoogleEvent } from './services/calendar_service'
import './App.css';

class App extends Component {
  constructor(props){
    super(props)
    this.state = {

    }
  }

  async componentDidMount(){
    if (this.loggedIn()) {
      const calendars = await getGoogleCalendars();
      const jobsCalendar = calendars.find(calendar => calendar.summary = 'Jobs' && calendar.id.includes('bob@brilliancepro.com'))
      const events = await getGoogleEvents(jobsCalendar.id)

    }
  }

  loggedIn = () => {
    const token = localStorage.getItem('google_access_token')
    if (token) {
      return true
    } else {
      return false
    }
  }

  logOut = () => {
    localStorage.removeItem('google_access_token')
  }

  responseGoogle = (resp) => {
    if (resp.accessToken) {
      localStorage.setItem('google_access_token',resp.accessToken)
    }
  }

  render() {
    return (
      <div className="App">
      {!this.loggedIn() && <Login
        responseGoogle={this.responseGoogle}
      />}
      {this.loggedIn() && <button onClick={this.logOut}>Log Out</button>}
      </div>
    );
  }
}

export default App;
