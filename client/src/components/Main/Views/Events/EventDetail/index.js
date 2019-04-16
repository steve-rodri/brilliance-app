import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import BasicInfo from './BasicInfo/index.js';
import Invoice from './Invoice/index.js';
import CashFlow from './CashFlow/index.js';
import StaffModal from './StaffModal.js';
import { GOOGLE } from '../../../../../services/google_service';
import { event } from '../../../../../services/event';
import { client } from '../../../../../services/client';
import { place } from '../../../../../services/place';
import { eventEmployee } from '../../../../../services/eventEmployee';
import { employee } from '../../../../../services/employee'
import { eventTitle } from '../../../../Helpers/eventTitle';
import { clientName } from '../../../../Helpers/clientHelpers';
import { locationName } from '../../../../Helpers/locationName';
import { formatFromGoogle } from '../../../../Helpers/googleFormatters';
import moment from 'moment'
import axios from 'axios'
import './index.css';

export default class EventDetail extends Component {
  constructor(props){
    super(props)
    this.state = {
      view: 'Basic Info',
      evt: null,
      workers: [],
      fields: null,
      searchFieldData: null,
      formData: null,
      editMode: false,
      showStaffModal: false,
      redirectToEvents: false,
    }
    this.axiosRequestSource = axios.CancelToken.source()
  }

// ---------------------------------LifeCycle-----------------------------------

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
      this.setField('summary', 'New Event')
      this.setFormData('summary', 'New Event')
      this.handleDateChange('start', moment().startOf('hour').format())
    } else {
      await this.initialSetup(this.props)
    }
  }

  async componentWillUnmount(){
    window.removeEventListener('resize', this.resetView)
    this.axiosRequestSource && this.axiosRequestSource.cancel()
  }

