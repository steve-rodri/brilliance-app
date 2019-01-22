import React, { Component } from 'react'
import Header from '../Header/index.js'
import ListPage from '../ListPage/index.js'
import { client } from '../../services/client'

export default class Clients extends Component {
  constructor(props){
    super(props)
    this.state = {
      clients: [],
      hasMore: true
    }
  }

  fetchClients = async(page) => {
    const loadedClients = await client.getAll(page);
    this.updateClients(loadedClients)
  }

  fetchClientsByCategory = async(category) => {
    const loadedClients = await client.findByCategory(category);
    this.resetClients()
    this.updateClients(loadedClients)
  }

  updateClients = (clients) => {
    if (clients) {
      const clts = [...this.state.clients]
      clients.forEach(c => clts.push(c))

      if (clients.length < 25) {

        this.setState({
          clients,
          hasMore: false
        })
      } else {
        this.setState({ clients })
      }
    } else {
      this.resetClients()
    }
  }

  resetClients = () => {
    this.setState({clients: []})
  }

  render(){
    const { location } = this.props
    const { clients, hasMore } = this.state
    return (
      <div className="Section">
        <Header location={location} />
        <ListPage
          title="Clients"
          categories={['All', 'Production', 'CANS', 'THC', 'CATP']}
          subtitles={['name / company', 'contact info', 'next event', 'balance']}
          data={clients}
          load={this.fetchClients}
          hasMore={hasMore}
          fetchByCategory={this.fetchClientsByCategory}
        />
      </div>
    )
  }
}
