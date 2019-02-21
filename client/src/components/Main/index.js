import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import Admin from './Admin'

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
        <Switch>
          <Route path="/admin" render={ props => <Admin {...props} user={this.user()} /> } />
          <Redirect to="/"/>
        </Switch>
      </div>
    )
  }
}
