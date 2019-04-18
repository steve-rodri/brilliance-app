import React, { Component, Fragment } from 'react'
import List from '../../../../List/index.js'
import { event } from '../../../../../services/event'
import { start, end } from '../../../../Helpers/datetime'
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
  }

  async componentDidMount(){
    this.updateColumnHeaders();
    window.addEventListener("resize", this.updateColumnHeaders);
    const user = await this.props.getUser()
    this.setState(
    {
      user,
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
    const width = window.innerWidth
    if (width < 500) {
      this.setState({
        columnHeaders: ['event', 'confirmation']
      })
    } else if (width < 700) {
      this.setState({
        columnHeaders: ['time until', 'event', 'confirmation']
      })
    } else {
      this.setState({
        columnHeaders: ['time until', 'event', 'notes', 'confirmation']
      })
    }
  }

  findAllUserEvents = async() => {
    const { user, page } = this.state
    if (user) {
      const events = await event.findByEmail(page, user.email, this.axiosRequestSource.token)
      return events
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
            moment(now).isSameOrBefore(end(evt))
          )
        )
      })
      if (upcomingEvents.length > 0) {
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

  dialog = (userEvents) => {
    if (userEvents.length > 1) {
      return (
        <Fragment>
          <p>{`You are currently scheduled on ${userEvents.length} events.`}</p>
          <p>{'Please confirm if you will be able to work by clicking/tapping on the confirmation button'}</p>
        </Fragment>
      )
    } else {
      return (
        <Fragment>
          <p>{`You are currently scheduled on 1 event.`}</p>
          <p>{'Please confirm if you will be able to work by clicking/tapping on the confirmation button'}</p>
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
            <div className='Schedule--dialog'>
              {this.dialog(userEvents)}
            </div>
            <List
              {...this.state}
              {...this.props}
              type="Schedule"
              items={userEvents}
              load={this.findUpcomingUserEvents}
              hasMore={false}
            />
          </div>

          :

          <p className="Schedule--not-currently">Not currently scheduled...</p>

        }
      </Fragment>
    )
  }
}
