import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import Main from './components/Main/index.js'
import Login from './components/Login/index.js'
import './App.css';

class App extends Component {

  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" render={() => {
              const token = localStorage.getItem('google_access_token')
              if (!token) {
                return (
                  <Redirect to="/login"/>
                )
              } else {
                return (
                  <Redirect to="/admin"/>
                )
              }
            }}
          />
          <Route path="/login" component={Login}/>
          <Route component={Main}/>
        </Switch>
      </Router>
    );
  }
}

export default App;
