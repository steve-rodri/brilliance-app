import React, { Component, Fragment } from 'react'
import { Route, Switch } from 'react-router-dom'
import queryString from 'query-string'
import ListPage from '../../../ListPage/index.js'
import Modal from './Modal';
import { client } from '../../../../services/BEP_APIcalls.js'
import { clientName } from '../../../../helpers/clientHelpers'
import axios from 'axios'

export default class Clients extends Component {
  constructor(props){
    super(props)
    this.state = {
      clients: null,
      category: null,
      hasMore: true,
      searchFieldData: null,
      page: 1,
      willRefresh: true,
    }
    this.axiosRequestSource = axios.CancelToken.source();
    this.ajaxOptions = {
      cancelToken: this.axiosRequestSource.token,
      unauthorizedCB: this.props.signout,
      sendCount: true
    }
  }

  updateColumnHeaders = (e) => {
    const width = window.innerWidth
    if (width < 500) {
      this.setState({
        columnHeaders: null
      })
    } else {
      this.setState({
        columnHeaders: ['name / company', '', 'next event', 'balance']
      })
    }
  }

  componentWillReceiveProps(nextProps){
    this.setClients(nextProps, 0)
  }

  async componentDidMount() {
    this.updateColumnHeaders();
    const { setView, setCategories, location, changeNav } = this.props
    if (location && location.state && !location.state.nav) changeNav(false)
    await setView('Clients')
    await setCategories(['CATP', 'THC', 'TANS', 'CANS'])
    window.addEventListener("resize", this.updateColumnHeaders);
    await this.setClients(this.props, 1)
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateColumnHeaders);
    this.axiosRequestSource && this.axiosRequestSource.cancel();
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

  setClients = async(props, mounted) => {
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

      } else if (mounted) {
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
      clt = await client.get(id, this.ajaxOptions);
    }
    return clt
  }

  fetchClients = async() => {
    const { page, category, query } = this.state
    let data;
    if (query) {
      data = await client.batch({ page, q:query }, this.ajaxOptions)
    } else {
      data = await client.batch({ page, category }, this.ajaxOptions)
    }
    if (data) {
      await this.updateClients(data)
      await this.incrementPage()
    }
  }

  resetPage = () => {
    this.setState({ page: 1})
  }

  incrementPage = () => {
    this.setState(prevState => ({
      page: prevState.page + 1
    }))
  }

  refreshClients = async() => {
    this.resetClients()
    const data = await client.batch(null ,this.ajaxOptions);
    this.updateClients(data);
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
    const clt = await client.create(data, this.ajaxOptions);
    await this.addClient(clt)
    return clt;
  }

  deleteClient = async(id) => {
    await client.delete(id, this.ajaxOptions)
    let clients = [...this.state.clients]
    clients = clients.filter(clt => clt.id !== id)
    this.setState({ clients })
    await this.refreshClients()
  }

  updateClient = async(id, data) => {
    let clt = await client.update(id, data, this.ajaxOptions);
    let clients = [...this.state.clients]
    const clientId = clients.findIndex((client) => client.id === clt.id)
    clients[clientId] = clt
    this.setState({ clients })
    this.refreshClients()
  }

  updateClients = (data) => {
    const { match } = this.props
    const { clients: clts, meta: { count }} = data

    if (clts && clts.length) {

      let clients = [...this.state.clients]
      clts.forEach(c => clients.push(c))

      if (clts.length < 25 ) {

        if (clts.length === 1) {
          this.setState({
            clients,
            hasMore: false,
            count
          },() => {
            this.setRefresh(false, `${match.url}/${clients[0].id}` )
            this.handleModal(true)
          })
        } else {
          this.setState({
            clients,
            hasMore: false,
            count
          })
        }

      } else {
        this.setState({
          clients,
          count,
          hasMore: true
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
    const { clients, hasMoreClients } = this.state
    return (
      <ListPage
        {...this.props}
        {...this.state}

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
