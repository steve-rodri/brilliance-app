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
import { clientName } from '../Helpers/clientName';
import { locationName } from '../Helpers/locationName';
import moment from 'moment'
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
      redirectToEvents: false,
      redirectToEvent: false
    }
  }

  async componentDidMount(){
    window.scrollTo(0,0);
    await this.setFields();
    const { isNew } = this.props
    if (isNew) {
      this.edit()
      this.setField('summary', 'Create a New Event')
    } else {
      await this.getEvent();
      await this.setClientName();
      await this.setLocationName();
    }
  }

  getEvent = async() => {
    const { e, eventId } = this.props
      if (!e) {
        const evt = await event.getOne(eventId)
        if (evt) {
          this.setState({ evt })
        } else {
          this.setState({ redirectToEvents: true })
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

  handleDelete = async() => {
    const { evt } = this.state
    await event.delete(evt.id)
    await this.props.fetchAllEvents()
    this.setState({ redirectToEvents: true })
  }

  handleSearchChange = async(e) => {
    const { name, value } = e.target
    this.setField(name, value)
    switch (name) {
      case 'client':
        const clients = await this.findClients(value)
        if (!value) {
          this.setState(prevState => ({
            formData: {
              ...prevState.formData,
              client_id: null
            }
          }),() => {
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
        this.setState(prevState => ({
          searchFieldData: {
            ...prevState.searchFieldData,
            clients
          }
         }))
        break;
      case 'location':
        const locations = await this.findPlaces(value)
        if (!value) {
          this.setState(prevState => ({
            formData: {
              ...prevState.formData,
              location_id: null
            },
            fields: {
              ...prevState.fields,
              onPremise: null
            }
          }),() => {
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

  handleSelect = (e, name, index) => {
    if (e.key === 'Tab' || e.key === 'Enter') {

      let item;
      const { searchFieldData } = this.state

      if (searchFieldData) {
        switch (name) {
          case 'client':
            item = searchFieldData.clients[index]
            const client = clientName(item);

              this.setState(prevState => ({
                formData: {
                  ...prevState.formData,
                  client_id: item.id
                },
                fields: {
                  ...prevState.fields,
                  client
                }
              }),() => {
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
            break;

          case 'location':
            item = searchFieldData.locations[index]
            const location = locationName(item)
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
            }),() => {
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

  handleSubmit = async() => {
    const { evt, formData, editMode } = this.state
    const { isNew } = this.props
    if (formData) {
      if (isNew) {
        const newEvent = await event.createNew(formData)
        this.resetForm()
        this.setState({
          evt: newEvent,
          redirectToEvents: true
        })
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
      await this.props.fetchAllEvents();
    }
    this.setState({editMode: !editMode})
  }

  edit = () => {
    this.setState({editMode: !this.state.editMode})
  }

  close = () => {
    this.resetForm();
    this.resetSearchFieldData();
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
      editMode: !this.state.editMode
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
            edit={this.edit}
            close={this.close}
            setField={this.setField}
            resetForm={this.resetForm}
            delete={this.handleDelete}
            handleChange={this.handleChange}
            handleDateChange={this.handleDateChange}
            handleSearchChange={this.handleSearchChange}
            onSelect={this.handleSelect}
            handleSubmit={this.handleSubmit}
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
    const { evt } = this.state
    if (this.state.redirectToEvents) return (<Redirect to='/admin/events'/>)
    if (this.state.redirectToEvent) return (<Redirect to={`/admin/events/${evt.id}`}/>)
    return (
      <div className="EventDetail--container">
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
