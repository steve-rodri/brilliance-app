import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import Header from '../Header/index.js'
import ListPage from '../ListPage/index.js'
import EventDetail from '../EventDetail/index.js'
import { event } from '../../services/event'

export default class Events extends Component {
  constructor(props){
    super(props)
    this.state = {
      events: []
    }
  }

  async componentDidMount(){
    await this.fetchAllEvents()
  }

  fetchAllEvents = async() => {
    const events = await event.getAll();
    this.setState({
      events
    })
  }

  List = () => {
    const events = this.state.events
    return (
      <ListPage
        title="Events"
        categories={['All', 'Production', 'CANS', 'THC', 'CATP']}
        subtitles={['title', 'client', 'location', 'confirmation', 'scheduled']}
        data={events}
      />
    )
  }

  Show = ({ match }) => {
    const req_id = match.params.id
    const events = this.state.events
    const event = events.find(event => event.id = req_id)
    return (
      <EventDetail event={event}/>
    )
  }

  render(){
    const match = this.props.match
    return (
      <div className="ListPage">
        <Header />

        <Route exact path={match.path} render={this.List}/>
        <Route exact path={`${match.path}/:id`} render={this.Show}/>
      </div>
    )
  }
}
