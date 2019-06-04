import React, { Component, Fragment } from 'react'
import List from '../../../../List/index.js'
import { event } from '../../../../../services/BEP_APIcalls.js'
import { start, end } from '../../../../../helpers/datetime'
import moment from 'moment'
import axios from 'axios'
import './Schedule.css'

export default class Schedule extends Component {
  constructor(props){
    super(props)
    this.state = {
      userEvents: null
    }
    this.axiosRequestSource = axios.CancelToken.source()
    this.ajaxOptions = {
      cancelToken: this.axiosRequestSource.token,
      unauthorizedCB: this.props.signout,
      sendCount: true
    }
  }

  async componentDidMount(){
    this.updateColumnHeaders();
    window.addEventListener("resize", this.updateColumnHeaders);
    this.setState(
    {
      page: 1
    },
      async () => {
      await this.resetUserEvents()
      await this.findUpcomingUserEvents()
    })
  }

  async componentWillUnmount(){
    window.removeEventListener("resize", this.updateColumnHeaders);
    this.axiosRequestSource && this.axiosRequestSource.cancel()
  }

  updateColumnHeaders = (e) => {
    this.setState({
      columnHeaders: ['event', 'event', 'event', 'confirmation']
    })
  }

  findAllUserEvents = async() => {
    const { page } = this.state
    const { user } = this.props
    if (user) {
      const data = await event.batch({page, email: user.profile.email}, this.ajaxOptions)
      if (data) return data.events
    }
  }

  findUpcomingUserEvents = async() => {
    const userEvents = await this.findAllUserEvents();
    if (userEvents) {
      const upcomingEvents = userEvents.filter( evt => {
        const now = moment()
        return (
          start(evt)
          &&
          (
            moment(start(evt)).isSameOrAfter(now)
            ||
            now.isSameOrBefore(end(evt))
          )
        )
      })
      if (upcomingEvents.length > 0) {
        upcomingEvents.reverse()
        this.setState({ userEvents: upcomingEvents })
      }
      this.incrementPage()
    }
  }

  resetUserEvents = () => {
    this.setState({ userEvents: null })
  }

  resetPage = () => {
    this.setState({ page: 1 })
  }

  incrementPage = () => {
    this.setState(prevState => ({
      page: prevState.page +1
    }))
  }

  dialog = () => {
    const { userEvents } = this.state
    if (userEvents.length > 1) {
      return (
        <Fragment>
          <p>{`You are currently scheduled on ${userEvents.length} events.`}</p>
        </Fragment>
      )
    } else {
      return (
        <Fragment>
          <p>{`You are currently scheduled on 1 event.`}</p>
        </Fragment>
      )
    }
  }

  render(){
    const { userEvents } = this.state
    return (
      <Fragment>
        {
          userEvents && userEvents.length?

          <div className="Schedule--container">
            <div className='Schedule--dialog'>{this.dialog()}</div>
            <List
              {...this.state}
              {...this.props}
              items={userEvents}
              load={this.findUpcomingUserEvents}
              hasMore={false}
            />
          </div>

          :

          <p className="Schedule--not-currently">You are not currently scheduled on any events at this time...</p>

        }
      </Fragment>
    )
  }
}
