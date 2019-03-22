import React, { Component } from 'react'
import Header from './Header/'
import SubHeader from './SubHeader'
import Invoice from './Invoice'
import Summary from './Summary'
import { invoice } from '../../../../../services/invoice'
import { price } from './Invoice/Line/Helpers'
import './index.css'

export default class InvoiceDetail extends Component {
  constructor(props){
    super(props)
    this.state = {
      invoice: null,
      editMode: false,
      formData: {},
      searchFieldData: null
    }
  }

  async componentDidMount(){
    await this.setInvoice()
    await this.setSummary()
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

  setSummary = () => {
    this.setSubTotal()
    this.setTotal()
    this.setBalance()
  }

  setSubTotal = (callBack) => {
    const { invoice } = this.state
    if (invoice) {
      const { lines } = invoice
      if (lines) {
        const prices = lines.map(line => price(line, invoice.kind))
        const subTotal = prices.reduce((a, b) => a + b)
        this.setState(prevState => ({
          invoice: {
            ...prevState.invoice,
            subTotal
          },
          formData: {
            ...prevState.formData,
            subTotal
          }
        }), () => { if (callBack) { this.setTotal(true) } })
      }
    }
  }

  setTotal = (callBack) => {
    const { invoice } = this.state
    if (invoice) {
      const { subTotal } = invoice
      const total = subTotal - invoice.discount
      this.setState(prevState => ({
        invoice: {
          ...prevState.invoice,
          total
        },
        formData: {
          ...prevState.formData,
          total
        }
      }), () => { if (callBack) { this.setBalance() } })
    }
  }

  setBalance = (callBack) => {
    const { invoice } = this.state
    if (invoice) {
      const { total } = invoice
      const balance = total - invoice.deposit
      this.setState(prevState => ({
        invoice: {
          ...prevState.invoice,
          balance
        },
        formData: {
          ...prevState.formData
        }
      }), () => { if (callBack) { callBack() } })
    }
  }

  setEditMode = (value) => {
    this.setState({
      editMode: value
    })
  }

  updateSummary = () => {
    this.setSubTotal(true)
  }

  handleIncChange = (lineId, inc) => {
    let invoice = {...this.state.invoice};
    const { lines } = invoice;

    const updatedLines = lines.map( line => {
      if (line.id === lineId) {
        line.inc = !inc
      }
      return line
    })

    invoice.lines = updatedLines;
    this.setState(prevState => ({
      invoice,
      formData: {
        ...prevState.formData,
        lines_attributes: updatedLines
      }
    }), () => { this.updateSummary() });
  }

  render(){
    return (
      <div className="InvoiceDetail">
        <Header
          {...this.state}
          {...this.props}
          edit={() => this.setEditMode(true)}
          close={() => this.setEditMode(false)}
        />
        <SubHeader {...this.state}/>
        <Invoice
          {...this.state}
          handleInc={this.handleIncChange}
          setSubTotal={this.setSubTotal}
        />
        <Summary {...this.state}/>
      </div>
    )
  }
}
