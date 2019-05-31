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
    const { match, mobile } = this.props
    return (
      <Fragment>
        <Header {...this.props}/>
        <div className="Header--fixed-space"></div>
        <Switch>
          <Route  exact path={match.path}  render={ props => <Dashboard {...this.props } {...props} /> } />
          <Route  path={`${match.path}/events`} render={ props => <Events {...this.props } {...props} /> } />
          <Route  path={`${match.path}/clients`} render={ props => <Clients {...this.props } {...props} /> } />
          <Route  path={`${match.path}/invoices`} render={ props => <Invoices {...this.props } {...props} /> } />
          <Route  path={`${match.path}/staff`} render={ props => <Staff {...this.props } {...props} /> } />
        </Switch>
        { mobile? <div className="Mobile-Space" style={{ height: '115px'}}></div> : null}
      </Fragment>
    )
  }
}
