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
      newEvent: null
    }
  }

  async componentDidMount(){
    await this.fetchAllEvents()
    this.setState( { newEvent: null })
  }

  fetchAllEvents = async() => {
    const evts = await event.getAll();
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
    const { events } = this.state
    return (
      <ListPage
        title="Events"
        categories={['All', 'Production', 'CANS', 'THC', 'CATP']}
        subtitles={['title', 'client', 'location', 'confirmation', 'scheduled']}
        data={events}
        create={this.handleCreate}
        match={match}
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
        fetchAllEvents={this.fetchAllEvents}
      />
    )
  }

  Create = ({ match }) => {
    const isNew = match.path === '/admin/events/new'
    return (
      <EventDetail
        isNew={isNew}
        fetchAllEvents={this.fetchAllEvents}
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
