import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import ListPage from '../ListPage/index.js'
import { client } from '../../services/client'
import { clientName } from '../Helpers/clientHelpers'

export default class Clients extends Component {
  constructor(props){
    super(props)
    this.state = {
      clients: [],
      category: 'All',
      categories: ['Production', 'CANS', 'THC', 'CATP'],
      columnHeaders: ['name / company', 'contact info', 'next event', 'balance'],

      hasMoreClients: true,
      formData: null,
      events: [],
      hasMoreEvents: true,
      invoices: [],
      hasMoreInvoices: true,
    }
  }

  updateColumnHeaders = (e) => {
    const width = window.innerWidth
    if (width < 500) {
      this.setState({
        columnHeaders: ['name / company', 'balance']
      })
    } else if (width < 700) {
      this.setState({
        columnHeaders: ['name / company', 'next event', 'balance']
      })
    } else {
      this.setState({
        columnHeaders: ['name / company', 'contact info', 'next event', 'balance']
      })
    }
  }

  componentDidMount() {
    this.updateColumnHeaders();
    window.addEventListener("resize", this.updateColumnHeaders);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateColumnHeaders);
  }

  fetchClients = async(page) => {
    const clients = await client.getAll(page);
    this.updateClients(clients, "All")
  }

  fetchClientEvents = async(page, clientId) => {
    const events = await client.getEvents(page, clientId)
    this.updateEvents(events)
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
          hasMoreClients: false
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

  updateEvents = (evts) => {
    if (evts) {
      let events = [...this.state.events]
      evts.forEach(e => events.push(e))
      if (events.length < 25) {

        this.setState({
          events,
          hasMoreEvents: false
        })
      } else {
        this.setState({ events })
      }
    } else {
      this.setState({ events: [] })
    }
  }

  resetClients = () => {
    this.setState({ clients: [] })
  }

  List = ({ match, history }) => {
    const { clients, category, categories, columnHeaders, hasMoreClients } = this.state
    return (
      <ListPage
        title="Clients"
        type="Clients"
        category={category}
        categories={categories}
        subtitles={columnHeaders}
        data={clients}
        match={match}
        history={history}
        load={this.fetchClients}
        hasMore={hasMoreClients}
        refresh={this.refreshClients}
        fetchByCategory={this.fetchClientsByCategory}
      />
    )
  }

  Show = ({ match, history }) => {
    const { clients, category, categories, columnHeaders, hasMoreClients } = this.state
    let client;
    if (match.params.id) {
      const req_id = parseInt(match.params.id)
      client = clients.find(clt => clt.id === req_id)
    }
    return (
      <ListPage
        title="Clients"
        type="Clients"
        category={category}
        categories={categories}
        subtitles={columnHeaders}
        modalData={client}
        data={clients}
        match={match}
        history={history}
        load={this.fetchClients}
        hasMore={hasMoreClients}
        refresh={this.refreshClients}
        fetchByCategory={this.fetchClientsByCategory}
      />
    )
  }

  Create = ({ match, history }) => {
    console.log('create')
    const { clients, category, categories, columnHeaders, hasMoreClients } = this.state
    return (
      <ListPage
        createNew={true}
        formData={this.state.formData}
        title="Clients"
        type="Clients"
        category={category}
        categories={categories}
        subtitles={columnHeaders}
        data={clients}
        match={match}
        history={history}
        load={this.fetchClients}
        hasMore={hasMoreClients}
        refresh={this.refreshClients}
        fetchByCategory={this.fetchClientsByCategory}
      />
    )
  }

  ListEvents = async({ match, history }) => {
    console.log(match)
    const { clients, events, hasMoreEvents } = this.state
    let client;
    if (match.params.id) {
      const req_id = parseInt(match.params.id)
      client = clients.find(clt => clt.id === req_id)
    }
    return (
      <ListPage
        title={clientName(client)}
        type="Events"
        category="All"
        subtitles={['title', 'location', 'confirmation', 'scheduled']}
        data={events}
        match={match}
        history={history}
        load={(page) => this.fetchClientEvents(page, client.id)}
        hasMore={hasMoreEvents}
      />
    )
  }

  render(){
    const { match } = this.props
    return (
      <Switch>
        <Route exact path={match.path} render={(props) => this.List(props)}/>
        <Route exact path={`${match.path}/new`} render={(props) => this.Create(props)}/>
        <Route exact path={`${match.path}/:id`} render={(props) => this.Show(props)}/>
        <Route exact path={`${match.path}/:id/events`} render={(props) => this.ListEvents(props)}/>
      </Switch>
    )
  }
}
