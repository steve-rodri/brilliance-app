import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import queryString from 'query-string'
import ListPage from '../../../ListPage/index.js'
import EventDetail from './EventDetail/index.js'
import moment from 'moment'
import { GOOGLE } from '../../../../services/google_service'
import { formatToGoogle, formatFromGoogle } from '../../../Helpers/googleFormatters'
import { event } from '../../../../services/event'
import { eventTitle } from '../../../Helpers/eventTitle'

export default class Events extends Component {
  constructor(props){
    super(props)
    this.state = {
      events: null,
      hasMore: true,
      category: 'All',
      categories: ['Production', 'CANS', 'THC', 'CATP'],
      columnHeaders: ['title', 'client', 'location', 'confirmation', 'scheduled'],
      page: 1
    }
  }

  updateColumnHeaders = (e) => {
    const width = window.innerWidth
    if (width < 500) {
      this.setState({
        columnHeaders: null
      })
    } else if (width < 700) {
      this.setState({
        columnHeaders: ['title', 'scheduled', 'confirmation']
      })
    } else if (width < 900) {
      this.setState({
        columnHeaders: ['title', 'client', 'scheduled', 'confirmation']
      })
    } else {
      this.setState({
        columnHeaders: ['title', 'client', 'location', 'scheduled', 'confirmation']
      })
    }
  }

  componentWillReceiveProps(nextProps){
    this.setEvents(nextProps)
  }

  componentDidMount() {
    this.updateColumnHeaders();
    window.addEventListener("resize", this.updateColumnHeaders);
    const gcId = localStorage.getItem('google_calendar_id');
    this.setState({ gcId })
    this.setEvents(this.props)
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateColumnHeaders);
  }

  setEvents = async(props) => {
    const { category } = this.state
    const queries = queryString.parse(props.location.search)

    if (queries.category && queries.category !== category) {

      this.setState(
      {
        category: queries.category,
        query: null,
        page: 1
      },
        async () => {
        await this.resetEvents()
        await this.fetchEvents()
      })

    } else if (queries.q) {

      this.setState(
      {
        query: queries.q,
        category: queries.q,
        page: 1
      },
        async () => {
        await this.resetEvents()
        await this.fetchEvents()
      })

    } else {
      this.setState(
      {
        query: null,
        category: 'All',
        page: 1
      },
        async () => {
        await this.resetEvents()
        await this.fetchEvents()
      })
    }
  }

  fetchEvents = async() => {
    const { page, category, query } = this.state
    let evts;
    if (query) {
      evts = await event.find(page, query)
    } else {
      evts = await event.getAll(page, category);
    }
    this.incrementPage()
    await this.updateEvents(evts);
  }

  resetPage = () => {
    this.setState({ page: 1 })
  }

  incrementPage = () => {
    this.setState(prevState => ({
      page: prevState.page +1
    }))
  }

  addEvent = async(formData) => {
    const { gcId } = this.state
    let events = [...this.state.events]
    const newEvent = await event.createNew(formData)
    const newGoogleEvent = await GOOGLE.createEvent(gcId, formatToGoogle(newEvent))
    let formatted = await formatFromGoogle(newGoogleEvent)

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

    const evt = await event.update(newEvent.id, formatted)
    events.push(evt)
    events = events.sort((evtOne, evtTwo) => {
      return moment(evtOne.start).isBefore(moment(evtTwo.start))
    })
    this.setState({ events })
    return evt
  }

  deleteEvent = async(evt) => {
    const { gcId } = this.state
    await event.delete(evt.id)
    if (evt.gcId) {
      await GOOGLE.deleteEvent(gcId, evt.gcId)
    }
  }

  updateEvent = async(e, data) => {
    const { gcId } = this.state
    if (e) {
      let events = [...this.state.events]
      let updatedEvent;
      if (data) {
        updatedEvent = await event.update(e.id, data)
      } else {
        updatedEvent = e
      }
      //FIX ISSUE
      if (e.gcId) {
        await GOOGLE.patchEvent(gcId, e.gcId, formatToGoogle(updatedEvent))
      } else {
        const newGoogleEvent = await GOOGLE.createEvent(gcId, formatToGoogle(updatedEvent))
        let formatted = await formatFromGoogle(newGoogleEvent)

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
        updatedEvent = await event.update(e.id, formatted)
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
          await event.update(e.id, {summary: e.summary})
        }
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

  changeCategory = (category) => {
    this.setCategory(category);
    this.resetEvents();
  }

  setCategory = (category) => {
    if (category) {
      this.setState({ category })
    }
  }

  resetEvents = async() => {
    this.setState({ events: [] })
  }

  setRefresh = (value, url) => {
    const { history } = this.props
    this.setState({ willRefresh: value }, () => {
      if (url) {
        history.push(url)
      }
    })
  }

  handleStatusChange = async (evt, name, value) => {
    await this.updateEvent(evt, { [name]: value } )
  }

  synchronizeWithGoogle = async (evt) => {
    const gcId = localStorage.getItem('google_calendar_id');
    if (evt.gcId) {
      const e = await GOOGLE.getEvent(gcId, evt.gcId)
      const formatted = await formatFromGoogle(e)
      const synced = await event.sync(formatted)
      return synced
    }
  }

  List = ({ match, history }) => {
    const { events, category, categories, columnHeaders, hasMore } = this.state
    return (
      <ListPage
        title="Events"
        type="Events"
        category={category}
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
      />
    )
  }

  Show = ({ match, history }) => {
    const req_id = parseInt(match.params.id)
    const events = this.state.events
    let e;
    if (events) {
      e = events.find(event => event.id === req_id)
    }
    return (
      <EventDetail
        e={e}
        evtId={req_id}
        match={match}
        history={history}
        handleDelete={this.deleteEvent}
        handleUpdate={this.updateEvent}
      />
    )
  }

  Create = ({ match, history }) => {
    const isNew = match.path === '/admin/events/new'
    return (
      <EventDetail
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
