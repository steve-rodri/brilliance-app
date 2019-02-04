import React, { Component } from 'react'
import Header from '../Header/index.js'
import Search from '../Search/index.js'
import Schedule from '../Schedule/index.js'
import moment from 'moment'
import './Dashboard.css'

export default class Dashboard extends Component {
  render(){
    const { user, location } = this.props
    return (
      <div className="Dashboard">
        <Header location={location}/>
        <div className="Dashboard--main">
          <h1 className="Dashboard--intro">{this.greeting(user.givenName)}</h1>
          <Schedule user={user}/>
        </div>
      </div>
    )
  }

  greeting(username){
    const currentTime = moment().format();
    const morningZ = moment().startOf('day').add(6, "hours");
    const morning = moment(morningZ).format()
    const noonZ = moment().startOf('day').add(11, "hours");
    const noon = moment(noonZ).format()
    const eveningZ = moment().startOf('day').add(17, "hours");
    const evening = moment(eveningZ).format();

    if (moment(currentTime).isBetween(morning, noon)) {
      return `Good Morning, ${username}`
    } else if (moment(currentTime).isBetween(noon, evening)) {
      return `Good Afternoon, ${username}`
    } else if (moment(currentTime).isAfter(evening)) {
      return `Good Evening, ${username}`
    }
  }

}
