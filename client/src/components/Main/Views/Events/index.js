import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import ListPage from '../../../ListPage/index.js'
import EventDetail from './EventDetail/index.js'
import { GOOGLE } from '../../../../services/google_service'
import { formatToGoogle, formatFromGoogle } from '../../../../helpers/googleFormatters'
import { event, client } from '../../../../services/BEP_APIcalls.js'
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
      page: 1
    }
    this.axiosRequestSource = axios.CancelToken.source()
    this.ajaxOptions = {
      cancelToken: this.axiosRequestSource.token,
      unauthorizedCB: this.props.signout,
      sendCount: true
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
  }

  async componentDidMount() {
    const { location, changeNav } = this.props
    if (location && location.state && !location.state.nav) changeNav(false)
    await this.props.setView('Events')
    await this.props.setCategories(['CATP', 'THC', 'TANS', 'CANS'])
    await this.setColumnHeaders()
    await this.setCurrentMonth()
    await this.setCalendarId()
    await this.setEvents()
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateColumnHeaders);
    this.axiosRequestSource && this.axiosRequestSource.cancel()
  }

  // -----------------------Getters-and-Setters---------------------------------

  setEvents = async(prevProps) => {
    let options = {
      query: null,
      category: null,
      client: null
    }
    if (prevProps) {

      // check for queries from url
      const { location: prevLocation } = prevProps
      const { location: nextLocation } = this.props

      let prevQueries, nextQueries = null

      if (prevLocation && prevLocation.search) prevQueries = prevLocation.search
      if (nextLocation && nextLocation.search) nextQueries = nextLocation.search

      if (nextQueries) {
        const queries = queryString.parse(nextQueries);
        if (queries.q) options.query = queries.q;
        if (queries.category) options.category = queries.category;
        if (queries.client) options.client = queries.client;
      }

      if (prevQueries !== nextQueries) await this.setByQuery()
      if (prevQueries && !nextQueries) await this.setByDate(options)

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
        if ( startChange || endChange ) await this.setByDate(options)
      }
    } else {
      const { location } = this.props
      let query = null
      if (location && location.search) query = location.search
      if (query) {
        const queries = queryString.parse(query);
        if (queries.q) options.query = queries.q;
        if (queries.category) options.category = queries.category;
        if (queries.client) options.client = queries.client;
      }
      if (query) await this.setByQuery()
      if (!query) await this.setByDate(options)
    }

  }

  setByQuery = async() => {
    const { category, query } = this.state
    const queries = queryString.parse(this.props.location.search);
    // Category-Query-----------
    if (queries.category && queries.category !== category) {
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
    } else if (queries.q && (queries.q !== query)) {
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
    } else if (queries.client && queries.client !== this.state.client) {
      const clt = await client.findById(queries.client, this.ajaxOptions)
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

  setByDate = async(options) => {
    const { date: { start: s, end: e }, isDay, isMonth } = this.props
    const start = moment(s);
    const end = moment(e);
    let date = `${start.format('LL')} - ${end.format('LL')}`
    if (isDay()) date = `${start.format('LL')}`
    if (isMonth()) date = `${start.format('MMMM YYYY')}`
    let searchLabel = date

    if (options && options.category) searchLabel = `${options.category} - ${date}`
    if (options && options.client) searchLabel = `${options.client} - ${date}`
    if (options && options.query) searchLabel = `${options.query} - ${date}`

    this.ajaxOptions.sendCount = true
    this.setState(
    {
      events: [],
      ...options,
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

  setCalendarId = () => {
    const calendarId = localStorage.getItem('google_calendar_id');
    this.setState({ calendarId })
  }

  setTodaysDate = (props) => {
    const { handleDateChange } = this.props
    handleDateChange(moment(), 'day')
  }

  setCurrentMonth = () => {
    const { handleDateChange } = this.props
    handleDateChange(moment(), 'month')
  }

  setMonth = (month, year) => {
    const { handleDateChange } = this.props
    handleDateChange(moment(month, year), 'month')
  }

  refresh = async(value, url) => {
    const { history } = this.props

    if (value) {
      this.resetState()
      this.setCurrentMonth()
      this.setByDate()
    }
    history.push(url)
  }

  resetState = () => {
    this.setState({
      searchLabel: null,
      query: null,
      client: null,
      category: null,
      type: null,
    })
  }

  // -------------------------------CRUD----------------------------------------

  fetchEvents = async() => {
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

    } else {
      this.setState({ hasMore: false })
    }
  }

  addEvent = async(formData) => {
    const { calendarId } = this.state
    const { signout } = this.props
    let events = [...this.state.events]
    const newEvent = await event.create(formData, this.ajaxOptions)
    const newGoogleEvent = await GOOGLE.createEvent(calendarId, formatToGoogle(newEvent), signout)
    let formatted = await formatFromGoogle(newGoogleEvent, this.axiosRequestSource.token, signout)

    if (formatted.event_employees_attributes) {

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

    const evt = await event.update(newEvent.id, formatted, this.ajaxOptions)
    events.push(evt)
    events = events.sort((evtOne, evtTwo) => {
      return moment(evtOne.start).isBefore(moment(evtTwo.start))
    })
    this.setState({ events })
    return evt
  }

  deleteEvent = async(evt) => {
    const { calendarId } = this.state
    const { signout } = this.props
    let events = [...this.state.events]
    await event.delete(evt.id, this.ajaxOptions)
    if (evt.gcId) {
      await GOOGLE.deleteEvent(calendarId, evt.gcId, this.axiosRequestSource.token, signout)
    }
    events = events.filter( e => e.id !== evt.id)
    this.setState({ events })
  }

  updateEvent = async(e, data) => {
    const { calendarId } = this.state
    const { signout } = this.props
    if (e) {
      let events = [...this.state.events]
      let updatedEvent;
      if (data) {
        updatedEvent = await event.update(e.id, data, this.ajaxOptions)
      } else {
        updatedEvent = e
      }
      if (e.gcId) {
        await GOOGLE.patchEvent(calendarId, e.gcId, formatToGoogle(updatedEvent), null, this.axiosRequestSource.token, signout)
      } else if (this.state.calendarId) {
        const newGoogleEvent = await GOOGLE.createEvent(calendarId, formatToGoogle(updatedEvent), this.axiosRequestSource.token, signout)
        let formatted = await formatFromGoogle(newGoogleEvent, this.axiosRequestSource.token, signout)

        formatted = {
          ...data,
          ...formatted,
        }

        if (formatted.event_employees_attributes) {

          let update = formatted.event_employees_attributes.filter(ee => {

            if (formatted.employee_ids && formatted.employee_ids.length) {
              return formatted.employee_ids.find(id => ee.employee_id !== id)
            } else {
              return 1
            }

          })

          formatted.event_employees_attributes = update
        }
        updatedEvent = await event.update(e.id, formatted, this.ajaxOptions)
      }

      const index = events.findIndex((event) => event.id === e.id)
      events[index] = updatedEvent
      this.setState({ events })
      return updatedEvent
    }
  }

  updateEvents = async(data) => {
    const { events: evts, meta: { count } } = data
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
          return evt
        } else {
          return e
        }
      })

      const loadedEvents = await Promise.all(updatedEvents)
      loadedEvents.forEach(e => events.push(e))

      if (evts.length < this.itemsPerPage) {
        this.setState({
          events,
          hasMore: false,
        }, () => count? this.setState({ count }): null)

      } else {
        this.setState( prevState => ({
          events,
          hasMore: true,
          page: prevState.page + 1
        }), () => count? this.setState({ count }): null)
      }

    }
  }

  synchronizeWithGoogle = async (evt) => {
    const { calendarId } = this.state
    if (calendarId && evt.gcId) {
      const e = await GOOGLE.getEvent(calendarId, evt.gcId, this.ajaxOptions)
      const formatted = await formatFromGoogle(e, this.ajaxOptions)
      const synced = await event.sync(formatted, this.ajaxOptions)
      return synced
    }
  }

  // --------------------------Handle-Change------------------------------------

  handleStatusChange = async (evt, name, value) => {
    await this.updateEvent(evt, { [name]: value } )
  }

  onDateChange = async(date, type) => {
    const { handleDateChange } = this.props
    handleDateChange(date, type)
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
        columnHeaders: ['title', 'date', 'confirmation']
      })
    } else if (width < 900) {
      this.setState({
        columnHeaders: ['title', 'date', 'schedule', 'confirmation']
      })
    } else {
      this.setState({
        columnHeaders: ['title', 'date', 'intel', 'schedule', 'confirmation']
      })
    }
  }

  List = ({ match, history }) => {
    const { events, searchLabel } = this.state
    return (
      <ListPage
        {...this.props}
        {...this.state}

        mainHeader={searchLabel}
        data={events}

        match={match}
        history={history}

        load={this.fetchEvents}
        create={this.handleCreate}
        refresh={this.refresh}

        handleStatusChange={this.handleStatusChange}
        onDateChange={this.onDateChange}
        handleMonthChange={this.setMonth}
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
    if (events) {
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