// ----------------------------Getters-and-Setters------------------------------

  initialSetup = async(props) => {
    await this.setEvent(props);
    await this.setClientName();
    await this.setLocationName();
    if (props.view) this.setView(props.view)
  }

  synchronizeWithGoogle = async (evt) => {
    const calendarId = localStorage.getItem('google_calendar_id');
    if (calendarId && evt.gcId) {
      try {
        const e = await GOOGLE.getEvent(calendarId, evt.gcId, this.axiosRequestSource.token)
        if (e) {
          const formatted = await formatFromGoogle(e, this.axiosRequestSource.token)
          const synced = await event.sync(formatted, this.axiosRequestSource.token)
          return synced
        }
        else {
          return evt
        }

      } catch (e) {
        return evt
      }
    } else {
      return evt
    }
  }

  setEvent = async(props) => {
    const { e, evtId } = props

    if (!e) {
      let evt = await event.getOne(evtId, this.axiosRequestSource.token)
      if (evt) {
        evt = await this.synchronizeWithGoogle(evt);
        this.setState({ evt, workers: evt.staff })
      } else {
        this.setState({ redirectToEvents: true })
      }
    } else {
      const evt = await this.synchronizeWithGoogle(e);
      this.setState({ evt, workers: e.staff })
    }

    await this.setFields();
  }

  setFields = () => {
    const { evt } = this.state
    const fieldNames = ['summary', 'confirmation','start', 'end', 'callTime', 'action', 'kind', 'description', 'notes', 'package']
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

  setClientName = () => {
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

  setLocationName = () => {
    const { evt } = this.state
    if (evt) {
      if (evt.location) {
        const location = locationName(evt.location)
        if (evt.location.installation) {
          this.setState(prevState => ({
            fields: {
              ...prevState.fields,
              location,
              onPremise: evt.location.installation
            },
            formData: {
              location_id: evt.location.id
            }
          }))
        } else {
          this.setField('location', location)
          this.setFormData('location_id', evt.location.id)
        }
      }
    }
  }

  setCallLocationName = () => {
    const { evt } = this.state
    if (evt) {
      if (evt.callLocation) {
        const callLocation = locationName(evt.callLocation)
        this.setField('callLocation', callLocation)
        this.setFormData('call_location_id', evt.callLocation.id)
      }
    }
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

  resetStaff = async() => {
    const { formData, workers } = this.state
    if (formData) {
      if (formData.employee_ids && formData.employee_ids.length) {

        //for each employee id, find workers with no corresponding employee id
        const originals = workers.filter( worker => {
          return formData.employee_ids.find( id => worker.info.id !== id)
        })

        //for each employee id, find workers with a corresponding employee id
        const addedWorkers = workers.filter( worker => {
          return formData.employee_ids.find( id => worker.info.id === id)
        })

        //delete addedWorkers
        await Promise.all(addedWorkers.map( async worker => {
          await eventEmployee.delete(worker.id, this.axiosRequestSource.token)
        }))

        //set state with original workers, and reset employee ids
        this.setState(prevState => ({
          workers: originals,
          formData: {
            ...prevState.formData,
            employee_ids: []
          }
        }))
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

// -------------------------------Handle-Changes--------------------------------

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
        if (name !== 'summary' && name !== 'notes') {
          this.updateSummaryField()
        }
      })

    }
  }

  handleDateChange = (field, datetime) => {
    let start;
    let end;
    let call;
    if (datetime) {
      switch (field) {
        case 'start':
          start = moment(datetime).format()
          end = moment(this.state.fields.end)
          call = moment(this.state.fields.callTime)

          if (
            (moment(end).isSameOrBefore(moment(start)) || !this.state.fields.end) &&
            (moment(call).isSameOrAfter(moment(start)) || !this.state.fields.callTime)
          )
          {
            call = start
            end = moment(start).add(1, 'hour').format()

            this.setState(prevState => ({
              fields: {
                ...prevState.fields,
                start,
                end,
                callTime: call
              },
              formData: {
                ...prevState.formData,
                start,
                end,
                call_time: call
              }
            }))

          } else if (moment(end).isSameOrBefore(moment(start)) || !this.state.fields.end) {

            end = moment(start).add(1, 'hour').format()

            this.setState(prevState => ({
              fields: {
                ...prevState.fields,
                start,
                end
              },
              formData: {
                ...prevState.formData,
                start,
                end
              }
            }))

          } else if (moment(call).isSameOrAfter(moment(start)) || !this.state.fields.callTime) {
            call = start

            this.setState(prevState => ({
              fields: {
                ...prevState.fields,
                start,
                callTime: call
              },
              formData: {
                ...prevState.formData,
                start,
                call_time: call
              }
            }))

          } else {

            this.setState(prevState => ({
              fields: {
                ...prevState.fields,
                start
              },
              formData: {
                ...prevState.formData,
                start
              }
            }))

          }
        break;

        case 'end':
          end = moment(datetime).format();
          start = moment(this.state.fields.start)

          if (moment(end).isAfter(start)) {
            this.setState(prevState => ({
              fields: {
                ...prevState.fields,
                end
              },
              formData: {
                ...prevState.formData,
                end
              }
            }))
          }
        break;

        case 'call':
          call = moment(datetime).format();
          start = moment(this.state.fields.start)

          if (moment(call).isSameOrBefore(start)) {
            this.setState(prevState => ({
              fields: {
                ...prevState.fields,
                callTime: call
              },
              formData: {
                ...prevState.formData,
                call_time: call
              }
            }))
          }
        break;

        default:
        break;
      }
    } else {
      switch (field) {
        case 'start':
          this.setState(prevState => ({
            fields: {
              ...prevState.fields,
              start: ''
            },
            formData: {
              ...prevState.formData,
              start: ''
            }
          }))
        break;
        case 'end':
          this.setState(prevState => ({
            fields: {
              ...prevState.fields,
              end: ''
            },
            formData: {
              ...prevState.formData,
              end: ''
            }
          }))
        break;
        case 'call':
          this.setState(prevState => ({
            fields: {
              ...prevState.fields,
              callTime: ''
            },
            formData: {
              ...prevState.formData,
              call_time: ''
            }
          }))
        break;
        default:
        break;
      }
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

      case 'callLocation':
        const callLocations = await this.findPlaces(value)

        if (!value || !callLocations || callLocations.length < 0) {

          this.setState(prevState => ({
            formData: {
              ...prevState.formData,
              call_location_id: null
            }
          }))

        }

        this.setState(prevState => ({
          searchFieldData: {
            ...prevState.searchFieldData,
            callLocations
          }
        }))

      break;

      default:
      break;
    }
  }

// --------------------------------Search-Field---------------------------------

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

        case 'callLocation':
          item = searchFieldData.callLocations[index]
          const callLocation = locationName(item)

          if (item) {
            this.setState(prevState => ({
              formData: {
                ...prevState.formData,
                call_location_id: item.id
              },
              fields: {
                ...prevState.fields,
                callLocation
              }
            }))
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

  handleFormSubmit = (e, name, index) => {
    if (e.key === 'Tab' || e.key === 'Enter') {
      this.handleSelect( e, name, index)
    }
  }

// -----------------------------Search-Field-Data-------------------------------

  findClients = async(query) => {
    const q = query.split('')
    if (q.length > 2) {
      const clients = await client.find(1, query, this.axiosRequestSource.token)
      return clients
    }
  }

  findPlaces = async(query) => {
    const q = query.split('')
    if (q.length > 2) {
      const locations = await place.find(query, this.axiosRequestSource.token)
      return locations
    }
  }

// --------------------------------Event-Staff----------------------------------

  openStaffModal = () => {
    this.setState({ showStaffModal: true })
  }

  closeStaffModal = () => {
    this.setState({ showStaffModal: false })
  }

  chooseWorker = async() => {
    await this.getActiveEmployees()
    await this.openStaffModal()
  }

  handleEmployeeSelect = (employee) => {
    const { workers, formData } = this.state
    if (formData) {
      const { employee_ids } = formData
      const scheduled = workers.find(worker => worker.info.id === employee.id) || (employee_ids && employee_ids.find(id => id === employee.id))
      if (scheduled) {
        this.removeWorker(scheduled)
      } else {
        this.addWorker(employee)
      }
    } else {
      this.addWorker(employee)
    }
  }

  addWorker = async (employee) => {
    const { formData } = this.state
    if (this.props.isNew) {
      if (formData) {
        if (formData.event_employees_attributes && formData.event_employees_attributes.length) {
          this.setState(prevState => ({
            formData:{
              ...prevState.formData,
              event_employees_attributes:[
                ...prevState.formData.event_employees_attributes,
                { employee_id: employee.id }
              ]
            },
            workers: [
              ...prevState.workers,
              { info: employee }
            ]
          }))
        } else {
          this.setState(prevState => ({
            formData: {
              ...prevState.formData,
              event_employees_attributes:[ { employee_id: employee.id } ]
            },
            workers: [ { info: employee } ]
          }))
        }
      } else {
        this.setState({
          formData:{ event_employees_attributes:[ { employee_id: employee.id } ] },
          workers: [ { info: employee } ]
        })
      }
    } else {

      const evt  = { ...this.state.evt }
      const workers = [...this.state.workers]
      const newWorker = await eventEmployee.create(
        {
          event_id: evt.id,
          employee_id: employee.id
        },
        this.axiosRequestSource.token
      )
      workers.push(newWorker)
      evt.staff = workers
      this.setState({ evt, workers })

      if (formData) {
        if (formData.event_employees_attributes && formData.event_employees_attributes.length) {
          this.setState(prevState => ({
            formData:{
              ...prevState.formData,
              event_employees_attributes:[
                ...prevState.formData.event_employees_attributes,
                { id: newWorker.id, employee_id: employee.id }
              ]
            }
          }))
        } else {
          this.setState(prevState => ({
            formData: {
              ...prevState.formData,
              event_employees_attributes:[ { id: newWorker.id, employee_id: employee.id } ]
            }
          }))
        }
      } else {
        this.setState({
          formData:{ event_employees_attributes:[ { id: newWorker.id, employee_id: employee.id } ] }
        })
      }
    }
  }

  removeWorker = async (worker) => {
    const evt  = { ...this.state.evt }
    const workers = [...this.state.workers]
    const { formData } = this.state

    if (!this.props.isNew) {
      await eventEmployee.delete(worker.id, this.axiosRequestSource.token)
    }

    const updatedWorkers = workers.filter(w => w.id !== worker.id)
    evt.staff = updatedWorkers

    if (formData && formData.event_employees_attributes && formData.event_employees_attributes.length) {

      const event_employees_attributes = formData.event_employees_attributes.filter( obj => {
        const worker = workers.find(worker => worker.info.id !== obj.employee_id)
        return worker
      })

      this.setState(prevState => ({
        formData: {
          ...prevState.formData,
          event_employees_attributes
        },
        evt,
        workers: updatedWorkers
      }))

    } else {

      this.setState(prevState => ({
        evt,
        workers: updatedWorkers
      }))

    }
  }

  getActiveEmployees = async() => {
    const allEmployees = await employee.getAll()
    const employees = allEmployees.filter(employee => employee['active?'])
    this.setState({ employees })
  }

// ----------------------------------DB-CRUD------------------------------------

  handleSubmit = async() => {
    const { evt, formData, editMode } = this.state
    const { isNew, match, history } = this.props
    if (isNew) {
      if (formData) {
        const newEvt = await this.props.handleCreate(formData);
        const url = () => {
          let words = `${match.path}`.split('/')
          words.pop()
          const link = words.join('/')
          return link
        }
        history.push(`${url()}/${newEvt.id}`)
      } else {
        this.close()
      }
    } else {
      const updatedEvent = await this.props.handleUpdate(evt, formData)
      await this.setState({ evt: updatedEvent })

      await this.resetForm()
      await this.setClientName();
      await this.setFields();
    }

    if (editMode) {
      this.switchEditMode()
    }
  }

  handleDelete = async() => {
    const { evt } = this.state
    await this.props.handleDelete(evt)
    this.setState({ redirectToEvents: true })
  }

// -----------------------------------Views-------------------------------------

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

            chooseWorker={this.chooseWorker}
            addWorker={this.addWorker}
            removeWorker={this.removeWorker}
          />
        )
      case 'Invoice':
        return (
          <Invoice
            {...this.state}
            {...this.props}
            setView={this.setView}
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

  setView = (view) => {
    this.setState({ view })
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

  close = () => {
    this.resetForm();
    this.resetSearchFieldData();
    this.resetStaff();
    this.switchEditMode();
    this.setFields();
    this.setClientName();
    this.setLocationName();
  }

  switchEditMode = () => {
    this.setState({editMode: !this.state.editMode})
  }

  displayMobile = (value) => {
    this.setState({ mobile: value })
  }

// -----------------------------------Styles------------------------------------

  styleTab = (view) => {
    if (view === this.state.view) {
      return this.highlight()
    } else {
      return {}
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

  highlight = () => {
    return {
      backgroundColor: 'var(--light-gray)',
      color: 'rgba(0,0,0,.88)',
      borderTop:'1px solid rgba(0,0,0,.88) '
    }
  }

// -----------------------------------Render------------------------------------

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
            <div className="Tab" style={this.styleTab("Invoice")}    onClick={() => this.setView("Invoice")}><h3>INVOICE</h3></div>
            <div className="Tab" style={this.styleTab("Cash Flow")}  onClick={() => this.setView("Cash Flow")}><h3>CASH FLOW</h3></div>
          </div>
        }
        {this.view()}
        {
          this.state.showStaffModal?
          <StaffModal
            close={this.closeStaffModal}
            workers={this.state.workers}
            employees={this.state.employees}
            handleEmployeeSelect={this.handleEmployeeSelect}
          />
          :
          null
        }
      </div>
    )
  }
}
