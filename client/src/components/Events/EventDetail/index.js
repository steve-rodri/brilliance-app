import React, { Component } from 'react';
import BasicInfo from './BasicInfo/index.js';
import Logistics from './Logistics/index.js';
import Invoice from './Invoice/index.js';
import CashFlow from './CashFlow/index.js';
import { event } from '../../../services/event'
import { client } from '../../../services/client'
import './index.css'

export default class EventDetail extends Component {
  constructor(props){
    super(props)
    this.state = {
      view: 'Basic Info',
      evt: null,
      fields: null,
      searchFieldData: null,
      formData: null,
      editMode: false
    }
  }

  async componentDidMount(){
    window.scrollTo(0,0);
    await this.getEvent();
    await this.setClientName();
    await this.setFields();
  }

  getEvent = async() => {
    const { e, eventId } = this.props
    if (!e) {
      const evt = await event.getOne(eventId)
      this.setState({ evt })
    } else {
      this.setState({ evt: e })
    }
  }

  findClients = async(query) => {
    const q = query.split('')
    if (q.length > 2) {
      const clients = await client.find(query)
      return clients
    }
  }

  setClientName(){
    const { evt } = this.state
    if (evt) {
      if (evt.client) {
        if (evt.client.contactInfo) {
          const { client: { contactInfo: {fullName}}} = evt
          this.setField('client', fullName)
        }
      }
    }
  }

  setFields = () => {
    const { evt } = this.state
    const fieldNames = ['location', 'start', 'end', 'action', 'kind', 'description', 'notes', 'package']
    fieldNames.forEach( field => this.setField( field, evt[field] ))
  }

  setField = (name, value) => {
    this.setState(prevState => ({
      fields: {
        ...prevState.fields,
        [name]: value
      }
    }))
  }

  handleSearchChange = async(e) => {
    const { name, value } = e.target
    this.setField(name, value)
    if (name === 'client') {
      const clients = await this.findClients(value)
      this.setState({ searchFieldData: clients })
    }
  }

  handleSelect = (e, name, index) => {
    e.preventDefault();
    const { searchFieldData } = this.state
    if (searchFieldData.length > 0) {
      const item = searchFieldData[index]
      switch (name) {
        case 'client':
          this.setField(name, item.contactInfo.fullName)
          this.setState(prevState => ({
            formData: {
              ...prevState.formData,
              client_id: item.id
            },
            searchFieldData: null
          }))
        break;
        case 'location':
          this.setState(prevState => ({
            formData: {
              ...prevState.formData,
              place_id: item.id
            },
            searchFieldData: null
          }))
        break;
        default:
          this.setState(prevState => ({
            formData: {
              ...prevState.formData,
              [name]: item.id
            },
            searchFieldData: null
          }))
        break;
      }
      this.resetSearchFieldData()
    }
  }

  handleChange = (e) => {
    const {name, value} = e.target
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

  handleEditSubmit = async() => {
    const { evt, formData, editMode } = this.state
    if (formData) {
      await event.update(evt.id, formData)
      this.resetForm();
      const updatedEvent = await event.getOne(evt.id)
      this.setState({
        evt: updatedEvent
      })
      await this.setClientName();
      await this.setFields();
    }
    this.setState({editMode: !editMode})
  }

  edit = () => {
    this.setState({editMode: !this.state.editMode})
  }

  close = () => {
    this.setState({
      editMode: !this.state.editMode,
      formData: null,
      searchFieldData: null
    })
  }

  resetSearchFieldData = async() => {
    this.setState({
      searchFieldData: null
    })
  }

  resetForm = () => {
    this.setState({
      formData: {},
      editMode: false
    })
  }

  setView = (view) => {
    this.setState({ view })
  }

  view = () => {
    const { view, evt, fields, searchFieldData, editMode } = this.state
    switch (view) {
      case 'Basic Info':
        return (
          <BasicInfo
            event={evt}
            fields={fields}
            searchFieldData={searchFieldData}
            editMode={editMode}
            edit={this.edit}
            close={this.close}
            setField={this.setField}
            resetForm={this.resetForm}
            handleChange={this.handleChange}
            handleSearchChange={this.handleSearchChange}
            handleSelect={this.handleSelect}
            handleSubmit={this.handleEditSubmit}
          />
        )
      case 'Logistics':
        return (
          <Logistics
            event={evt}
            fields={fields}
          />
        )
      case 'Invoice':
        return (
          <Invoice
            event={evt}
          />
        )
      case 'Cash Flow':
        return (
          <CashFlow
            event={evt}
          />
        )

      default:
    }
  }

  styleTab = (view) => {
    if (view === this.state.view) {
      return this.highlight()
    } else {
      return {}
    }
  }

  highlight = () => {
    return {
      backgroundColor: 'white',
      color: 'rgba(0,0,0,.88)',
      borderTop:'1px solid rgba(0,0,0,.88) '
    }
  }

  render(){
    return (
      <div className="EventDetail--container" onClick={this.resetSearchFieldData}>
        <div className="EventDetail--tab-control">
          <div className="Tab" style={this.styleTab("Basic Info")}  onClick={() => this.setView("Basic Info")}><h3>Basic Info</h3></div>
          <div className="Tab" style={this.styleTab("Logistics")}   onClick={() => this.setView("Logistics")}><h3>Logistics</h3></div>
          <div className="Tab" style={this.styleTab("Invoice")}    onClick={() => this.setView("Invoice")}><h3>Invoice</h3></div>
          <div className="Tab" style={this.styleTab("Cash Flow")}   onClick={() => this.setView("Cash Flow")}><h3>Cash Flow</h3></div>
        </div>
        {this.view()}
      </div>
    )
  }
}
