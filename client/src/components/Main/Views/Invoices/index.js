import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
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
      hasMore: true
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

  componentDidMount() {
    this.updateColumnHeaders();
    window.addEventListener("resize", this.updateColumnHeaders);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateColumnHeaders);
  }

  fetchInvoices = async(page) => {
    const loadedInvoices = await invoice.getAll(page);
    this.updateInvoices(loadedInvoices, 'All')
  }

  fetchInvoicesByCategory = async(category) => {
    const loadedInvoices = await invoice.findByCategory(category);
    this.resetInvoices();
    this.updateInvoices(loadedInvoices, category)
  }

  updateInvoices = (invoices, category) => {
    if (invoices) {
      const invcs = [...this.state.invoices]
      invoices.forEach(i => invcs.push(i))

      if (invoices.length < 25) {

        this.setState({
          invoices,
          category: category,
          hasMore: false
        })
      } else {
        this.setState({
          invoices,
          category: category
        })
      }
    } else {
      this.setState({
        invoices: [],
        category: category
      })
    }
  }

  resetInvoices = () => {
    this.setState({ invoices: [] })
  }

  List = () => {
    const { invoices, categories, category, columnHeaders, hasMore } = this.state
    return (
      <ListPage
        title="Invoices"
        type="Invoices"
        category={category}
        categories={categories}
        subtitles={columnHeaders}
        data={invoices}
        load={this.fetchInvoices}
        hasMore={hasMore}
        fetchAllInvoices={this.fetchInvoices}
        fetchByCategory={this.fetchInvoicesByCategory}
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
    const { location, match } = this.props
    return (
      <Switch>
        <Route exact path={match.path} render={this.List}/>
        <Route exact path={`${match.path}/:id`} render={this.Show}/>
      </Switch>
    )
  }
}
