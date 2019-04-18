import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import queryString from 'query-string'
import ListPage from '../../../ListPage/index.js'
import InvoiceDetail from './InvoiceDetail/index.js'
import { invoice } from '../../../../services/invoice'
import { client } from '../../../../services/client'
import { clientName } from '../../../Helpers/clientHelpers'
import { price } from './InvoiceDetail/Invoice/Line/Helpers'
import axios from 'axios'
import moment from 'moment'

export default class Invoices extends Component {
  constructor(props){
    super(props)
    this.state = {
      invoices: [],
      category: 'Upcoming',
      categories: ['Production', 'CANS', 'THC', 'CATP'],
      columnHeaders: ['client & date', 'type', 'status', 'balance'],
      hasMore: true,
      page: 1
    }

    this.axiosRequestSource = axios.CancelToken.source()
  }

  updateColumnHeaders = (e) => {
    const width = window.innerWidth
    if (width < 500) {
      this.setState({
        columnHeaders: null
      })
    } else if (width < 700) {
      this.setState({
        columnHeaders: ['client & date', 'status', 'balance']
      })
    } else {
      this.setState({
        columnHeaders: ['client & date', 'type', 'status', 'balance']
      })
    }
  }

  componentWillReceiveProps(nextProps){
    this.setInvoices(nextProps, 0)
  }

