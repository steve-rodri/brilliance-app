import React, { Component } from 'react'
import Header from './Header/'
import SubHeader from './SubHeader/'
import Invoice from './Invoice'
import Summary from './Summary'
import Buttons from '../../../../Buttons/Buttons'
import { invoice } from '../../../../../services/invoice'
import { line } from '../../../../../services/line'
import { client } from '../../../../../services/client'
import { quantity, price } from './Invoice/Line/Helpers'
import { clientName } from '../../../../Helpers/clientHelpers'
import axios from 'axios'
import './index.css'

export default class InvoiceDetail extends Component {
  constructor(props){
    super(props)
    this.state = {
      inv: null,
      editMode: false,
      formData: {},
      fields: {},
      searchFieldData: null
    }

    this.container = React.createRef()
    this.axiosRequestSource = axios.CancelToken.source()
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
    await this.setup(this.props)
  }

  async componentWillUnmount(){
    window.removeEventListener('resize', this.resetView)
    this.axiosRequestSource && this.axiosRequestSource.cancel()
  }


  // -------------------------------Getters-and-Setters-------------------------

  setup = async(props) => {
    const { isNew, evtId, evt } = props
    if (isNew) {
      this.setEditMode(true)
      this.setFieldAndForm('kind', 'Proposal')
    } else {
      await this.setInvoice(props)
      await this.setClientName()
    }
    if (evtId) {
      this.setFormData('event_id', evtId)
      this.setState({ fromEvent: true })
    }
    if (evt) {
      this.setState({ fromEvent: true })
    }
    await this.setSummary()
    await this.setFields()
  }

  setInvoice = async(props) => {
    const { inv, invoiceId } = props
    if (inv) {
      this.setState({ inv }, () => this.setLines())
    } else {
      const i = await invoice.get(invoiceId, this.axiosRequestSource.token)
      this.setState({ inv: i }, () => this.setLines())
    }
  }

  setLines = async() => {
    const { inv, inv: { lines } } = this.state

    const updatedLines = lines.map( line => {
      line.quantity = quantity(line)
      line.price = price(line, inv.kind)
      return line
    })

    this.setState(prevState => ({
      inv: {
        ...prevState.inv,
        lines: updatedLines
      },
      fields: {
        ...prevState.fields,
        lines: updatedLines
      },
      formData: {
        ...prevState.formData,
        lines_attributes: updatedLines
      }
    }), () => { this.updateSummary() });
  }

  setFields = () => {
    const { inv } = this.state
    const fieldNames = ['kind', 'paymentStatus', 'paymentType', 'check', 'commission', 'commissionPaid']
    if (!inv) {
      fieldNames.forEach( field => this.setField( field, null ))
    } else {
      fieldNames.forEach( field => inv[field]? this.setField( field, inv[field] ) : null)
    }
  }

  resetFields = () => {
    this.setState({ fields: {} })
  }

  setField = (name, value) => {
    this.setState(prevState => ({
      fields: {
        ...prevState.fields,
        [name]: value
      }
    })
  )}

  setFieldAndForm = (name, value) => {
    this.setState(prevState => ({
      fields: {
        ...prevState.fields,
        [name]: value
      },
      formData: {
        ...prevState.formData,
        [name]: value
      }
    }))
  }

