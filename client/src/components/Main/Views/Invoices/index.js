import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import queryString from 'query-string'
import ListPage from '../../../ListPage/index.js'
import InvoiceDetail from './InvoiceDetail/index.js'
import { invoice } from '../../../../services/invoice'
import { price } from './InvoiceDetail/Invoice/Line/Helpers'

export default class Invoices extends Component {
  constructor(props){
    super(props)
    this.state = {
      invoices: [],
      category: 'All',
      categories: ['Production', 'CANS', 'THC', 'CATP'],
      columnHeaders: ['client & date', 'type', 'status', 'balance'],
      hasMore: true,
      page: 1
    }
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
    await this.setInvoices(this.props, 1);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateColumnHeaders);
  }

  setInvoices = async(props, mounted) => {
    const { category } = this.state
    const queries = queryString.parse(props.location.search)

    if (queries.category && queries.category !== category) {

      this.setState(
      {
        category: queries.category,
        query: null,
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
        category: queries.q,
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
        category: 'All',
        page: 1
      },
        async () => {
        await this.resetInvoices()
        await this.fetchInvoices()
      })
    }
  }

  fetchInvoices = async() => {
    const { page, category, query } = this.state
    let invcs;
    if (query) {
      invcs = await invoice.find(page, query)
    } else {
      invcs = await invoice.getAll(page, category)
    }
    this.incrementPage()
    await this.updateInvoices(invcs);
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

          await invoice.update(i.id, {
            sub_total: subTotal,
            total: subTotal - i.discount,
            balance: i.paymentStatus !=='Paid In Full'? subTotal - i.discount - i.deposit : 0
          })

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
      />
    )
  }

  Show = ({ match }) => {
    const req_id = parseInt(match.params.id)
    const invoices = [...this.state.invoices]
    const invoice = invoices.find(invoice => invoice.id === req_id)
    return (
      <InvoiceDetail inv={invoice} invoiceId={req_id}/>
    )
  }

  render(){
    const { match } = this.props
    return (
      <Switch>
        <Route exact path={match.path} render={this.List}/>
        <Route exact path={`${match.path}/:id`} render={this.Show}/>
      </Switch>
    )
  }
}
