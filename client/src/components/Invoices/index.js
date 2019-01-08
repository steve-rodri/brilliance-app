import React, { Component } from 'react'
import Header from '../Header/index.js'
import ListPage from '../ListPage/index.js'
import { invoice } from '../../services/invoice'

export default class Invoices extends Component {
  constructor(props){
    super(props)
    this.state = {
      invoices: []
    }
  }

  async componentDidMount(){
    await this.fetchAllInvoices()
  }

  fetchAllInvoices = async() => {
    const invoices = await invoice.getAll();
    this.setState({
      invoices
    })
  }

  render(){
    return (
      <div className="ListPage">
        <Header removeUser={this.props.removeUser}/>
        <ListPage
          title="Invoices"
          categories={['All', 'Production', 'CANS', 'THC', 'CATP']}
          subtitles={['client & date', 'type', 'status', 'balance']}
          data={this.state.invoices}
        />
      </div>
    )
  }
}