  setClientName = () => {
    const { inv } = this.state
    if (inv) {
      if (inv.event) {
        if (inv.event.client) {
          const name = clientName(inv.event.client, true)
          this.setField('client', name)
          this.setFormData('client_id', inv.event.client.id)
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
    const { inv } = this.state
    if (inv) {
      const { lines } = inv
      if (lines && lines.length) {
        const prices = lines.map(line => line.price)
        let subTotal;
        if (prices && prices.length) {
          subTotal = prices.reduce((a, b) => a + b)
        } else {
          subTotal = 0
        }
        this.setState(prevState => ({
          inv: {
            ...prevState.inv,
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
        inv: {
          ...prevState.inv,
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
    const { inv } = this.state
    if (inv) {
      const { subTotal } = inv
      const total = subTotal - inv.discount
      this.setState(prevState => ({
        inv: {
          ...prevState.inv,
          total
        },
        formData: {
          ...prevState.formData,
          total
        }
      }), () => { if (callBack) { this.setBalance() } })
    } else {
      this.setState(prevState => ({
        inv: {
          ...prevState.inv,
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
    const { inv } = this.state
    if (inv) {
      const { total } = inv
      const balance = total - inv.deposit
      this.setState(prevState => ({
        inv: {
          ...prevState.inv,
          balance
        },
        formData: {
          ...prevState.formData
        }
      }), () => { if (callBack) { callBack() } })
    } else {
      this.setState(prevState => ({
        inv: {
          ...prevState.inv,
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

  setFormData = (name, value) => {
    this.setState(prevState => ({
      formData: {
        ...prevState.formData,
        [name]: value
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

  // -------------------------Lines-------------------------------

  addLine = () => {
    console.log('works')
  }

  deleteLine = async(lineId) => {
    const state = {...this.state}
    let { inv, fields } = state

    await line.delete(lineId, this.axiosRequestSource.token)
    const updatedLines = inv.lines.filter(line => line.id !== lineId)
    inv.lines = updatedLines
    fields.lines = updatedLines

    this.setState({ inv, fields })
  }

  // -------------------------HandleChange------------------------

  handleChange = (e) => {
    const { name, value } = e.target
    this.setState(prevState => ({
      fields: {
        ...prevState.fields,
        [name]: value
      },
      formData: {
        ...prevState.formData,
        [name]: value
      }
    }))
  }

  handleClientChange = async(name, value) => {
    this.setField(name, value)
    const clients = await this.findClients(value)
    if (!value || !clients || clients.length < 0) {

      this.setState(prevState => ({
        formData: {
          ...prevState.formData,
          client_id: null
        }
      }))

    }

    this.setState(prevState => ({
      searchFieldData: {
        ...prevState.searchFieldData,
        clients
      }
    }))
  }

  handleLineChange = (e, lineId, nme, val) => {
    const { inv, fields } = this.state
    let { name, value } = e.target
    if (nme) name = nme
    if (val) value = val
    const { lines } = fields;

    const updatedLines = lines.map( line => {
      if (line.id === lineId) {
        switch (name) {
          case 'inc':
            line[name] = !line.inc
            if (!line.inc) {
              line.price = price(line, inv.kind)
            } else {
              line.price = 0
            }
            break;
          case 'quantity':
            line[name] = value
            line.price = price(line, inv.kind)
            break;
          default:
          line[name] = value
            break;
        }
      }

      return line
    })

    this.setState(prevState => ({
      fields: {
        ...prevState.fields,
        lines: updatedLines
      },
      formData: {
        ...prevState.formData,
        lines_attributes: updatedLines
      }
    }),
    async() => {
      await this.updateSummary()
    });
  }

  // -------------------------Client-Search-Field-----------------------

  handleSelect = (e, name, index) => {
    let item;
    const { searchFieldData } = this.state
    if (searchFieldData) {
      item = searchFieldData.clients[index]
      const client = clientName(item, true);
      if (item) {
        this.setState(prevState => ({
          formData: {
            ...prevState.formData,
            client_id: item.id
          },
          fields: {
            ...prevState.fields,
            client
          }
        }))
      }
    }
  }

  handleFormSubmit = (e, name, index) => {
    if (e.key === 'Tab' || e.key === 'Enter') {
      this.handleSelect( e, name, index)
    }
  }

  findClients = async(query) => {
    const q = query.split('')
    if (q.length > 2) {
      const clients = await client.find(1, query, this.axiosRequestSource.token)
      return clients
    }
  }

  // -------------------------Submit------------------------------

  handleSubmit = async() => {
    const { inv, formData, editMode, fromEvent } = this.state
    const { isNew, match, history, evtId } = this.props
    if (fromEvent) {
      if (isNew) {
        if (formData) {
          const newInvoice = await invoice.create(formData, this.axiosRequestSource.token)
          this.setState({ inv: newInvoice })

          this.setEditMode(false);
          await this.resetForm();
          await this.setFields();
          await this.setClientName();
        } else {
          this.close()
        }

        history.push(`/admin/events/${evtId}`, {view: 'Invoice'})
      } else {
        const updatedInvoice = await invoice.update(inv.id, formData, this.axiosRequestSource.token)
        await this.setState({ inv: updatedInvoice })

        await this.resetForm()
        await this.setClientName();
        await this.setFields();
        await this.setLines();
      }

    } else {
      if (isNew) {
        if (formData) {
          const newInvoice = await this.props.handleCreate(formData);
          const url = () => {
            let words = `${match.path}`.split('/')
            words.pop()
            const link = words.join('/')
            return link
          }
          history.push(`${url()}/${newInvoice.id}`)

        } else {
          this.close()
        }
      } else {
        const updatedInvoice = await this.props.handleUpdate(inv, formData)
        await this.setState({ inv: updatedInvoice }, async() => await this.close())
      }
    }

    if (editMode) {
      this.setEditMode(false)
    }
  }

  handleDelete = async() => {
    const { inv, fromEvent } = this.state
    const { handleDelete, setView } = this.props
    if (fromEvent) {
      await invoice.delete(inv.id, this.axiosRequestSource.token)
      if (setView) setView('Invoice')
    } else {
      await handleDelete(inv)
    }
  }


  // -------------------------Views-------------------------

  close = async () => {
    await this.resetForm();
    await this.resetSearchFieldData();
    await this.resetFields();
    await this.setFields();
    await this.setClientName();
    await this.setLines();
    await this.setEditMode(false);
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
          {...this.props}
          {...this.state}
          edit={() => this.setEditMode(true)}
          close={this.close}
          delete={this.handleDelete}
          submit={this.handleSubmit}
        />
        <SubHeader
          {...this.props}
          {...this.state}
          handleChange={this.handleChange}
          handleClientChange={this.handleClientChange}
          onSelect={this.handleSelect}
          onEnter={this.handleFormSubmit}
        />
        <Invoice
          {...this.state}
          handleLineChange={this.handleLineChange}
          addLine={this.addLine}
          deleteLine={this.deleteLine}
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
