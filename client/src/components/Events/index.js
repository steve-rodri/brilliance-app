import React, { Component } from 'react'
import Header from '../Header/index.js'
import ListPage from '../ListPage/index.js'
import { event } from '../../services/event'

export default class Events extends Component {
  constructor(props){
    super(props)
    this.state = {

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

  render(){
    return (
      <div className="ListPage">
        <Header removeUser={this.props.removeUser}/>
        <ListPage
          title="Events"
          categories={['All', 'Production', 'CANS', 'THC', 'CATP']}
          subtitles={['title', 'client', 'location', 'confirmation', 'scheduled']}
          events={this.state.events}
        />
      </div>
    )
  }
}
