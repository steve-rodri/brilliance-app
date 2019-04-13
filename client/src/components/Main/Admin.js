import React, { Component, Fragment } from 'react'
import { Switch, Route } from 'react-router-dom'
import Header from '../Header'
import Dashboard from './Views/Dashboard'
import Clients from './Views/Clients'
import Events from './Views/Events'
import Invoices from './Views/Invoices'
import Staff from './Views/Staff'

export default class Admin extends Component {
  render(){
    const { match, user } = this.props
    return (
      <Fragment>
        <Header {...this.props}/>
        <Switch>
          <Route  exact path={match.path}  render={ props => <Dashboard {...props} user={user} /> } />
          <Route  path={`${match.path}/events`} render={ props => <Events {...props} user={user} /> } />
          <Route  path={`${match.path}/clients`} render={ props => <Clients {...props} user={user} /> } />
          <Route  path={`${match.path}/invoices`} render={ props => <Invoices {...props} user={user} /> } />
          <Route  path={`${match.path}/staff`} render={ props => <Staff {...props} user={user} /> } />
        </Switch>
      </Fragment>
    )
  }
}
