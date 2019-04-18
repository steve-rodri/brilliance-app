import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import Main from './components/Main/index.js'
import Login from './components/Login/index.js'
import { GOOGLE } from './services/google_service'
import axios from 'axios'
import './App.css';

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      loggedIn: false
    }
    this.axiosRequestSource = axios.CancelToken.source()
  }

  async componentDidMount(){
    await this.getUser(this.axiosRequestSource.token)
  }
  async componentWillUnmount(){
    this.axiosRequestSource && this.axiosRequestSource.cancel()
  }

  getUser = async() => {
    const user = await GOOGLE.getUser(this.axiosRequestSource.token)
    user? this.setState({ loggedIn: true }) : this.setState({ loggedIn: false })
    return user
  }

  render() {
    const { loggedIn } = this.state
    return (
      <Router>
        <Switch>
          <Route
            exact
            path="/"
            render={() => {
              if (loggedIn) {
                return <Redirect to="/admin"/>
              } else {
                return <Redirect to="/login"/>
              }
            }}
          />
          <Route path="/login" render={props => <Login {...props} getUser={this.getUser}/>}/>
          <Route render={props => <Main {...props} getUser={this.getUser}/>}/>
        </Switch>
      </Router>
    );
  }
}

export default App;
