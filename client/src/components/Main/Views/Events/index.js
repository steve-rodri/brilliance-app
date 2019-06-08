import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import ListPage from '../../../ListPage/index.js'
import EventDetail from './EventDetail/index.js'
import { GOOGLE } from '../../../../services/google_service'
import { formatToGoogle, formatFromGoogle } from '../../../../helpers/googleFormatters'
import { event, client, employee } from '../../../../services/BEP_APIcalls.js'
import { date } from '../../../../helpers/datetime'
import { clientName } from '../../../../helpers/clientHelpers'
import { eventTitle } from '../../../../helpers/eventHelpers'
import queryString from 'query-string'
import moment from 'moment'
import axios from 'axios'

export default class Events extends Component {
  constructor(props){
    super(props)
    this.state = {
      events: [],
      hasMore: false,
      category: null,
      page: 1,
      listScrollPosition: 0
    }
    this.axiosRequestSource = axios.CancelToken.source()
    this.ajaxOptions = {
      cancelToken: this.axiosRequestSource.token,
      unauthorizedCB: this.props.signout,
      sendCount: true,
      sendUpdates: 'none'
    }
    this.itemsPerPage = 25
  }

  // ----------------------------Lifecycle--------------------------------------

  async componentDidUpdate(prevProps, prevState) {
    if (this.props.match.isExact) await this.setEvents(prevProps)
    if (prevState.count !== this.state.count) {
      if (this.state.count) {
        this.ajaxOptions.sendCount = false
      } else {
        this.ajaxOptions.sendCount = true
      }
    }

    if (prevState.events.length !== this.state.events.length) {
      if (!this.state.events.length) {
        this.setState({
          count: 0
        })
      }
    }
  }

