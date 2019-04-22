import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import ListPage from '../../../ListPage/index.js'
import EventDetail from './EventDetail/index.js'
import { GOOGLE } from '../../../../services/google_service'
import { formatToGoogle, formatFromGoogle } from '../../../Helpers/googleFormatters'
import { event } from '../../../../services/event'
import { client } from '../../../../services/client'
import { clientName } from '../../../Helpers/clientHelpers'
import { eventTitle } from '../../../Helpers/eventTitle'
import queryString from 'query-string'
import moment from 'moment'
import axios from 'axios'

export default class Events extends Component {
  constructor(props){
    super(props)
    this.state = {
      events: null,
      hasMore: true,
      category: 'Upcoming',
      categories: ['Production', 'CANS', 'THC', 'CATP'],
      page: 1
    }
    this.axiosRequestSource = axios.CancelToken.source()
  }

  // ----------------------------Lifecycle--------------------------------------

  async componentWillReceiveProps(nextProps){
    // await this.setEvents(nextProps)
  }

  async componentDidMount() {
    await this.setColumnHeaders()
    await this.setTodaysDate(this.props)
    await this.setCalendarId()
    await this.setEvents(this.props)
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateColumnHeaders);
    this.axiosRequestSource && this.axiosRequestSource.cancel()
  }

  // -----------------------Getters-and-Setters---------------------------------

  setEvents = async(props) => {
    if (props && props.location && props.location.search) {
      await this.setByQuery(props)
    } else {
      await this.setByDate()
    }
  }

  setByQuery = async(props) => {
    const category = this.state.category;
    const queries = queryString.parse(props.location.search);

    // Category-Query-----------
    if (queries.category && queries.category !== category) {
      this.setState(
      {
        searchLabel: queries.category,
        category: queries.category,
        query: null,
        client: null,
        page: 1
      },
        async () => {
        await this.resetEvents()
        await this.fetchEvents()
      })

    // Search-Query-----------
    } else if (queries.q) {
      this.setState(
      {
        searchLabel: queries.q,
        category: null,
        query: queries.q,
        client: null,
        page: 1
      },
        async () => {
        await this.resetEvents()
        await this.fetchEvents()
      })

    // Client-Query-----------
    } else if (queries.client) {
      const clt = await client.findById(queries.client, this.axiosRequestSource.token)
      this.setState(
      {
        searchLabel: clientName(clt),
        category: null,
        query: null,
        client: queries.client,
        page: 1
      },
        async () => {
        await this.resetEvents()
        await this.fetchEvents()
      })
    }
  }

  setByDate = async() => {
    const { date: { start, end } } = this.state
    const isDay = moment(start).isSame(moment(end), 'day')
    let date = `${moment(start).format('LL')} - ${moment(end).format('LL')}`
    if (isDay) date = `${moment(start).format('LL')}`

    this.setState(
    {
      searchLabel: date,
      category: null,
      query: null,
      client: null,
      page: 1
    },
      async () => {
      await this.resetEvents()
      await this.fetchEvents()
    })
  }

  resetEvents = async() => {
    this.setState({ events: [] })
  }

  resetPage = () => {
    this.setState({ page: 1 })
  }

  incrementPage = () => {
    this.setState(prevState => ({
      page: prevState.page +1
    }))
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
    const { date } = props
    this.setState({ date })
  }

  setRefresh = (value, url) => {
    const { history } = this.props
    this.setState({ willRefresh: value }, () => {
      if (url) {
        history.push(url)
      }
    })
  }

  // -------------------------------CRUD----------------------------------------

  fetchEvents = async() => {
    const { page, date: { start, end }, category, query, client } = this.state
    let evts;
    if (query) {
      evts = await event.find(page, query, this.axiosRequestSource.token)
    } else if (client) {
      evts = await event.findByClient(page, client, this.axiosRequestSource.token)
    } else if (category) {
      evts = await event.getAll(page, category, this.axiosRequestSource.token);
    } else {
      evts = await event.findByDate(page, start, end, this.axiosRequestSource.token)
    }
    if (evts && evts.length) {
      await this.updateEvents(evts);
      await this.incrementPage()
    } else {
      this.setState({ hasMore: false })
    }
  }

  addEvent = async(formData) => {
    const { calendarId } = this.state
    let events = [...this.state.events]
    const newEvent = await event.createNew(formData, this.axiosRequestSource.token)
    const newGoogleEvent = await GOOGLE.createEvent(calendarId, formatToGoogle(newEvent))
    let formatted = await formatFromGoogle(newGoogleEvent, this.axiosRequestSource.token)

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

    const evt = await event.update(newEvent.id, formatted, this.axiosRequestSource.token)
    events.push(evt)
    events = events.sort((evtOne, evtTwo) => {
      return moment(evtOne.start).isBefore(moment(evtTwo.start))
    })
    this.setState({ events })
    return evt
  }

  deleteEvent = async(evt) => {
    const { calendarId } = this.state
    let events = [...this.state.events]
    await event.delete(evt.id, this.axiosRequestSource.token)
    if (evt.gcId) {
      await GOOGLE.deleteEvent(calendarId, evt.gcId, this.axiosRequestSource.token)
    }
    events = events.filter( e => e.id !== evt.id)
    this.setState({ events })
  }

  updateEvent = async(e, data) => {
    const { calendarId } = this.state
    if (e) {
      let events = [...this.state.events]
      let updatedEvent;
      if (data) {
        updatedEvent = await event.update(e.id, data, this.axiosRequestSource.token)
      } else {
        updatedEvent = e
      }
      if (e.gcId) {
        await GOOGLE.patchEvent(calendarId, e.gcId, formatToGoogle(updatedEvent), null, this.axiosRequestSource.token)
      } else if (this.state.calendarId) {
        const newGoogleEvent = await GOOGLE.createEvent(calendarId, formatToGoogle(updatedEvent), this.axiosRequestSource.token)
        let formatted = await formatFromGoogle(newGoogleEvent, this.axiosRequestSource.token)

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
        updatedEvent = await event.update(e.id, formatted, this.axiosRequestSource.token)
      }

      const index = events.findIndex((event) => event.id === e.id)
      events[index] = updatedEvent
      this.setState({ events })
      return updatedEvent
    }
  }

  updateEvents = async(evts) => {
    if (evts) {
      const updatedEvents = evts.map( async(e) => {
        if (!e.summary) {
          e.summary = eventTitle(e)
          await event.update(e.id, {summary: e.summary}, this.axiosRequestSource.token)
        }
        console.log(e.id, e.start, "/", moment(e.start).format(), "/", moment(e.start).toISOString(true), "/", moment(e.start).toISOString())
        const evt = await this.synchronizeWithGoogle(e)
        if (evt) {
          return evt
        } else {
          return e
        }
      })
      const loadedEvents = await Promise.all(updatedEvents)
      const events = [...this.state.events]
      loadedEvents.forEach(e => events.push(e))

      if (loadedEvents.length < 25) {
        this.setState({
          events,
          hasMore: false
        })

      } else {

        this.setState({
          events,
          hasMore: true
        })
      }

    } else {
      this.setState({
        events: [],
      })
    }
  }

  synchronizeWithGoogle = async (evt) => {
    const { calendarId } = this.state
    if (calendarId && evt.gcId) {
      const e = await GOOGLE.getEvent(calendarId, evt.gcId, this.axiosRequestSource.token)
      const formatted = await formatFromGoogle(e, this.axiosRequestSource.token)
      const synced = await event.sync(formatted, this.axiosRequestSource.token)
      return synced
    }
  }

  // --------------------------Handle-Change------------------------------------

  handleStatusChange = async (evt, name, value) => {
    await this.updateEvent(evt, { [name]: value } )
  }

  handleDateChange = async(date) => {
    this.setState( prevState => ({
      date: {
        start: moment(date).startOf('day').toISOString(true),
        end:  moment(date).startOf('day').add(1, 'days').toISOString(true)
      }
    }),
    () =>  this.setEvents())
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
    const { events, searchLabel, categories, columnHeaders, hasMore } = this.state
    return (
      <ListPage
        {...this.state}
        title="Events"
        type="Events"
        category={searchLabel}
        categories={categories}
        columnHeaders={columnHeaders}
        data={events}
        match={match}
        history={history}
        hasMore={hasMore}
        load={this.fetchEvents}
        create={this.handleCreate}
        refresh={this.setRefresh}
        handleStatusChange={this.handleStatusChange}
        handleDateChange={this.handleDateChange}
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
    const isNew = match.path === '/admin/events/new'
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
