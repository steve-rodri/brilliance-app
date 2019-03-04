import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import BasicInfo from './BasicInfo/index.js';
import Logistics from './Logistics/index.js';
import Invoice from './Invoice/index.js';
import CashFlow from './CashFlow/index.js';
import { event } from '../../../../../services/event';
import { client } from '../../../../../services/client';
import { place } from '../../../../../services/place';
import { eventTitle } from '../../../../Helpers/eventTitle';
import { clientName } from '../../../../Helpers/clientHelpers';
import { locationName } from '../../../../Helpers/locationName';
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
    }
  }

  async componentWillReceiveProps(nextProps){
    if (nextProps.e || nextProps.evtId) {
      await this.initialSetup(nextProps)
    }
  }

  async componentDidMount(){
    this.resetView()
    window.addEventListener('resize', this.resetView)
    window.scrollTo(0,0);
    await this.setFields();
    const { isNew } = this.props
    if (isNew) {
      this.switchEditMode()
      this.setField('summary', 'Create a New Event')
    } else {
      await this.initialSetup(this.props)
    }
  }

  async componentWillUnmount(){
    window.removeEventListener('resize', this.resetView)
  }

  resetView = () => {
    const width = window.innerWidth;
    if (width < 750) {
      this.setView('Basic Info')
      this.displayMobile(true)
    } else {
      this.displayMobile(false)
    }
  }

  displayMobile = (value) => {
    this.setState({ mobile: value })
  }

  initialSetup = async(props) => {
    await this.getEvent(props);
    await this.setClientName();
    await this.setLocationName();
  }

  getEvent = async(props) => {
    const { e, evtId } = props
      if (!e) {

        const evt = await event.getOne(evtId)
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
      const clients = await client.find(1, query)
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
        this.setFormData('client_id', evt.client.id)
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
            },
            formData: {
              location_id: evt.placeLocation.id
            }
          }))
        } else {
          this.setField('location', location)
          this.setFormData('location_id', evt.client.id)
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

  setFormData = (name, value) => {
    this.setState(prevState => ({
      formData: {
        ...prevState.formData,
        [name]: value
      }
    }))
  }

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
      }), () => {
        if (name !== 'summary') {
          this.updateSummaryField()
        }
      })

    }
  }

  handleDateChange = (field, datetime) => {
    let start;
    let end;
    switch (field) {
      case 'start':
        start = moment(datetime).format()
        end = moment(this.state.fields.end)

        if (end.isSameOrBefore(start) || !this.state.fields.end) {

          end = moment(start).add(1, 'hour').format()

          this.setState(prevState => ({
            fields: {
              ...prevState.fields,
              start: start,
              end: end
            },
            formData: {
              ...prevState.formData,
              start: start,
              end: end
            }
          }))

        } else {

          this.setState(prevState => ({
            fields: {
              ...prevState.fields,
              start: start.format()
            },
            formData: {
              ...prevState.formData,
              start: start.format()
            }
          }))

        }
      break;

      case 'end':
        end = moment(datetime);
        start = moment(this.state.fields.start)

        if (end.isAfter(start)) {
          this.setState(prevState => ({
            fields: {
              ...prevState.fields,
              end: end.format()
            },
            formData: {
              ...prevState.formData,
              end: end.format()
            }
          }))
        }
      break;

      default:
      break;
    }
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
    const { evt, formData, editMode } = this.state
    const { isNew, match, history } = this.props
    if (formData) {

      if (isNew) {

        const newEvt = await event.createNew(formData)
        await this.props.handleCreate(newEvt);
        const url = () => {
          let words = `${match.path}`.split('/')
          words.pop()
          const link = words.join('/')
          return link
        }
        history.push(`${url()}/${newEvt.id}`)

      } else {
        await event.update(evt.id, formData)
        const updatedEvent = await event.getOne(evt.id)
        await this.setState({ evt: updatedEvent })

        await this.resetForm()
        await this.setClientName();
        await this.setFields();
      }

      if (editMode) {
        this.switchEditMode()
      }

    } else {
      this.close()
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
    if (isNew) {
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
        {
          this.state.mobile?
          null
          :
          <div className="EventDetail--tab-control" style={this.styleTabControl()}>
            <div className="Tab" style={this.styleTab("Basic Info")} onClick={() => this.setView("Basic Info")}><h3>MAIN</h3></div>
            <div className="Tab" style={this.styleTab("Logistics")}  onClick={() => this.setView("Logistics")}><h3>LOGISTICS</h3></div>
            <div className="Tab" style={this.styleTab("Invoice")}    onClick={() => this.setView("Invoice")}><h3>INVOICE</h3></div>
            <div className="Tab" style={this.styleTab("Cash Flow")}  onClick={() => this.setView("Cash Flow")}><h3>CASH FLOW</h3></div>
          </div>
        }
        {this.view()}

      </div>
    )
  }
}