  async componentDidMount() {
    this.updateColumnHeaders();
    window.addEventListener("resize", this.updateColumnHeaders);
    // this.setState({ date: moment().startOf('day').toISOString(true) })
    await this.setInvoices(this.props, 1);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateColumnHeaders);
    this.axiosRequestSource && this.axiosRequestSource.cancel()
  }

  setInvoices = async(props, mounted) => {
    const { category } = this.state
    if (props) {
      const queries = queryString.parse(props.location.search)

      if (queries.category && queries.category !== category) {

        this.setState(
        {
          category: queries.category,
          date: null,
          query: null,
          client: null,
          page: 1
        },
          async () => {
          await this.resetInvoices()
          await this.fetchInvoices()
        })

      } else if (queries.q) {

        this.setState(
        {
          query: queries.q,
          date: null,
          category: queries.q,
          client: null,
          page: 1
        },
          async () => {
          await this.resetInvoices()
          await this.fetchInvoices()
        })

      } else if (queries.client) {

        const clt = await client.findById(queries.client, this.axiosRequestSource.token)
        this.setState(
        {
          query: null,
          date: null,
          category: clientName(clt),
          client: queries.client,
          page: 1
        },
          async () => {
          await this.resetInvoices()
          await this.fetchInvoices()
        })

      } else if (mounted) {
        this.setState(
        {
          query: null,
          client: null,
          category: 'Upcoming',
          page: 1
        },
          async () => {
          await this.resetInvoices()
          await this.fetchInvoices()
        })
      }
    } else {
      this.setState(
      {
        query: null,
        client: null,
        page: 1
      },
        async () => {
        await this.resetInvoices()
        await this.fetchInvoices()
      })
    }
  }

  fetchInvoices = async() => {
    const { page, date, category, query, client } = this.state
    let invcs;
    if (query) {
      invcs = await invoice.find(page, query, this.axiosRequestSource.token)
    } else if (client) {
      invcs = await invoice.findByClient(page, client, this.axiosRequestSource.token)
    } else if (date) {
      invcs = await invoice.findByDate(page, date, this.axiosRequestSource.token)
    } else {
      invcs = await invoice.getAll(page, category, this.axiosRequestSource.token)
    }
    if (invcs) {
      await this.updateInvoices(invcs);
      await this.incrementPage()
    }
  }

  resetPage = () => {
    this.setState({ page: 1 })
  }

  incrementPage = () => {
    this.setState(prevState => ({
      page: prevState.page + 1
    }))
  }

  updateInvoices = async(invcs, category) => {
    if (invcs) {
      const updatedInvoices = invcs.map( async(i) => {
        const { lines } = i
        if (lines && lines.length) {
          const prices = lines.map(line => price(line, invoice.kind))
          const subTotal = prices.reduce((a, b) => a + b)

          i.subTotal = subTotal
          i.total = subTotal - i.discount
          if (i.paymentStatus !== 'Paid In Full') {
            i.balance = i.total - i.deposit
          } else {
            i.balance = 0
          }

          await invoice.update(
            i.id,
            {
              sub_total: subTotal,
              total: subTotal - i.discount,
              balance: i.paymentStatus !=='Paid In Full'? subTotal - i.discount - i.deposit : 0
            },
            this.axiosRequestSource.token
          )

          return i
        }
      })
      const loadedInvoices = await Promise.all(updatedInvoices)
      const invoices = [...this.state.invoices]
      loadedInvoices.forEach(i => invoices.push(i))
      if (invcs.length < 25) {

        this.setState({
          invoices,
          hasMore: false
        })

      } else {

        this.setState({
          invoices,
          hasMore: true
        })

      }
    } else {
      this.setState({
        invoices: [],
      })
    }
  }

  changeCategory = (category) => {
    this.setCategory(category);
    this.resetInvoices();
  }

  setCategory = (category) => {
    if (category) {
      this.setState({ category })
    }
  }

  resetInvoices = () => {
    this.setState({ invoices: [] })
  }

  setRefresh = (value, url) => {
    const { history } = this.props
    this.setState({ willRefresh: value }, () => {
      if (url) {
        history.push(url)
      }
    })
  }

  handleDateChange = async(date) => {
    this.setState({ date: moment(date).startOf('day').toISOString(true) },
    () =>  this.setInvoices())
  }

  addInvoice = async(data) => {
    let invoices = [...this.state.invoices]
    const newInvoice = await invoice.create(data, this.axiosRequestSource.token)
    invoices.shift(newInvoice)
    this.setState({ invoices })
    return newInvoice
  }

  updateInvoice = async(i, data) => {
    let invoices = [...this.state.invoices]
    const updatedInvoice = await invoice.update(i.id, data, this.axiosRequestSource.token)
    const index = invoices.findIndex((inv) => i.id === inv.id)
    invoices[index] = updatedInvoice
    this.setState({ invoices })
    return updatedInvoice
  }

  deleteInvoice = async(i) => {
    let invoices = [...this.state.invoices]
    await invoice.delete(i.id, this.axiosRequestSource.token)

    const index = invoices.findIndex((inv) => i.id === inv.id)
    invoices.splice(index, 1)
    this.setState({ invoices })
  }

  List = ({ match, history }) => {
    const { invoices, categories, category, columnHeaders, hasMore } = this.state
    return (
      <ListPage
        title="Invoices"
        type="Invoices"
        category={category}
        categories={categories}
        columnHeaders={columnHeaders}
        data={invoices}
        match={match}
        history={history}
        hasMore={hasMore}
        load={this.fetchInvoices}
        refresh={this.setRefresh}
        handleDateChange={this.handleDateChange}
      />
    )
  }

  Show = ({ match, location, history }) => {
    const req_id = parseInt(match.params.id)
    const invoices = [...this.state.invoices]
    const inv = invoices.find(invoice => invoice.id === req_id)
    return (
      <InvoiceDetail
        match={match}
        location={location}
        history={history}
        inv={inv}
        invoiceId={req_id}
        handleCreate={this.addInvoice}
        handleUpdate={this.updateInvoice}
        handleDelete={this.deleteInvoice}
        scrollToTop={this.scrollToTop}
      />
    )
  }

  Create = ({match, location, history}) => {
    let evtId;
    if (location.state && location.state.eventId) {
      evtId = location.state.eventId
    }
    return (
      <InvoiceDetail
        match={match}
        location={location}
        history={history}
        evtId={evtId}
        isNew={true}
        handleCreate={this.addInvoice}
        handleUpdate={this.updateInvoice}
        handleDelete={this.deleteInvoice}
      />
    )
  }

  render(){
    const { match } = this.props
    return (
      <Switch>
        <Route exact path={match.path} render={this.List}/>
        <Route exact path={`${match.path}/new`} render={this.Create}/>
        <Route exact path={`${match.path}/:id`} render={this.Show}/>
      </Switch>
    )
  }
}
