import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'
import Header from '../Header/index.js'
import ListPage from '../ListPage/index.js'
import EventDetail from './EventDetail/index.js'
import { event } from '../../services/event'
import './index.css'

export default class Events extends Component {
  constructor(props){
    super(props)
    this.state = {
      events: [],
      newEvent: false
    }
  }

  async componentDidMount(){
    await this.fetchAllEvents()
  }

  fetchAllEvents = async() => {
    const events = await event.getAll();
    this.setState({ events })
  }

  handleDelete = async(id) => {
    await event.delete(id);
    await this.fetchAllEvents();
  }

  handleCreate = async() => {
    const resp = await event.createNew();
    const evts = [...this.state.events]
    evts.push(resp.data)
    this.setState({ events: evts }, () =>
      this.setState({ newEvent: resp.data })
    )
    window.location.reload();
  }

  List = () => {
    const { events } = this.state
    return (
      <ListPage
        title="Events"
        categories={['All', 'Production', 'CANS', 'THC', 'CATP']}
        subtitles={['title', 'client', 'location', 'confirmation', 'scheduled']}
        data={events}
        create={this.handleCreate}
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
        handleDelete={this.handleDelete}
        match={this.props.match}
        fetchAllEvents={this.fetchAllEvents}
      />
    )
  }

  render(){
    const { location, match } = this.props
    const { newEvent } = this.state
    if (newEvent) return (<Redirect to={`/admin/events/${newEvent.id}`}/>)
    return (
      <div className="ListPage">
        <Header location={location}/>

        <Route exact path={match.path} render={this.List}/>
        <Route exact path={`${match.path}/:id`} render={this.Show}/>
      </div>
    )
  }
}
