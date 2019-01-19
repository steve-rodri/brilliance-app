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
      newEvent: null
    }
  }

  async componentDidMount(){
    await this.fetchAllEvents()
    this.setState( { newEvent: null })
  }

  fetchAllEvents = async() => {
    const events = await event.getAll();
    this.setState({ events })
  }

  handleDelete = async(id) => {
    await event.delete(id);
    this.setState({ newEvent: null })
    await this.fetchAllEvents();
  }

  handleCreate = async() => {
    const resp = await event.createNew();
    this.setState({
      newEvent: resp.data
    })
  }

  List = () => {
    const { events } = this.state
    const { newEvent } = this.state
    return (
      <ListPage
        title="Events"
        categories={['All', 'Production', 'CANS', 'THC', 'CATP']}
        subtitles={['title', 'client', 'location', 'confirmation', 'scheduled']}
        data={events}
        create={this.handleCreate}
        newRecord={newEvent}
        match={this.props.match}
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
    return (
      <div className='Section'>
        <Header location={location}/>

        <Route exact path={match.path} render={this.List}/>
        <Route exact path={`${match.path}/:id`} render={this.Show}/>
        <Route exact path={`${match.path}/new`} render={this.Show}/>
      </div>
    )
  }
}
