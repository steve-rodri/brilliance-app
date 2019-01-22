import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import Header from '../Header/index.js'
import ListPage from '../ListPage/index.js'
import EventDetail from './EventDetail/index.js'
import { event } from '../../services/event'
import { eventTitle } from './Helpers/eventTitle'
import './index.css'

export default class Events extends Component {
  constructor(props){
    super(props)
    this.state = {
      events: [],
      hasMore: true
    }
  }

  fetchEvents = async(page) => {
    const evts = await event.getAll(page);
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
      this.setState({ events })
    }
  }

  fetchEventsByCategory = async(category) => {
    const evts = await event.findByCategory(category);
    const updatedEvents = evts.map( async(e) => {
      if (!e.summary) {
        e.summary = eventTitle(e)
        await event.update(e.id, {summary: e.summary})
      }
      return e
    })
    const events = await Promise.all(updatedEvents)
    this.setState({ events })
  }

  List = ({ match }) => {
    const { events, hasMore } = this.state
    return (
      <ListPage
        title="Events"
        categories={['All', 'Production', 'CANS', 'THC', 'CATP']}
        subtitles={['title', 'client', 'location', 'confirmation', 'scheduled']}
        data={events}
        match={match}
        load={this.fetchEvents}
        hasMore={hasMore}
        create={this.handleCreate}
        fetchAllEvents={this.fetchEvents}
        fetchByCategory={this.fetchEventsByCategory}
      />
    )
  }

  Show = ({ match }) => {
    const req_id = parseInt(match.params.id)
    const events = this.state.events
    const e = events.find(event => event.id === req_id)
    return (
      <EventDetail
        e={e}
        eventId={req_id}
        fetchAllEvents={this.fetchEvents}
      />
    )
  }

  Create = ({ match }) => {
    const isNew = match.path === '/admin/events/new'
    return (
      <EventDetail
        isNew={isNew}
        fetchAllEvents={this.fetchEvents}
      />
    )
  }

  render(){
    const { location, match } = this.props
    return (
      <div className='Section'>
        <Header location={location}/>

        <Switch>
          <Route exact path={match.path} render={(props) => this.List(props)}/>
          <Route exact path={`${match.path}/new`} render={(props) => this.Create(props)}/>
          <Route path={`${match.path}/:id`} render={(props) => this.Show(props)}/>
        </Switch>
      </div>
    )
  }
}
