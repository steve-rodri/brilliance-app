import React, { Component } from 'react'
// import Search from '../../../Search/index.js'
import Schedule from './Schedule/index.js'
import moment from 'moment'
import './index.css'

export default class Dashboard extends Component {
  constructor(props){
    super(props)
    this.state = {
      user: null
    }
  }

  async componentDidMount(){
    const user = await this.props.getUser()
    this.setState({ user })
  }

  greeting = () => {
    const { user } = this.state
    const username = user? user.given_name : ''

    const currentTime = moment().format();
    const morningZ = moment().startOf('day').add(6, "hours");
    const morning = moment(morningZ).format()
    const noonZ = moment().startOf('day').add(11, "hours");
    const noon = moment(noonZ).format()
    const eveningZ = moment().startOf('day').add(17, "hours");
    const evening = moment(eveningZ).format();

    if (moment(currentTime).isBetween(morning, noon)) {
      return `Good Morning ${username},`
    } else if (moment(currentTime).isBetween(noon, evening)) {
      return `Good Afternoon ${username},`
    } else if (moment(currentTime).isAfter(evening)) {
      return `Good Evening ${username},`
    }
  }

  render(){
    return (
      <div className="Dashboard">
        <h1 className="Dashboard--intro" >{this.greeting()}</h1>
        <Schedule {...this.props} />

        <button onClick={this.props.syncAllEvents}>Sync</button>
      </div>
    )
  }
}
