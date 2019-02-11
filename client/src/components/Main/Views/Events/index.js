import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import ListPage from '../../../ListPage/index.js'
import EventDetail from './EventDetail/index.js'
import moment from 'moment'
import { event } from '../../../../services/event'
import { eventTitle } from '../../../Helpers/eventTitle'

export default class Events extends Component {
  constructor(props){
    super(props)
    this.state = {
      events: [],
      hasMore: true,
      category: 'All',
      categories: ['Production', 'CANS', 'THC', 'CATP'],
      columnHeaders: ['title', 'client', 'location', 'confirmation', 'scheduled']
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

  componentDidMount() {
    this.updateColumnHeaders();
    window.addEventListener("resize", this.updateColumnHeaders);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateColumnHeaders);
  }

  fetchEvents = async(page) => {
    const evts = await event.getAll(page);
    await this.updateEvents(evts, 'All');
  }

  refreshEvents = async() => {
    this.resetEvents()
    const evts = await event.getAll(1);
    await this.updateEvents(evts, 'All')
  }

  addEvent = async(newEvent) => {
    let events = [...this.state.events]
    events.push(newEvent)
    events = events.sort((evtOne, evtTwo) => {
      return moment(evtOne.start).isBefore(evtTwo.start)
    })
    this.setState({ events })
    await this.refreshEvents()
  }

  deleteEvent = async(id) => {
    let events = [...this.state.events]
    events = events.filter(evt => evt.id !== id)
    this.setState({ events })
    await this.refreshEvents()
  }

  updateEvent = async(evt) => {
    let events = [...this.state.events]
    const id = events.findIndex((event) => event.id === evt.id)
    events[id] = evt
    this.setState({ events })
    await this.refreshEvents()
  }

  fetchEventsByCategory = async(category) => {
    const evts = await event.findByCategory(category);
    this.resetEvents()
    await this.updateEvents(evts, category);
  }

  updateEvents = async(evts, category) => {
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
          category: category,
          hasMore: false
        })
      } else {
        this.setState({
          events,
          category: category
        })
      }
    } else {
      this.setState({
        events: [],
        category: category
      })
    }
  }

  resetEvents = async() => {
    this.setState({ events: [] })
  }

  List = ({ match }) => {
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
        load={this.fetchEvents}
        hasMore={hasMore}
        create={this.handleCreate}
        refresh={this.refreshEvents}
        fetchByCategory={this.fetchEventsByCategory}
      />
    )
  }

  Show = ({ match, history }) => {
    const req_id = parseInt(match.params.id)
    const events = this.state.events
    const e = events.find(event => event.id === req_id)
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
