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
          <Route exact path="/" render={() => <Redirect to="/login"/>}/>
          <Route path="/login" component={Login}/>
          <Route component={Main}/>
        </Switch>
      </Router>
    );
  }
}

export default App;
