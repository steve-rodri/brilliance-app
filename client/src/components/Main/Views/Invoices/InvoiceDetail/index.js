import React, { Component } from 'react'
import Header from './Header/'
import SubHeader from './SubHeader/'
import Invoice from './Invoice'
import Summary from './Summary'
import Buttons from '../../../../Buttons/Buttons'
import { invoice } from '../../../../../services/invoice'
import { price } from './Invoice/Line/Helpers'
import { clientName } from '../../../../Helpers/clientHelpers'
import './index.css'

export default class InvoiceDetail extends Component {
  constructor(props){
    super(props)
    this.state = {
      invoice: null,
      editMode: false,
      formData: {},
      fields: {},
      searchFieldData: null
    }

    this.container = React.createRef()
  }

  scrollToTop = () => {
    this.container.current.scrollTop = 0
  }

  // -------------------------------Lifecycle-----------------------------------

  async componentWillReceiveProps(nextProps){
    if (nextProps.inv || nextProps.invoiceId) {
      await this.setup(nextProps)
    }
  }

  async componentDidMount(){
    window.addEventListener('resize', this.resetView)
    await this.setFields()
    await this.setup(this.props)
  }

  async componentWillUnmount(){
    window.removeEventListener('resize', this.resetView)
  }


  // -------------------------------Getters-and-Setters-------------------------

  setup = async(props) => {
    const { isNew, evtId } = this.props
    if (isNew) {
      this.setEditMode(true)
      if (evtId) this.setFormData({ event_id: evtId })

    } else {
      await this.setInvoice(props)
      await this.setClientName()
    }
    await this.setSummary()
  }

  setInvoice = async(props) => {
    const { inv, invoiceId } = props
    if (inv) {
      this.setState({ invoice: inv })
    } else {
      const i = await invoice.get(invoiceId)
      this.setState({ invoice: i })
    }
  }

  setFields = () => {
    const { invoice } = this.state
    const fieldNames = ['kind', 'paymentStatus', 'paymentType', 'check', 'commission', 'commissionPaid']
    if (!invoice) {
      fieldNames.forEach( field => this.setField( field, null ))
    } else {
      fieldNames.forEach( field => invoice[field]? this.setField( field, invoice[field] ) : null)
    }
  }

  setField = (name, value) => {
    this.setState(prevState => ({
      fields: {
        ...prevState.fields,
        [name]: value
      }
    })
  )}

  setClientName = () => {
    const { invoice } = this.state
    if (invoice) {
      if (invoice.event) {
        if (invoice.event.client) {
          const name = clientName(invoice.event.client, true)
          this.setField('client', name)
          this.setFormData('client_id', invoice.event.client.id)
        } else {
          this.setField('client', null)
        }
      }
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
    } else {
      this.setState(prevState => ({
        invoice: {
          ...prevState.invoice,
          subTotal: 0
        },
        formData: {
          ...prevState.formData,
          subTotal: 0
        }
      }))
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
    } else {
      this.setState(prevState => ({
        invoice: {
          ...prevState.invoice,
          total: 0
        },
        formData: {
          ...prevState.formData,
          total: 0
        }
      }))
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
    } else {
      this.setState(prevState => ({
        invoice: {
          ...prevState.invoice,
          balance: 0
        },
        formData: {
          ...prevState.formData,
          balance: 0
        }
      }))
    }
  }

  setEditMode = (value) => {
    this.setState({
      editMode: value
    })
  }

  setFormData = (data) => {
    this.setState(prevState => ({
      formData: {
        ...prevState.formData,
        data
      }
    }))
  }

  resetForm = () => {
    this.setState({
      formData: null,
    })
  }

  resetSearchFieldData = async() => {
    this.setState({
      searchFieldData: null
    })
  }

  updateSummary = () => {
    this.setSubTotal(true)
  }

  // -------------------------HandleChange------------------------

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


  // -------------------------Submit------------------------------

  handleSubmit = () => {
    this.setEditMode(false)
  }


  // -------------------------Views-------------------------

  close = () => {
    this.resetForm();
    this.resetSearchFieldData();
    this.setEditMode(false);
    this.setFields();
    this.setClientName();
  }

  resetView = () => {
    const width = window.innerWidth;
    if (width < 750) {
      this.displayMobile(true)
    } else {
      this.displayMobile(false)
    }
  }

  displayMobile = (value) => {
    this.setState({ mobile: value })
  }

  render(){
    return (
      <div className="InvoiceDetail" ref={this.container}>
        <Header
          {...this.state}
          {...this.props}
          edit={() => this.setEditMode(true)}
          close={this.close}
        />
        <SubHeader
          {...this.state}
          {...this.props}
        />
        <Invoice
          {...this.state}
          handleInc={this.handleIncChange}
          setSubTotal={this.setSubTotal}
        />
        <Summary {...this.state}/>

        {this.state.mobile?
          <Buttons
            {...this.state}
            scrollToTop={this.scrollToTop}
            edit={() => this.setEditMode(!this.state.editMode)}
            handleSubmit={this.handleSubmit}
            />
          :
          null
        }
      </div>
    )
  }
}
