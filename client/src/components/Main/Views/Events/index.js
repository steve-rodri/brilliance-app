import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import queryString from 'query-string'
import ListPage from '../../../ListPage/index.js'
import EventDetail from './EventDetail/index.js'
import moment from 'moment'
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
        columnHeaders: ['title', 'confirmation']
      })
    } else if (width < 700) {
      this.setState({
        columnHeaders: ['title', 'confirmation', 'scheduled']
      })
    } else if (width < 900) {
      this.setState({
        columnHeaders: ['title', 'client', 'confirmation', 'scheduled']
      })
    } else {
      this.setState({
        columnHeaders: ['title', 'client', 'location', 'confirmation', 'scheduled']
      })
    }
  }

  componentWillReceiveProps(nextProps){
    this.setEvents(nextProps)
  }

  componentDidMount() {
    this.updateColumnHeaders();
    window.addEventListener("resize", this.updateColumnHeaders);
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
        category: 'All',
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

  addEvent = async(newEvent) => {
    let events = [...this.state.events]
    events.push(newEvent)
    events = events.sort((evtOne, evtTwo) => {
      return moment(evtOne.start).isBefore(evtTwo.start)
    })
    this.setState({ events })
  }

  deleteEvent = async(id) => {
    let events = [...this.state.events]
    events = events.filter(evt => evt.id !== id)
    this.setState({ events })
  }

  updateEvent = async(evt) => {
    let events = [...this.state.events]
    const id = events.findIndex((event) => event.id === evt.id)
    events[id] = evt
    this.setState({ events })
  }

  updateEvents = async(evts) => {
    if (evts) {
      const updatedEvents = evts.map( async(e) => {
        if (!e.summary) {
          e.summary = eventTitle(e)
          await event.update(e.id, {summary: e.summary})
        }
        return e
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

  handleStatusChange = async (id, name, value) => {
    let events = [...this.state.events]
    if (events) {
      const evt = events.find((event) => event.id === id)
      evt[name] = value;
      this.setState({ events })
      await event.update(id, { [name]: value } )
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
        subtitles={columnHeaders}
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
        <Route path={`${match.path}/new`} render={ props => this.Create(props)} />
        <Route path={`${match.path}/:id`} render={ props => this.Show(props)} />
      </Switch>
    )
  }
}

// async fetchAllGoogleEvents(){
//   const calendars = await getGoogleCalendars();
//   const jobsCalendar = calendars.find(calendar => calendar.summary = 'Jobs' && calendar.id.includes('bob@brilliancepro.com'))
//   const events = await getGoogleEvents(jobsCalendar.id)
// }
//
// async mergeGoogleCalendar(){
//   const events = await this.fetchAllGoogleEvents()
// }
