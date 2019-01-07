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

  loggedIn = () =>{
    const token = localStorage.getItem('google_access_token')
    if (token) {
      return true
    } else {
      return false
    }
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
      </div>
    );
  }
}

export default App;
