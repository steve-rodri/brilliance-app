import React, { Component } from 'react'
import Header from '../Header/index.js'
import Search from '../Search/index.js'
import Schedule from '../Schedule/index.js'
import { Route, Redirect } from 'react-router-dom'
import './Dashboard.css'

export default class Dashboard extends Component {
  render(){
    if (!this.props.user) return (<Redirect to='/login' />)
    const user = this.props.user
    return (
      <div>
        <Header removeUser={this.props.removeUser}/>
        <h1>Welcome {user.givenName}!</h1>
        <Schedule user={user}/>


        <Route path="/admin/events" render={() => this.Events()}/>
        <Route path="/admin/clients" render={() => this.Clients()}/>
        <Route path="/admin/invoices" render={() => this.Invoices()}/>
      </div>
    )
  }

    Events(){
      return (
        <div></div>
      )
    }

    Clients(){
      return (
        <div></div>
      )
    }

    Invoices(){
      return (
        <div></div>
      )
    }
}
