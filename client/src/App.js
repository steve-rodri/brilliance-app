import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Login from './components/Login/index.js'
import Dashboard from './components/Dashboard/index.js'
import './App.css';

class App extends Component {
  constructor(props){
    super(props)
    this.state = {}
  }

  componentDidMount(){
    const user = JSON.parse(localStorage.getItem('profileObj'));
    if (user) {
      this.setState({
        user: user
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
    localStorage.clear();
  }

  render() {
    return (
      <Router>
        <div className="App">
          <Route exact path="/" render={() => this.Login()}/>
          <Route exact path="/login" render={() => this.Login()}/>
          <Route exact path="/admin" render={() => this.Dashboard()}/>
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
}

export default App;
