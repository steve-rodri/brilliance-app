import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import queryString from 'query-string'
import ListPage from '../../../ListPage/index.js'
import InvoiceDetail from './InvoiceDetail/index.js'
import { invoice } from '../../../../services/invoice'
import { client } from '../../../../services/client'
import { clientName } from '../../../../helpers/clientHelpers'
// import { price } from './InvoiceDetail/Invoice/Line/Helpers'
import axios from 'axios'
import moment from 'moment'

export default class Invoices extends Component {
  constructor(props){
    super(props)
    this.state = {
      invoices: null,
      hasMore: false,
      category: null,
      categories: ['CATP', 'THC', 'TANS', 'CANS'],
      page: 1
    }
    this.axiosRequestSource = axios.CancelToken.source()
    this.itemsPerPage = 25
  }

  // ----------------------------------Lifecycle--------------------------------

  async componentWillReceiveProps(nextProps){
    await this.setInvoices(nextProps)
  }

  async componentDidMount() {
    await this.setColumnHeaders()
    await this.setCurrentMonth()
    await this.setInvoices(this.props);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateColumnHeaders);
    this.axiosRequestSource && this.axiosRequestSource.cancel()
  }

  // ----------------------------------Getters-and-Setters----------------------

  setInvoices = async(props) => {
    if (props && props.location && props.location.search) {
      await this.setByQuery(props)
    } else {
      await this.setByDate()
    }
  }

  setByQuery = async(props) => {
    const { category } = this.state
    const queries = queryString.parse(props.location.search)

    // Category-Query-----------
    if (queries.category && queries.category !== category) {
      this.setState(
      {
        searchLabel: queries.category,
        category: queries.category,
        query: null,
        client: null,
        page: 1
      },
        async () => {
        await this.resetInvoices()
        await this.fetchInvoices()
      })

    // Search-Query-----------
    } else if (queries.q) {

      this.setState(
      {
        searchLabel: queries.q,
        category: null,
        query: queries.q,
        client: null,
        page: 1
      },
        async () => {
        await this.resetInvoices()
        await this.fetchInvoices()
      })

    // Client-Query-----------
    } else if (queries.client) {
      const clt = await client.findById(queries.client, this.axiosRequestSource.token)
      this.setState(
      {
        searchLabel: clientName(clt),
        category: null,
        query: null,
        client: queries.client,
        page: 1
      },
        async () => {
        await this.resetInvoices()
        await this.fetchInvoices()
      })
    }
  }

  setByDate = async() => {
    const { date: { start: s, end: e } } = this.state
    const start = moment(s);
    const end = moment(e);
    const isDay = end.diff(start, 'days') <= 1
    const isMonth = start.month() === end.month() && end.diff(start, 'days') <= start.daysInMonth()
    let date = `${start.format('LL')} - ${end.format('LL')}`

    if (isDay) date = `${start.format('LL')}`
    if (isMonth) date = `${start.format('MMMM YYYY')}`

    this.setState(
    {
      searchLabel: date,
      page: 1
    },
      async () => {
      await this.resetInvoices()
      await this.fetchInvoices()
    })
  }

  resetInvoices = () => {
    this.setState({ invoices: [] })
  }

  setColumnHeaders = () => {
    this.updateColumnHeaders();
    window.addEventListener("resize", this.updateColumnHeaders);
  }

  setCategory = (category) => {
    if (category) {
      this.setState({ category })
    }
  }

  setTodaysDate = (props) => {
    const { date } = props
    this.setState({ date })
  }

  setCurrentMonth = () => {
    this.setState({
      date: {
        start: moment().startOf('month').toISOString(true),
        end: moment().endOf('month').toISOString(true)
      }
    })
  }

  setMonth = (month, year) => {
    this.setState({
      date: {
        start: moment(month, year).startOf('month').toISOString(true),
        end: moment(month, year).endOf('month').toISOString(true)
      }
    })
  }

  setRefresh = (value, url) => {
    const { history } = this.props
    this.setState({ willRefresh: value }, () => {
      if (url) {
        history.push(url)
      }
    })
  }

  // -----------------------------------Handle-Change---------------------------

  handleDateChange = async(date, type) => {
    let t = type;
    if (!type) t = 'day'
    this.setState( prevState => ({
      date: {
        start: moment(date).startOf(t).toISOString(true),
        end:  moment(date).endOf(t).toISOString(true)
      }
    }),
    () =>  this.setInvoices())
  }

  changeCategory = (category) => {
    this.setCategory(category);
    this.resetInvoices();
  }

  // --------------------------------------CRUD---------------------------------

  fetchInvoices = async() => {
    const { invoices, page, date: { start, end }, category, query, client } = this.state
    if ((invoices.length + this.itemsPerPage) / page <= this.itemsPerPage) {

      let invcs = [];

      if (query) {
        invcs = await invoice.find(page, query, this.axiosRequestSource.token)
      } else if (client) {
        invcs = await invoice.findByClient(page, client, this.axiosRequestSource.token)
      } else if (category) {
        invcs = await invoice.getAll(page, category, this.axiosRequestSource.token)
      } else {
        invcs = await invoice.findByDate(page, start, end, this.axiosRequestSource.token)
      }
      if (invcs.length) await this.updateInvoices(invcs)

    } else {
      this.setState({ hasMore: false })
    }
  }

  addInvoice = async(data) => {
    let invoices = [...this.state.invoices]
    const newInvoice = await invoice.create(data, this.axiosRequestSource.token)
    invoices.shift(newInvoice)
    this.setState({ invoices })
    return newInvoice
  }

  deleteInvoice = async(i) => {
    let invoices = [...this.state.invoices]
    await invoice.delete(i.id, this.axiosRequestSource.token)

    const index = invoices.findIndex((inv) => i.id === inv.id)
    invoices.splice(index, 1)
    this.setState({ invoices })
  }

  updateInvoice = async(i, data) => {
    const updatedInvoice = await invoice.update(i.id, data, this.axiosRequestSource.token)
    let invoices = [...this.state.invoices]
    if (invoices.length) {
      const index = invoices.findIndex((inv) => i.id === inv.id)
      invoices[index] = updatedInvoice
      this.setState({ invoices })
    }
    return updatedInvoice
  }

  updateInvoices = async(invcs) => {
    const { page } = this.state
    const invoices = [...this.state.invoices]
    if ((invoices.length + this.itemsPerPage) / page <= this.itemsPerPage) {

      // const updatedInvoices = invcs.map( async(i) => {
      //   const { lines } = i
      //   if (lines.length) {
      //     const prices = lines.map(line => price(line, invoice.kind))
      //     const subTotal = prices.reduce((a, b) => a + b)
      //
      //     i.subTotal = subTotal
      //     i.total = subTotal - i.discount
      //     if (i.paymentStatus !== 'Paid In Full') {
      //       i.balance = i.total - i.deposit
      //     } else {
      //       i.balance = 0
      //     }
      //
      //     const updatedInvoice = await invoice.update(
      //       i.id,
      //       {
      //         sub_total: subTotal,
      //         total: subTotal - i.discount,
      //         balance: i.paymentStatus !=='Paid In Full'? subTotal - i.discount - i.deposit : 0
      //       },
      //       this.axiosRequestSource.token
      //     )
      //
      //     return updatedInvoice
      //   } else {
      //     return i
      //   }
      //
      //   return i
      // })
      // const loadedInvoices = await Promise.all(updatedInvoices)

      invcs.forEach(i => invoices.push(i))
      if (invcs.length < this.itemsPerPage) {
        this.setState({
          invoices,
          hasMore: false
        })

      } else {
        this.setState( prevState => ({
          invoices,
          hasMore: true,
          page: prevState.page + 1
        }))
      }

    }
  }

  // ----------------------------Views------------------------------------------

  updateColumnHeaders = (e) => {
    const width = window.innerWidth
    if (width < 500) {
      this.setState({
        columnHeaders: null
      })
    } else if (width < 700) {
      this.setState({
        columnHeaders: ['client & date', 'balance', 'status']
      })
    } else {
      this.setState({
        columnHeaders: ['client & date', 'type', 'balance', 'status']
      })
    }
  }

  List = ({ match, history }) => {
    const { invoices, categories, searchLabel, columnHeaders, hasMore } = this.state
    return (
      <ListPage
        {...this.state}
        title="Invoices"
        type="Invoices"
        category={searchLabel}
        categories={categories}
        columnHeaders={columnHeaders}
        data={invoices}
        match={match}
        history={history}
        hasMore={hasMore}
        load={this.fetchInvoices}
        refresh={this.setRefresh}
        handleDateChange={this.handleDateChange}
        handleMonthChange={this.setMonth}
      />
    )
  }

  Show = ({ match, location, history }) => {
    const req_id = parseInt(match.params.id)
    const invoices = this.state.invoices
    let inv;
    if (invoice.length) {
      inv = invoices.find(invoice => invoice.id === req_id)
    }
    return (
      <InvoiceDetail
        {...this.props}
        {...this.state}
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
        {...this.props}
        {...this.state}
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
