import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import BasicInfo from './BasicInfo/index.js';
import Logistics from './Logistics/index.js';
import Invoice from './Invoice/index.js';
import CashFlow from './CashFlow/index.js';
import { event } from '../../../services/event';
import { client } from '../../../services/client';
import { place } from '../../../services/place';
import { eventTitle } from '../../Helpers/eventTitle';
import { clientName } from '../../Helpers/clientHelpers';
import { locationName } from '../../Helpers/locationName';
import moment from 'moment'
import './index.css';

export default class EventDetail extends Component {
  constructor(props){
    super(props)
    this.state = {
      view: 'Basic Info',
      evt: null,
      newEvt: null,
      fields: null,
      searchFieldData: null,
      formData: null,
      editMode: false,
      redirectToEvents: false,
    }
  }

  async componentDidMount(){
    window.scrollTo(0,0);
    await this.setFields();
    const { isNew } = this.props
    if (isNew) {
      this.switchEditMode()
      this.setField('summary', 'Create a New Event')
    } else {
      await this.initialSetup()
    }
  }

  initialSetup = async(newEvt) => {
    await this.getEvent(newEvt);
    await this.setClientName();
    await this.setLocationName();
  }

  resetNewEvent = () => {
    this.setState({ newEvt: null })
  }

  getEvent = async(newEvt) => {
    const { e, eventId } = this.props
      if (!e) {
        let evt;
        if (!newEvt) {
          evt = await event.getOne(eventId)
          if (evt) {
            this.setState({ evt })
          } else {
            this.setState({ redirectToEvents: true })
          }
        } else {
          evt = await event.getOne(newEvt.id)
          await this.setState({ evt })
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
        const name = clientName(evt.client, true)
        this.setField('client', name)
      } else {
        this.setField('client', null)
      }
    }
  }

  setLocationName(){
    const { evt } = this.state
    if (evt) {
      if (evt.placeLocation) {
        const location = locationName(evt.placeLocation)
        if (evt.placeLocation.installation) {
          this.setState(prevState => ({
            fields: {
              ...prevState.fields,
              location,
              onPremise: evt.placeLocation.installation
            }
          }))
        } else {
          this.setField('location', location)
        }
      }
    }
  }

