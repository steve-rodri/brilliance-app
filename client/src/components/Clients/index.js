import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import Header from '../Header/index.js'
import ListPage from '../ListPage/index.js'
import { client } from '../../services/client'
import { clientName } from '../Helpers/clientName'

export default class Clients extends Component {
  constructor(props){
    super(props)
    this.state = {
      clients: [],
      category: 'All',
      hasMore: true,
      formData: null
    }
  }

  fetchClients = async(page) => {
    const clients = await client.getAll(page);
    this.updateClients(clients, "All")
  }

  refreshClients = async() => {
    this.resetClients()
    const clients = await client.getAll(1);
    await this.updateClients(clients, "All");
  }

  addClient =  async(newClient) => {
    let clients = [...this.state.clients]
    clients.push(newClient)
    clients = this.sortClients(clients)
    this.setState({ clients })
    await this.refreshClients()
  }

  sortClients = (clients) => {
    clients.sort((cltOne, cltTwo) => {
      if ( clientName(cltOne) < clientName(cltTwo) ) { return -1;}
      if ( clientName(cltOne) > clientName(cltTwo) ) { return 1;}
      return 0;
    })
    return clients
  }

  deleteClient = async(id) => {
    let clients = [...this.state.clients]
    clients = clients.filter(clt => clt.id !== id)
    this.setState({ clients })
    await this.refreshClients()
  }

  updateClient = async(clt) => {
    let clients = [...this.state.clients]
    const id = clients.findIndex((client) => client.id === clt.id)
    clients[id] = clt
    this.setState({ clients })
    await this.refreshClients()
  }

  fetchClientsByCategory = async(category) => {
    const loadedClients = await client.findByCategory(category);
    this.resetClients()
    this.updateClients(loadedClients, category)
  }

  updateClients = (clts, category) => {
    if (clts) {
      let clients = [...this.state.clients]
      clts.forEach(c => clients.push(c))
      clients = this.sortClients(clients)
      if (clients.length < 25) {

        this.setState({
          clients,
          category: category,
          hasMore: false
        })
      } else {
        this.setState({
          clients,
          category: category
        })
      }
    } else {
      this.setState({
        clients: [],
        category: category
      })
    }
  }

  resetClients = () => {
    this.setState({ clients: [] })
  }

  List = ({ match, history }) => {
    const { clients, category, hasMore } = this.state
    return (
      <ListPage
        title="Clients"
        category={category}
        categories={['Production', 'CANS', 'THC', 'CATP']}
        subtitles={['name / company', 'contact info', 'next event', 'balance']}
        data={clients}
        match={match}
        history={history}
        load={this.fetchClients}
        hasMore={hasMore}
        refresh={this.refreshClients}
        fetchByCategory={this.fetchClientsByCategory}
      />
    )
  }

  Show = ({ match, history }) => {
    const { clients, category, hasMore } = this.state
    let client;
    if (match.params.id) {
      const req_id = parseInt(match.params.id)
      client = clients.find(clt => clt.id === req_id)
    }
    return (
      <ListPage
        title="Clients"
        category={category}
        categories={['Production', 'CANS', 'THC', 'CATP']}
        subtitles={['name / company', 'contact info', 'next event', 'balance']}
        modalData={client}
        data={clients}
        match={match}
        history={history}
        load={this.fetchClients}
        hasMore={hasMore}
        refresh={this.refreshClients}
        fetchByCategory={this.fetchClientsByCategory}
      />
    )
  }

  Create = ({ match, history }) => {
    const { clients, category, hasMore } = this.state
    return (
      <ListPage
        createNew={true}
        formData={this.state.formData}
        title="Clients"
        category={category}
        categories={['Production', 'CANS', 'THC', 'CATP']}
        subtitles={['name / company', 'contact info', 'next event', 'balance']}
        modalData={client}
        data={clients}
        match={match}
        history={history}
        load={this.fetchClients}
        hasMore={hasMore}
        refresh={this.refreshClients}
        fetchByCategory={this.fetchClientsByCategory}
      />
    )
  }

  render(){
    const { location, match } = this.props
    return (
      <div className="Section">
        <Header location={location} />

        <Switch>
          <Route exact path={match.path} render={(props) => this.List(props)}/>
          <Route exact path={`${match.path}/new`} render={(props) => this.Create(props)}/>
          <Route exact path={`${match.path}/:id`} render={(props) => this.Show(props)}/>
        </Switch>
      </div>
    )
  }
}
