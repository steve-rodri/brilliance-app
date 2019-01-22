import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import Header from '../Header/index.js'
import ListPage from '../ListPage/index.js'
import InvoiceDetail from './InvoiceDetail/index.js'
import { invoice } from '../../services/invoice'

export default class Invoices extends Component {
  constructor(props){
    super(props)
    this.state = {
      invoices: [],
      hasMore: true
    }
  }

  fetchInvoices = async(page) => {
    const loadedInvoices = await invoice.getAll(page);
    const invoices = [...this.state.invoices]
    loadedInvoices.forEach(i => invoices.push(i))

    if (loadedInvoices.length < 25) {

      this.setState({
        invoices,
        hasMore: false
      })
    } else {
      this.setState({ invoices })
    }
  }

  List = () => {
    const { invoices, hasMore } = this.state
    return (
      <ListPage
        title="Invoices"
        categories={['All', 'Production', 'CANS', 'THC', 'CATP']}
        subtitles={['client & date', 'type', 'status', 'balance']}
        data={invoices}
        load={this.fetchInvoices}
        hasMore={hasMore}
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
      <div className="Section">
        <Header location={location}/>

        <Route exact path={match.path} render={this.List}/>
        <Route exact path={`${match.path}/:id`} render={this.Show}/>
      </div>
    )
  }
}