  async componentDidMount() {
    await this.props.setView('Events')
    await this.getActiveEmployees()
    await this.props.setCategories(['CATP', 'THC', 'TANS', 'CANS'])
    await this.setColumnHeaders()
    if (this.props.match.isExact) await this.setEvents()
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateColumnHeaders);
    this.axiosRequestSource && this.axiosRequestSource.cancel()
  }

  // -----------------------Getters-and-Setters---------------------------------

  setEvents = async(prevProps) => {
    if (prevProps) {
      const home = !prevProps.match.isExact && this.props.match.isExact
      // check for location change
      let prevQueryStr, queryStr;
      const { location: prevLocation } = prevProps
      const { location } = this.props

      // check for queries from url
      if (prevLocation && prevLocation.search) prevQueryStr = prevLocation.search
      if (location && location.search) queryStr = location.search
      if (prevQueryStr !== queryStr) await this.setByQuery()

      // check for date change
      const { date: prevDate } = prevProps
      const { date: nextDate } = this.props
      if (prevDate && nextDate) {
        const { start: pStart, end: pEnd } = prevDate
        const { start: nStart, end: nEnd } = nextDate
        const prevStart = moment(pStart);
        const prevEnd = moment(pEnd);
        const nextStart = moment(nStart);
        const nextEnd = moment(nEnd);
        const startChange = !( prevStart.isSame(nextStart) )
        const endChange = !( prevEnd.isSame(nextEnd) )
        const dateChange = startChange || endChange
        if ( dateChange ) await this.setByDate()
      }

      //check exact match change and eventlength
      if (home && !this.state.events.length) this.setByDate()
    } else {
      const { location } = this.props
      let queryStr;
      if (location && location.search) queryStr = location.search
      if (queryStr) await this.setByQuery()
      if (!queryStr) await this.setByDate()
    }

  }

  setByQuery = async() => {
    const queries = queryString.parse(this.props.location.search);
    if (!Object.keys(queries).length) {
      this.resetState(this.setByDate)
    }
    // Category-Query-----------
    if (queries.category) {
      this.ajaxOptions.sendCount = true
      this.setState({
        events: [],
        searchLabel: queries.category,
        type: 'category',
        category: queries.category,
        query: null,
        client: null,
        page: 1
      },
      async() => this.fetchEvents())

    // Search-Query-----------
    } else if (queries.q) {
      this.ajaxOptions.sendCount = true
      this.setState({
        events: [],
        searchLabel: queries.q,
        type: 'query',
        category: null,
        query: queries.q,
        client: null,
        page: 1
      },
      async() => this.fetchEvents())

    // Client-Query-----------
    } else if (queries.client) {
      const clt = await client.get(queries.client, this.ajaxOptions)
      this.ajaxOptions.sendCount = true
      this.setState({
        events: [],
        searchLabel: clientName(clt),
        type: 'client',
        category: null,
        query: null,
        client: queries.client,
        page: 1
      },
      async() => this.fetchEvents())
    }
  }

  setByDate = async() => {
    const { date: { start: s, end: e }, isDay, isMonth } = this.props
    const { state } = this
    const start = moment(s);
    const end = moment(e);
    let d8 = `${start.format('LL')} - ${end.format('LL')}`
    if (isDay()) d8 = `${date(start, true, true)}`
    if (isMonth()) d8 = `${start.format('MMMM YYYY')}`
    let searchLabel = d8

    if (state.category) searchLabel = `${state.category} - ${d8}`
    if (state.client) searchLabel = `${state.client} - ${d8}`
    if (state.query) searchLabel = `${state.query} - ${d8}`

    this.ajaxOptions.sendCount = true
    this.setState(
    {
      events: [],
      searchLabel,
      page: 1,
      type: null
    },
    async() => this.fetchEvents())
  }

  resetEvents = async() => {
    this.setState({ events: [] })
  }

  setColumnHeaders = () => {
    this.updateColumnHeaders();
    window.addEventListener("resize", this.updateColumnHeaders);
  }

  setCategory = (category) => {
    if (category) this.setState({ category })
  }

  setTodaysDate = (props) => {
    const { onDateChange } = this.props
    onDateChange(moment(), 'day')
  }

  setCurrentMonth = () => {
    const { onDateChange } = this.props
    onDateChange(moment(), 'month')
  }

  setMonth = (month, year) => {
    const { onDateChange } = this.props
    onDateChange(moment(month, year), 'month')
  }

  refresh = async(value, url) => {
    const { history } = this.props

    if (value) {
      history.push(url)
      this.setCurrentMonth()
      this.resetState(this.setByDate)
    }
  }

  resetState = (cb) => {
    this.setState({
      searchLabel: null,
      query: null,
      client: null,
      category: null,
      type: null,
    }, () => typeof cb === 'function'? cb() : null)
  }

  // -------------------------------CRUD----------------------------------------

  fetchEvents = async() => {
    this.props.setLoadingState(true)
    const { events, page, category, query: q, client, type } = this.state
    const { date: { start: date_start, end: date_end } } = this.props
    let params = { page, category, q, client, date_start, date_end }
    if ((events.length + this.itemsPerPage) / page <= this.itemsPerPage) {
      switch (type) {
        case 'query':
          params = { page, q }
          break;
        case 'category':
          params = { page, category }
          break;
        case 'client':
          params = { page, client }
          break;
        default:
          break;
      }
      const data = await event.batch(params, this.ajaxOptions)
      if (data && data.events && data.events.length) await this.updateEvents(data)
      else {
        this.setState({ hasMore: false })
        this.props.setLoadingState(false)
      }
    } else {
      this.setState({ hasMore: false })
      this.props.setLoadingState(false)
    }
  }

  addEvent = async(formData, sendUpdates) => {
    let events = [...this.state.events]
    let newEvent = await event.create(formData, this.ajaxOptions)

    const calendarId = localStorage.getItem('google_calendar_id')
    if (calendarId) {
      const newGoogleEvent = await GOOGLE.createEvent(calendarId, formatToGoogle(newEvent), this.ajaxOptions)
      let formatted = await formatFromGoogle(newGoogleEvent, this.ajaxOptions)

      if ( formatted && formatted.event_employees_attributes) {

        let update = formatted.event_employees_attributes.filter(ee => {

          if (newEvent.staff && newEvent.staff.length) {
            return newEvent.staff.find(worker => worker.info.id !== ee.employee_id)
          } else {
            return 1
          }

        })

        if (update && update.length) {
          formatted.event_employees_attributes = update
        } else {
          delete formatted.event_employees_attributes
        }

      }
      newEvent = await event.update(newEvent.id, formatted, this.ajaxOptions)
    }
    events.push(newEvent)
    events = events.sort((evtOne, evtTwo) => {
      return moment(evtOne.start).isBefore(moment(evtTwo.start))
    })
    this.setState({ events })
    return newEvent
  }

  deleteEvent = async(evt) => {
    const calendarId  = localStorage.getItem('google_calendar_id')
    let events = [...this.state.events]
    await event.delete(evt.id, this.ajaxOptions)
    if (evt.gcId) {
      await GOOGLE.deleteEvent(calendarId, evt.gcId, this.ajaxOptions)
    }
    events = events.filter( e => e.id !== evt.id)
    this.setState({ events })
  }

  updateEvent = async(e, data, sendUpdates) => {
    if (!e) return;
    const calendarId = localStorage.getItem('google_calendar_id')
    let updatedEvent = e;

    if (data) updatedEvent = await event.update(e.id, data, this.ajaxOptions)

    if (calendarId) {
      if (sendUpdates) this.ajaxOptions.sendUpdates = 'all'
      if (!sendUpdates || sendUpdates === 'none') this.ajaxOptions.sendUpdates = 'none'

      let googleEvent;

      if (e.gcId) {
        googleEvent = await GOOGLE.patchEvent(calendarId, e.gcId, formatToGoogle(updatedEvent), this.ajaxOptions)
      } else {
        googleEvent = await GOOGLE.createEvent(calendarId, formatToGoogle(updatedEvent), this.ajaxOptions)
      }

      let formatted = await formatFromGoogle(googleEvent, this.ajaxOptions)

      let newData = { ...data, ...formatted }

      if (newData.event_employees_attributes) {

        let update = newData.event_employees_attributes.filter(ee => {

          if (newData.employee_ids && newData.employee_ids.length) {
            return newData.employee_ids.find(id => ee.employee_id !== id)
          } else {
            return 1
          }

        })

        newData.event_employees_attributes = update
      }

      updatedEvent = await event.update(e.id, newData, this.ajaxOptions)
    }

    let events = [...this.state.events]
    const index = events.findIndex((event) => event.id === e.id)
    events[index] = updatedEvent
    this.setState({ events })
    return updatedEvent
  }

  updateEvents = async(data) => {
    const { events: evts, meta: { count, next } } = data
    const { page } = this.state
    const events = [...this.state.events]
    if ((events.length + this.itemsPerPage) / page <= this.itemsPerPage) {

      const updatedEvents = evts.map( async(e) => {
        if (!e.summary) {
          e.summary = eventTitle(e)
          await event.update(e.id, {summary: e.summary}, this.ajaxOptions)
        }
        const evt = await this.synchronizeWithGoogle(e)
        if (evt) {
          if (next.id === evt.id) evt.isNextEvent = true
          return evt
        } else {
          if (next.id === e.id) e.isNextEvent = true
          return e
        }
      })

      const loadedEvents = await Promise.all(updatedEvents)
      loadedEvents.forEach(e => events.push(e))
      if (events.length === count) {
        this.setState({
          events,
          hasMore: false,
          count
        })

      } else {
        this.setState( prevState => ({
          events,
          hasMore: true,
          page: prevState.page + 1,
          count
        }))
      }
      this.props.setLoadingState(false)
    }
  }

  synchronizeWithGoogle = async (evt) => {
    const calendarId = localStorage.getItem('google_calendar_id')
    if (calendarId && evt.gcId) {
      const e = await GOOGLE.getEvent(calendarId, evt.gcId, this.ajaxOptions)
      const formatted = await formatFromGoogle(e, this.ajaxOptions)
      const synced = await event.sync(formatted, this.ajaxOptions)
      return synced
    }
  }

  getActiveEmployees = async() => {
    const data = await employee.batch({ active: true }, this.ajaxOptions)
    this.setState({ employees: data.employees })
  }

  // --------------------------Handle-Change------------------------------------

  handleStatusChange = async (evt, name, value) => {
    await this.updateEvent(evt, { [name]: value } )
  }

  changeCategory = (category) => {
    this.setCategory(category);
    this.resetEvents();
  }

  // ------------------------------Views----------------------------------------

  updateColumnHeaders = (e) => {
    const width = window.innerWidth
    if (width < 500) {
      this.setState({
        columnHeaders: null
      })
    } else if (width < 700) {
      this.setState({
        columnHeaders: ['job', 'job', 'status']
      })
    } else if (width < 900) {
      this.setState({
        columnHeaders: ['job', 'job', 'staff', 'status']
      })
    } else if (width < 1300){
      this.setState({
        columnHeaders: ['job', 'job', 'job', 'staff', 'status']
      })
    } else {
      this.setState({
        columnHeaders: ['job', 'job', 'job','','staff', 'status']
      })
    }
  }

  setListScrollPosition = (value) => {
    this.setState({ listScrollPosition: value })
  }

  List = (props) => {
    const { events, searchLabel } = this.state
    return (
      <ListPage
        {...this.props}
        {...props}
        {...this.state}

        mainHeader={searchLabel}
        data={events}

        load={this.fetchEvents}
        create={this.addEvent}
        refresh={this.refresh}

        handleStatusChange={this.handleStatusChange}
        handleMonthChange={this.setMonth}
        setScrollPosition={this.setListScrollPosition}
      />
    )
  }

  Show = ({ match, history }) => {
    let view;
    if (history.location.state) {
      view = history.location.state.view
    }
    const req_id = parseInt(match.params.id)
    const events = this.state.events
    let e;
    if (events && events.length) {
      e = events.find(event => event.id === req_id)
    }

    return (
      <EventDetail
        {...this.props}
        {...this.state}
        e={e}
        evtId={req_id}
        match={match}
        history={history}
        view={view}
        handleDelete={this.deleteEvent}
        handleUpdate={this.updateEvent}
      />
    )
  }

  Create = ({ match, history }) => {
    const { user: { accessLevel } } = this.props
    const isNew = match.path === `/${accessLevel}/events/new`
    return (
      <EventDetail
        {...this.props}
        {...this.state}
        isNew={isNew}
        match={match}
        history={history}
        handleCreate={this.addEvent}
        handleDelete={this.deleteEvent}
        handleUpdate={this.updateEvent}
      />
    )
  }

  render(){
    const { match } = this.props
    return (
      <Switch>
        <Route exact path={match.path} render={ props => this.List(props)} />
        <Route exact path={`${match.path}/new`} render={ props => this.Create(props)} />
        <Route path={`${match.path}/:id`} render={ props => this.Show(props)} />
      </Switch>
    )
  }
}
