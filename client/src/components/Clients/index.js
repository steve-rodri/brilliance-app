import React, { Component } from 'react'
import Header from '../Header/index.js'
import ListPage from '../ListPage/index.js'
import { client } from '../../services/client'

export default class Clients extends Component {
  constructor(props){
    super(props)
    this.state = {
      clients: null
    }
  }

  async componentDidMount(){
    await this.fetchAllClients()
  }

  fetchAllClients = async() => {
    const clients = await client.getAll();
    this.setState({
      clients
    })
  }

  render(){
    const { location } = this.props
    const { clients } = this.state
    return (
      <div className="ListPage">
        <Header location={location} />
        <ListPage
          title="Clients"
          categories={['All', 'Production', 'CANS', 'THC', 'CATP']}
          subtitles={['name / company', 'contact info', 'next event', 'balance']}
          data={clients}
        />
      </div>
    )
  }
}
