import React, { Component } from 'react'
import Header from '../Header/index.js'
import ListPage from '../ListPage/index.js'
import { client } from '../../services/client'

export default class Clients extends Component {
  constructor(props){
    super(props)
    this.state = {

    }
  }

  async componentDidMount(){
    await this.fetchaAllClients()
  }

  fetchAllClients = async() => {
    const clients = await client.getAll();
    this.setState({
      clients
    })
  }

  render(){
    return (
      <div className="ListPage">
        <Header removeUser={this.props.removeUser}/>
        <ListPage
          title="Clients"
          categories={['All', 'Production', 'CANS', 'THC', 'CATP']}
          subtitles={['name / company', 'contact info', 'next event', 'balance']}
          invoices={this.state.clients}
        />
      </div>
    )
  }
}
