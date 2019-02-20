import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import queryString from 'query-string'
import ListPage from '../../../ListPage/index.js'
import InvoiceDetail from './InvoiceDetail/index.js'
import { invoice } from '../../../../services/invoice'

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
        columnHeaders: ['client & date', 'status']
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
    const queries = queryString.parse(nextProps.location.search)
    if (queries.category) {
      this.setState(prevState => {
        if (prevState.category !== queries.category) {
          return {
            category: queries.category,
            page: 1
          }
        }
      }, async () => {
        await this.resetInvoices()
        await this.fetchInvoices()
      })
    } else {
      this.setState({ category: 'All' })
    }
  }

  async componentDidMount() {
    this.updateColumnHeaders();
    window.addEventListener("resize", this.updateColumnHeaders);
    await this.fetchInvoices();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateColumnHeaders);
  }

  fetchInvoices = async() => {
    const { category, page } = this.state
    const loadedInvoices = await invoice.getAll(page, category);
    this.incrementPage()
    this.updateInvoices(loadedInvoices)
  }

  resetPage = () => {
    this.setState({ page: 1 })
  }

  incrementPage = () => {
    this.setState(prevState => ({
      page: prevState.page + 1
    }))
  }

  updateInvoices = (invoices, category) => {
    if (invoices) {
      const invcs = [...this.state.invoices]
      invoices.forEach(i => invcs.push(i))

      if (invoices.length < 25) {

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

  List = ({ match, history }) => {
    const { invoices, categories, category, columnHeaders, hasMore } = this.state
    return (
      <ListPage
        title="Invoices"
        type="Invoices"
        category={category}
        categories={categories}
        subtitles={columnHeaders}
        data={invoices}
        match={match}
        history={history}
        load={this.fetchInvoices}
        hasMore={hasMore}
        fetchAllInvoices={this.fetchInvoices}
      />
    )
  }

  Show = ({ match }) => {
    const req_id = parseInt(match.params.id)
    const invoices = this.state.invoices
    const invoice = invoices.find(invoice => invoice.id === req_id)
    return (
      <InvoiceDetail invoice={invoice} invoiceId={req_id}/>
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
