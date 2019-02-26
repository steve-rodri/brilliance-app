import React, { Component, Fragment } from 'react'
import { Route, Switch } from 'react-router-dom'
import queryString from 'query-string'
import ListPage from '../../../ListPage/index.js'
import Modal from './Modal';
import { client } from '../../../../services/client'
import { clientName } from '../../../Helpers/clientHelpers'

export default class Clients extends Component {
  constructor(props){
    super(props)
    this.state = {
      clients: null,
      category: 'All',
      categories: ['Production','CANS', 'THC', 'CATP'],
      columnHeaders: ['name / company', 'contact info', 'next event', 'balance'],

      hasMoreClients: true,
      hasMoreEvents: true,
      events: null,
      hasMoreInvoices: true,
      invoices: null,

      searchFieldData: null,
      page: 1,

      willRefresh: true,
    }
  }

  updateColumnHeaders = (e) => {
    const width = window.innerWidth
    if (width < 500) {
      this.setState({
        columnHeaders: ['name / company', 'balance']
      })
    } else {
      this.setState({
        columnHeaders: ['name / company', 'next event', 'balance']
      })
    }
  }

  componentWillReceiveProps(nextProps){
    this.setClients(nextProps)
  }

  async componentDidMount() {
    this.updateColumnHeaders();
    window.addEventListener("resize", this.updateColumnHeaders);
    await this.setClients(this.props)
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateColumnHeaders);
  }

  componentWillUpdate(nextProps) {
    const { location } = this.props;
    // set previousLocation if props.location is not modal
    if (
      nextProps.history.action !== "POP" &&
      (!location.state || !location.state.modal)
    )
    {
      this.previousLocation = this.props.location;
    }

    this.prevLocation = nextProps.location
  }

  setClients = async(props) => {
    const { willRefresh } = this.state
    const { location } = props
    const queries = queryString.parse(location.search)

    if (!location.state && willRefresh) {

      if (queries.category) {
        this.setState(
        {
          category: queries.category,
          query: null,
          page: 1
        },
          async () => {
          await this.resetClients()
          await this.fetchClients()
        })

      } else if (queries.q) {

        this.setState(
        {
          query: queries.q,
          category: 'All',
          page: 1
        },
          async () => {
          await this.resetClients()
          await this.fetchClients()
        })

      } else {
        this.setState(
        {
          query: null,
          category: 'All',
          page: 1
        },
          async () => {
          await this.resetClients()
          await this.fetchClients()
        })
      }
    }
  }

  fetchClient = async(id) => {
    let clt;
    if (this.state.clients) {
      const clients = [...this.state.clients]
      clt = clients.find(c => c.id === id)
    }
    if (!clt) {
      clt = await client.findById(id);
    }
    return clt
  }

  fetchClients = async() => {
    const { page, category, query } = this.state
    let clients;
    if (query) {
      clients = await client.find(page, query)
    } else {
      clients = await client.getAll(page, category)
    }
    this.incrementPage()
    this.updateClients(clients)
  }

  resetPage = () => {
    this.setState({ page: 1})
  }

  incrementPage = () => {
    this.setState(prevState => ({
      page: prevState.page + 1
    }))
  }

  fetchClientEvents = async(page, clientId) => {
    const events = await client.getEvents(page, clientId)
    this.updateEvents(events)
  }

  refreshClients = async() => {
    this.resetClients()
    const clients = await client.getAll(1, "All");
    this.updateClients(clients);
    this.setCategory('All');
  }

  addClient =  async(newClient) => {
    let clients = [...this.state.clients]
    clients.push(newClient)
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

  createClient = async(data) => {
    console.log(data)
    const clt = await client.create(data);
    await this.addClient(clt)
    return clt;
  }

  deleteClient = async(id) => {
    await client.delete(id)
    let clients = [...this.state.clients]
    clients = clients.filter(clt => clt.id !== id)
    this.setState({ clients })
    await this.refreshClients()
  }

  updateClient = async(id, data) => {
    let clt = await client.update(id, data);
    let clients = [...this.state.clients]
    const clientId = clients.findIndex((client) => client.id === clt.id)
    clients[clientId] = clt
    this.setState({ clients })
    this.refreshClients()
  }

  updateClients = (clts) => {
    const { match } = this.props

    if (clts && clts.length) {

      let clients = [...this.state.clients]
      clts.forEach(c => clients.push(c))

      if (clts.length < 25 ) {

        if (clts.length === 1) {
          this.setState({
            clients,
            hasMoreClients: false
          },() => {
            this.setRefresh(false, `${match.url}/${clients[0].id}` )
            this.handleModal(true)
          })
        } else {
          this.setState({
            clients,
            hasMoreClients: false
          })
        }

      } else {
        this.setState({
          clients,
          hasMoreClients: true
        })
      }

    } else {
      this.setState({
        clients: null,
      })
    }
  }

  changeCategory = (category) => {
    this.setCategory(category);
    this.resetClients();
  }

  setCategory = (category) => {
    if (category) {
      this.setState({ category })
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

  resetClient = () => {
    this.setState({ client: null })
  }

  resetClients = () => {
    this.setState({ clients: [] })
  }

  setRefresh = (value, url) => {
    const { history } = this.props
    this.setState({ willRefresh: value }, () => {
      if (url) {
        history.push(url)
      }
    })
  }

  handleModal = (value) => {
    this.setState({ showModal: value })
  }

  List = ({ match, history }) => {
    const { clients, category, categories, columnHeaders, hasMoreClients } = this.state
    return (
      <ListPage
        title="Clients"
        type="Clients"
        category={category}
        categories={categories}
        columnHeaders={columnHeaders}
        data={clients}
        match={match}
        history={history}
        load={this.fetchClients}
        hasMore={hasMoreClients}
        deleteClient={this.deleteClient}
        showModal={() => this.handleModal(true)}
        refresh={this.setRefresh}
      />
    )
  }

  Show = (props, previousLocation) => {
    const { match, history, location } = props
    const reqId = parseInt(match.params.id)
    return (
      <Modal
        type="Show"
        clt={() => this.fetchClient(reqId)}
        match={match}
        history={history}
        location={location}
        prevLocation={previousLocation}
        doNotRefresh={() => this.setRefresh(false)}
        closeModal={() => this.handleModal(false)}
      />
    )
  }

  Create = (props, previousLocation) => {
    const { match, history, location } = props
    return (
      <Modal
        type="Create"
        create={this.createClient}
        match={match}
        history={history}
        location={location}
        prevLocation={previousLocation}
        doNotRefresh={() => this.setRefresh(false)}
        closeModal={() => this.handleModal(false)}
      />
    )
  }

  ListEvents = async({ match, history }) => {
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
        columnHeaders={['title', 'location', 'confirmation', 'scheduled']}
        data={events}
        match={match}
        history={history}
        refresh={() => this.setRefresh(true)}
        load={(page) => this.fetchClientEvents(page, client.id)}
        hasMore={hasMoreEvents}
      />
    )
  }

  previousLocation = this.props.location;
  render(){
    const { match, location } = this.props
    const isModal = !!(
      location.state &&
      location.state.modal &&
      this.previousLocation !== location
    ) || this.state.showModal;
    return (
      <Fragment>

        <Switch location={isModal? this.previousLocation: location}>
          <Route exact path={match.path} render={(props) => this.List(props)}/>
          <Route exact path={`${match.path}/new`} render={(props) => this.List(props)}/>
          <Route exact path={`${match.path}/:id`} render={(props) => this.List(props)}/>
          <Route exact path={`${match.path}/:id/events`} render={(props) => this.ListEvents(props)}/>
        </Switch>

        {isModal?
          <Switch>
            <Route exact path={`${match.path}/new`} render={(props) => this.Create(props, this.previousLocation)}/>
            <Route exact path={`${match.path}/:id`} render={(props) => this.Show(props, this.previousLocation)}/>
          </Switch>
          :
          null
        }

      </Fragment>
    )
  }
}
