import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import queryString from 'query-string'
import ListPage from '../../../ListPage/index.js'
import InvoiceDetail from './InvoiceDetail/index.js'
import { invoice, client } from '../../../../services/BEP_APIcalls.js'
import { clientName } from '../../../../helpers/clientHelpers'
// import { price } from './InvoiceDetail/Invoice/Line/Helpers'
import axios from 'axios'
import moment from 'moment'

export default class Invoices extends Component {
  constructor(props){
    super(props)
    this.state = {
      invoices: [],
      hasMore: false,
      category: null,
      page: 1
    }
    this.axiosRequestSource = axios.CancelToken.source()
    this.ajaxOptions = {
      cancelToken: this.axiosRequestSource.token,
      unauthorizedCB: this.props.signout,
      sendCount: true
    }
    this.itemsPerPage = 25
  }

  // ----------------------------------Lifecycle--------------------------------

  async componentDidUpdate(prevProps, prevState){
    await this.setInvoices(prevProps)
    if (prevState.count !== this.state.count) {
      if (this.state.count) {
        this.ajaxOptions.sendCount = false
      } else {
        this.ajaxOptions.sendCount = true
      }
    }
  }

  async componentDidMount() {
    const { location, changeNav } = this.props
    if (location && location.state && !location.state.nav) changeNav(false)
    await this.props.setView('Invoices')
    await this.props.setCategories(['CATP', 'THC', 'TANS', 'CANS'])
    await this.setColumnHeaders()
    await this.setCurrentMonth()
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateColumnHeaders);
    this.axiosRequestSource && this.axiosRequestSource.cancel()
  }

  // ----------------------------------Getters-and-Setters----------------------

  setInvoices = async(prevProps) => {
    let options = {}
    if (prevProps) {

      // check for queries from url
      const { location: prevLocation } = prevProps
      const { location: nextLocation } = this.props

      let prevQueries, nextQueries = null

      if (prevLocation && prevLocation.search) prevQueries = prevLocation.search
      if (nextLocation && nextLocation.search) nextQueries = nextLocation.search

      if (nextQueries) {
        const queries = queryString.parse(nextQueries);

        if (!queries.q) options.query = null;
        if (!queries.category) options.category = null;
        if (!queries.client) options.client = null;
        if (nextQueries !== prevQueries) await this.setByQuery()
      }

      // check for date change
      const { date: prevDate } = prevProps
      const { date: nextDate } = this.props
      if (prevDate && nextDate) {
        const { start: pStart, end: pEnd } = prevDate
        const { start: nStart, end: nEnd } = nextDate
        const prevStart = moment(pStart);
        const prevEnd = moment(pEnd);
        const nextStart = moment(nStart);
        const nextEnd = moment(nEnd);
        const startChange = !( prevStart.isSame(nextStart) )
        const endChange = !( prevEnd.isSame(nextEnd) )
        if ( startChange || endChange ) await this.setByDate(options)
      }
    }
  }

  setByQuery = async(props) => {
    const { category, query } = this.state
    const queries = queryString.parse(this.props.location.search);

    // Category-Query-----------
    if (queries.category && queries.category !== category) {
      this.setState({
        events: [],
        searchLabel: queries.category,
        type: 'category',
        category: queries.category,
        query: null,
        client: null,
        page: 1
      },
      async() => this.fetchInvoices())

    // Search-Query-----------
    } else if (queries.q && queries.q !== query) {
      this.setState({
        events: [],
        searchLabel: queries.q,
        type: 'query',
        category: null,
        query: queries.q,
        client: null,
        page: 1
      },
      async() => this.fetchInvoices())

    // Client-Query-----------
    } else if (queries.client && queries.client !== this.state.client) {
      const clt = await client.get(queries.client, this.ajaxOptions)
      this.setState({
        events: [],
        searchLabel: clientName(clt),
        type: 'client',
        category: null,
        query: null,
        client: queries.client,
        page: 1
      },
      async() => this.fetchInvoices())
    }
  }

  setByDate = async(options) => {
    const { category, client, query } = this.state
    const { date: { start: s, end: e }, isDay, isMonth } = this.props
    const start = moment(s);
    const end = moment(e);
    let date = `${start.format('LL')} - ${end.format('LL')}`
    if (isDay()) date = `${start.format('LL')}`
    if (isMonth()) date = `${start.format('MMMM YYYY')}`
    let searchLabel = date

    if (options && options.category !== null && category) searchLabel = `${category} - ${date}`
    if (options && options.client !== null && client) searchLabel = `${client} - ${date}`
    if (options && options.query !== null && query) searchLabel = `${query} - ${date}`

    this.setState(
    {
      events: [],
      ...options,
      searchLabel,
      page: 1,
      type: null
    },
    async() => this.fetchInvoices())
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
    const { handleDateChange } = this.props
    handleDateChange(moment(), 'day')
  }

  setCurrentMonth = () => {
    const { handleDateChange } = this.props
    handleDateChange(moment(), 'month')
  }

  setMonth = (month, year) => {
    const { handleDateChange } = this.props
    handleDateChange(moment(month, year), 'month')
  }

  refresh = (value, url) => {
    const { history } = this.props
    if (value) {
      this.resetState()
      this.setCurrentMonth()
      this.setByDate()
    }
    history.push(url)
  }

  resetState = () => {
    this.setState({
      searchLabel: null,
      query: null,
      client: null,
      category: null,
      type: null,
    })
  }

  // -----------------------------------Handle-Change---------------------------

  onDateChange = async(date, type) => {
    const { handleDateChange } = this.props
    handleDateChange(date, type, this.setInvoices)
  }

  changeCategory = (category) => {
    this.setCategory(category);
    this.resetInvoices();
  }

  // --------------------------------------CRUD---------------------------------

  fetchInvoices = async() => {
    const { invoices, page, category, query: q, client, type } = this.state
    const { date: { start: date_start, end: date_end } } = this.props
    let searchData = { page, category, q, client, date_start, date_end }
    if ((invoices.length + this.itemsPerPage) / page <= this.itemsPerPage) {
      switch (type) {
        case 'query':
          searchData = { page, q }
          break;
        case 'category':
          searchData = { page, category }
          break;
        case 'client':
          searchData = { page, client }
          break;
        default:
          break;
      }

      const data = await invoice.batch(searchData, this.ajaxOptions)
      if (data && data.invoices && data.invoices.length) await this.updateInvoices(data)

    } else {
      this.setState({ hasMore: false })
    }
  }

  addInvoice = async(data) => {
    let invoices = [...this.state.invoices]
    const newInvoice = await invoice.create(data, this.ajaxOptions)
    invoices.shift(newInvoice)
    this.setState({ invoices })
    return newInvoice
  }

  deleteInvoice = async(i) => {
    let invoices = [...this.state.invoices]
    await invoice.delete(i.id, this.ajaxOptions)

    const index = invoices.findIndex((inv) => i.id === inv.id)
    invoices.splice(index, 1)
    this.setState({ invoices })
  }

  updateInvoice = async(i, data) => {
    const updatedInvoice = await invoice.update(i.id, data, this.ajaxOptions)
    let invoices = [...this.state.invoices]
    if (invoices.length) {
      const index = invoices.findIndex((inv) => i.id === inv.id)
      invoices[index] = updatedInvoice
      this.setState({ invoices })
    }
    return updatedInvoice
  }

  updateInvoices = async(data) => {
    const { invoices: invcs, meta: { count } } = data
    const { page } = this.state
    // const { signout } = this.props
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
      //       this.ajaxOptions
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
          count,
          hasMore: false
        })

      } else {
        this.setState( prevState => ({
          invoices,
          count,
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
        columnHeaders: ['type', 'client & date', 'status']
      })
    } else {
      this.setState({
        columnHeaders: ['type', 'client & date','', 'balance', 'status']
      })
    }
  }

  List = ({ match, history }) => {
    const { invoices, searchLabel } = this.state
    return (
      <ListPage
        {...this.props}
        {...this.state}

        mainHeader={searchLabel}
        data={invoices}

        match={match}
        history={history}

        load={this.fetchInvoices}
        refresh={this.refresh}

        onDateChange={this.onDateChange}
        handleMonthChange={this.setMonth}
      />
    )
  }

  Show = ({ match, location, history }) => {
    const req_id = parseInt(match.params.id)
    const { invoices } = this.state
    let inv;
    if (invoices.length) {
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
