import React, { Component } from 'react'
import ReactModal from 'react-modal';
import Header from '../Header/index.js'
import Search from '../Search/index.js'
import Schedule from '../Schedule/index.js'
import './Dashboard.css'

export default class Dashboard extends Component {
  render(){
    const { user, location } = this.props
    return (
      <div className="Dashboard">
        <Header location={location}/>
        <div className="Dashboard--main">
          <h1 className="Dashboard--intro">Welcome {user.givenName}!</h1>
          <Schedule user={user}/>
        </div>
      </div>
    )
  }
}
