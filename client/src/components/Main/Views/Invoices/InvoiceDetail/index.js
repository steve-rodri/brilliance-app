import React, { Component } from 'react'
import Header from './Header'
import SubHeader from './SubHeader'
import Invoice from './Invoice'
import SummaryAndButtons from './SummaryAndButtons'
import { invoice } from '../../../../../services/invoice'
import './index.css'

export default class InvoiceDetail extends Component {
  constructor(props){
    super(props)
    this.state = {
      invoice: null
    }
  }

  async componentDidMount(){
    await this.setInvoice()
  }

  setInvoice = async() => {
    const { inv, invoiceId } = this.props
    if (inv) {
      this.setState({ invoice: inv })
    } else {
      const i = await invoice.get(invoiceId)
      this.setState({ invoice: i })
    }
  }

  render(){
    return (
      <div className="InvoiceDetail">
        <Header {...this.state}/>
        <SubHeader {...this.state}/>
        <Invoice {...this.state}/>
        <SummaryAndButtons {...this.state}/>
      </div>
    )
  }
}