  setFields = () => {
    const { evt } = this.state
    const fieldNames = ['summary', 'confirmation','start', 'end', 'action', 'kind', 'description', 'notes', 'package']
    if (!evt) {
      fieldNames.forEach( field => this.setField( field, null ))
    } else {
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

  handleDelete = async() => {
    const { evt } = this.state
    await event.delete(evt.id)
    await this.props.handleDelete(evt.id)
    this.setState({ redirectToEvents: true })
  }

  handleSearchChange = async(name, value) => {
    this.setField(name, value)

    switch (name) {
      case 'client':
        const clients = await this.findClients(value)
        if (!value || !clients || clients.length < 0) {

          this.setState(prevState => ({
            formData: {
              ...prevState.formData,
              client_id: null
            }
          }), () => {
            if (value.length === 0 || value.length > 2) {
              this.updateSummaryField()
            }
          })

        }

        this.setState(prevState => ({
          searchFieldData: {
            ...prevState.searchFieldData,
            clients
          }
        }))

      break;

      case 'location':
        const locations = await this.findPlaces(value)

        if (!value || !locations || locations.length < 0) {

          this.setState(prevState => ({
            formData: {
              ...prevState.formData,
              location_id: null
            },
            fields: {
              ...prevState.fields,
              onPremise: null
            }
          }), () => {
            if (value.length === 0 || value.length > 2) {
              this.updateSummaryField()
            }
          })

        }

        this.setState(prevState => ({
          searchFieldData: {
            ...prevState.searchFieldData,
            locations
          }
        }))

      break;

      default:
      break;
    }
  }

  handleFormSubmit = (e, name, index) => {
    if (e.key === 'Tab' || e.key === 'Enter') {
      this.handleSelect( e, name, index)
    }
  }

  handleSelect = (e, name, index) => {
    let item;
    const { searchFieldData } = this.state

    if (searchFieldData) {
      switch (name) {

        case 'client':
          item = searchFieldData.clients[index]
          const client = clientName(item);
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
            }), () => this.updateSummaryField())
          }

        break;

        case 'location':
          item = searchFieldData.locations[index]
          const location = locationName(item)

          if (item) {
            this.setState(prevState => ({
              formData: {
                ...prevState.formData,
                location_id: item.id
              },
              fields: {
                ...prevState.fields,
                location,
                onPremise: item.installation
              }
            }), () => this.updateSummaryField())
          }

        break;

        default:
          this.setState(prevState => ({
            formData: {
              ...prevState.formData,
              [name]: item.id
            }
          }))
        break;
      }
    }
  }

  handleChange = (e) => {
    if (e) {
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
      }), () => this.updateSummaryField())

    }
  }

  handleDateChange = (field, datetime) => {
    const dt = moment(datetime).format()
    this.setState(prevState => ({
      fields: {
        ...prevState.fields,
        [field]: dt
      },
      formData: {
        ...prevState.formData,
        [field]: dt
      }
    }))
  }

  handleStatusChange = (name, value) => {
    this.setState(prevState => ({
      fields: {
        ...prevState.fields,
        [name]: value
      },
      formData: {
        ...prevState.formData,
        [name]: value
      }
    }), async() => await this.handleSubmit())
  }

  handleSubmit = async() => {
    const { evt, newEvt, formData, editMode } = this.state
    const { isNew } = this.props
    if (formData) {

      if (isNew && !newEvt) {

        const newEvt = await event.createNew(formData)
        await this.props.handleCreate(newEvt);
        this.setState({ newEvt }, async() => await this.initialSetup(newEvt))

      } else {

        await event.update(evt.id, formData)
        const updatedEvent = await event.getOne(evt.id)
        this.setState({ evt: updatedEvent })
        await this.props.handleUpdate(updatedEvent)

        await this.resetForm()
        await this.setClientName();
        await this.setFields();
      }

      if (editMode) {
        this.switchEditMode()
      }

    }
  }

  updateSummaryField = () => {
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
  }

  switchEditMode = () => {
    this.setState({editMode: !this.state.editMode})
  }

  close = () => {
    this.resetForm();
    this.resetSearchFieldData();
    this.switchEditMode();
    this.setFields();
    this.setClientName();
    this.setLocationName();
  }

  resetSearchFieldData = async() => {
    this.setState({
      searchFieldData: null
    })
  }

  resetForm = () => {
    this.setState({
      formData: null,
    })
  }

  setView = (view) => {
    this.setState({ view })
  }

  view = () => {
    switch (this.state.view) {
      case 'Basic Info':
        return (
          <BasicInfo
            {...this.state}
            {...this.props}
            edit={this.switchEditMode}
            close={this.close}
            delete={this.handleDelete}
            handleChange={this.handleChange}
            handleStatusChange={this.handleStatusChange}
            handleDateChange={this.handleDateChange}
            handleSearchChange={this.handleSearchChange}
            handleSubmit={this.handleSubmit}
            onSelect={this.handleSelect}
            onEnter={this.handleFormSubmit}
          />
        )
      case 'Logistics':
        return (
          <Logistics
            {...this.state}
          />
        )
      case 'Invoice':
        return (
          <Invoice
            {...this.state}
          />
        )
      case 'Cash Flow':
        return (
          <CashFlow
            {...this.state}
          />
        )
      default:
    }
  }

  styleTabControl = () => {
    const isNew = this.props.isNew
    const newEvt = this.state.newEvt
    if (isNew && !newEvt) {
      return { display: 'none' }
    } else {
      return {}
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
      backgroundColor: 'var(--light-gray)',
      color: 'rgba(0,0,0,.88)',
      borderTop:'1px solid rgba(0,0,0,.88) '
    }
  }

  render(){
    if (this.state.redirectToEvents) return (<Redirect to='/admin/events'/>)
    return (
      <div className="EventDetail--container">
        <div className="EventDetail--tab-control" style={this.styleTabControl()}>
          <div className="Tab" style={this.styleTab("Basic Info")} onClick={() => this.setView("Basic Info")}><h3>MAIN</h3></div>
          <div className="Tab" style={this.styleTab("Logistics")}  onClick={() => this.setView("Logistics")}><h3>LOGISTICS</h3></div>
          <div className="Tab" style={this.styleTab("Invoice")}    onClick={() => this.setView("Invoice")}><h3>INVOICE</h3></div>
          <div className="Tab" style={this.styleTab("Cash Flow")}  onClick={() => this.setView("Cash Flow")}><h3>CASH FLOW</h3></div>
        </div>
        {this.view()}
      </div>
    )
  }
}
