import React, { Component, Fragment } from 'react'
import List from '../../../../List/'
import Loader from '../../../../Loader'
import { event } from '../../../../../services/BEP_APIcalls.js'
import { GOOGLE } from '../../../../../services/google_service'
import { formatToGoogle, formatFromGoogle } from '../../../../../helpers/googleFormatters'
import { start, end } from '../../../../../helpers/datetime'
import { changeWorkerStatus } from '../../../../../helpers/eventHelpers'
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
    this.props.setLoadingState(true)
    const { page } = this.state
    const { user } = this.props
    if (user) {
      const data = await event.batch({page, email: user.profile.email}, this.ajaxOptions)
      if (data) return data.events
    }
  }

  findUpcomingUserEvents = async() => {
    this.props.setLoadingState(true)
    const userEvents = await this.findAllUserEvents();
    if (!userEvents) {
      this.props.setLoadingState(false);
      return;
    };
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
      const uEvents = await Promise.all(upcomingEvents.map( async evt => await this.syncWithGoogle(evt)))
      this.setState({ userEvents: uEvents })
    }
    this.incrementPage()
    this.props.setLoadingState(false)
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

  changeConfirmation = async (eventId, currentUserId) => {
    const { userEvents } = this.state;
    userEvents.map( async evt => {
      if (evt.id !== eventId) return evt;
      const updatedStaff = evt.staff.map( worker => {
        if (worker.id !== currentUserId) return worker;
        let updatedWorker = {
          ...worker,
          confirmation: changeWorkerStatus(worker.confirmation)
        }
        return updatedWorker
      })
      const updatedEvt = {
        ...evt,
        staff: updatedStaff
      }
      const test = await this.updateEvent(updatedEvt, { event_employees_attributes: updatedStaff })
      console.log(test)
      return updatedEvt
    })
  }

  updateEvent = async(e, data) => {
    if (!e) return;
    const calendarId = localStorage.getItem('google_calendar_id')
    const { signout } = this.props
    let updatedEvent = e;
    if (data) updatedEvent = await event.update(e.id, data, this.ajaxOptions)
    if (!calendarId) return updatedEvent;
    let googleEvent, formatted;
    if (e.gcId) {
      googleEvent = await GOOGLE.patchEvent(calendarId, e.gcId, formatToGoogle(updatedEvent), this.ajaxOptions)
    }
    if (!e.gcId) {
      googleEvent = await GOOGLE.createEvent(calendarId, formatToGoogle(updatedEvent), this.ajaxOptions)
    }
    formatted = await formatFromGoogle(googleEvent, this.axiosRequestSource.token, signout)
    let newData = { ...data, ...formatted }
    if (newData.event_employees_attributes) {
      const updateStaff = newData.event_employees_attributes.filter(ee => {
        if (newData.employee_ids && newData.employee_ids.length) {
          return newData.employee_ids.find(id => ee.employee_id !== id)
        } else {
          return 1
        }
      })
      newData.event_employees_attributes = updateStaff
    }
    updatedEvent = await event.update(e.id, newData, this.ajaxOptions)
  }

  syncWithGoogle = async (evt) => {
    const calendarId = localStorage.getItem('google_calendar_id')
    if (calendarId && evt.gcId) {
      const e = await GOOGLE.getEvent(calendarId, evt.gcId, this.ajaxOptions)
      const formatted = await formatFromGoogle(e, this.ajaxOptions)
      const synced = await event.sync(formatted, this.ajaxOptions)
      return synced
    }
  }

  render(){
    const { userEvents } = this.state
    const { loading } = this.props
    return (
      <Fragment>
        <div className="Schedule--container">
        {
          !loading?
            userEvents && userEvents.length?
              <Fragment>
                <div className='Schedule--dialog'>{this.dialog()}</div>
                <List
                  {...this.state}
                  {...this.props}
                  items={userEvents}
                  load={this.findUpcomingUserEvents}
                  hasMore={false}
                  changeConfirmation={this.changeConfirmation}
                />
              </Fragment>
            :
            <p className="Schedule--not-currently">You are not currently scheduled on any events at this time...</p>
          :
          <Loader/>
        }
        </div>
      </Fragment>
    )
  }
}
