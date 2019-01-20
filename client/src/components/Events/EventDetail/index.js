import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import BasicInfo from './BasicInfo/index.js';
import Logistics from './Logistics/index.js';
import Invoice from './Invoice/index.js';
import CashFlow from './CashFlow/index.js';
import { event } from '../../../services/event';
import { client } from '../../../services/client';
import { place } from '../../../services/place';
import { eventTitle } from '../Helpers/eventTitle';
import { clientName } from '../Helpers/clientName';
import './index.css';

export default class EventDetail extends Component {
  constructor(props){
    super(props)
    this.state = {
      view: 'Basic Info',
      evt: null,
      fields: null,
      searchFieldData: null,
      formData: null,
      editMode: false,
      redirectToEvents: false
    }
  }

  async componentDidMount(){
    window.scrollTo(0,0);
    await this.setFields();
    await this.getEvent();
    await this.setClientName();
  }

  getEvent = async() => {
    const { e, eventId } = this.props
    if (!e) {
      const evt = await event.getOne(eventId)
      if (evt) {
        this.setState({ evt })
      } else {
        this.edit()
      }
    } else {
      this.setState({ evt: e })
    }
    await this.setFields();
  }

  findClients = async(query) => {
    const q = query.split('')
    if (q.length > 2) {
      const clients = await client.find(query)
      return clients
    }
  }

  findPlaces = async(query) => {
    const q = query.split('')
    if (q.length > 2) {
      const locations = await place.find(query)
      return locations
    }
  }

  setClientName(){
    const { evt } = this.state
    if (evt) {
      if (evt.client) {
        const name = clientName(evt.client)
        this.setField('client', name)
      }
    }
  }

  setFields = () => {
    const { evt } = this.state
    if (!evt) {
      const fieldNames = ['summary','start', 'end', 'action', 'kind', 'description', 'notes', 'package']
      fieldNames.forEach( field => this.setField( field, null ))
    } else {
      const fieldNames = ['summary','start', 'end', 'action', 'kind', 'description', 'notes', 'package']
      fieldNames.forEach( field => this.setField( field, evt[field] ))
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

  handleSearchChange = async(e) => {
    const { name, value } = e.target
    this.setField(name, value)
    switch (name) {
      case 'client':
        const clients = await this.findClients(value)
        this.setState({ searchFieldData: clients })
        break;
      case 'location':
        const locations = await this.findPlaces(value)
        this.setState({ searchFieldData: locations })
        break;
      default:
        break;
    }
  }

  handleSelect = (e, name, index) => {
    e.preventDefault();
    const { searchFieldData } = this.state
    if (searchFieldData.length > 0) {
      const item = searchFieldData[index]

      switch (name) {
        case 'client':
        const client = clientName(item);
          this.setState(prevState => ({
            formData: {
              ...prevState.formData,
              client_id: item.id
            },
            fields: {
              ...prevState.fields,
              [name]: client
            },
            searchFieldData: null
          }),() => {
            this.setState(prevState => ({
              fields: {
                ...prevState.fields,
                summary: eventTitle(prevState.fields)
              }
            }))
          })
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
    }), () => {
      this.setState(prevState => ({
        fields: {
          ...prevState.fields,
          summary: eventTitle(prevState.fields)
        },
        formData: {
          ...prevState.formData,
          summary: eventTitle(prevState.fields)
        }
      }))
    })
  }

  handleSubmit = async() => {
    const { evt, formData, editMode } = this.state
    if (formData) {
      if (!evt) {
        const newEvent = await event.createNew(formData)
        this.resetForm()
        this.setState({ evt: newEvent })
      } else {
        await event.update(evt.id, formData)
        this.resetForm();
        const updatedEvent = await event.getOne(evt.id)
        this.setState({
          evt: updatedEvent
        })
      }
      await this.setClientName();
      await this.setFields();
      this.props.fetchAllEvents();
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
            match={this.props.match}
            event={evt}
            fields={fields}
            searchFieldData={searchFieldData}
            editMode={editMode}
            edit={this.edit}
            delete={this.props.handleDelete}
            close={this.close}
            setField={this.setField}
            resetForm={this.resetForm}
            handleChange={this.handleChange}
            handleSearchChange={this.handleSearchChange}
            handleSelect={this.handleSelect}
            handleSubmit={this.handleSubmit}
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
    const { match } = this.props
    if (this.state.redirectToEvents) return (<Redirect to={match.path}/>)
    return (
      <div className="EventDetail--container" onClick={this.resetSearchFieldData}>
        <div className="EventDetail--tab-control">
          <div className="Tab" style={this.styleTab("Basic Info")}  onClick={() => this.setView("Basic Info")}><h3>BASIC INFO</h3></div>
          <div className="Tab" style={this.styleTab("Logistics")}   onClick={() => this.setView("Logistics")}><h3>LOGISTICS</h3></div>
          <div className="Tab" style={this.styleTab("Invoice")}    onClick={() => this.setView("Invoice")}><h3>INVOICE</h3></div>
          <div className="Tab" style={this.styleTab("Cash Flow")}   onClick={() => this.setView("Cash Flow")}><h3>CASH FLOW</h3></div>
        </div>
        {this.view()}
      </div>
    )
  }
}
