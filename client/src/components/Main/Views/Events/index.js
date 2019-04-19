import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import ListPage from '../../../ListPage/index.js'
import EventDetail from './EventDetail/index.js'
import { GOOGLE } from '../../../../services/google_service'
import { formatToGoogle, formatFromGoogle } from '../../../Helpers/googleFormatters'
import { event } from '../../../../services/event'
import { client } from '../../../../services/client'
import { clientName } from '../../../Helpers/clientHelpers'
import { eventTitle } from '../../../Helpers/eventTitle'
import queryString from 'query-string'
import moment from 'moment'
import axios from 'axios'

export default class Events extends Component {
  constructor(props){
    super(props)
    this.state = {
      events: null,
      hasMore: true,
      category: 'All',
      date: null,
      categories: ['Production', 'CANS', 'THC', 'CATP'],
      columnHeaders: ['title', 'client', 'location', 'confirmation', 'staff'],
      page: 1
    }
    this.axiosRequestSource = axios.CancelToken.source()
  }

  updateColumnHeaders = (e) => {
    const width = window.innerWidth
    if (width < 500) {
      this.setState({
        columnHeaders: null
      })
    } else if (width < 700) {
      this.setState({
        columnHeaders: ['title', 'staff', 'confirmation']
      })
    } else if (width < 900) {
      this.setState({
        columnHeaders: ['title', 'client', 'staff', 'confirmation']
      })
    } else {
      this.setState({
        columnHeaders: ['title', 'client', 'location', 'staff', 'confirmation']
      })
    }
  }

  componentWillReceiveProps(nextProps){
    this.setEvents(nextProps, 0)
  }

  componentDidMount() {
    this.updateColumnHeaders();
    window.addEventListener("resize", this.updateColumnHeaders);
    const calendarId = localStorage.getItem('google_calendar_id');
    this.setState({ calendarId, date: moment().startOf('day').toISOString(true) })
    this.setEvents(this.props, true)
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateColumnHeaders);
    this.axiosRequestSource && this.axiosRequestSource.cancel()
  }

  setEvents = async(props, mounted) => {
    const { category, dateStart, dateEnd } = this.state

    if (props) {
      const queries = queryString.parse(props.location.search)

      if (queries.category && queries.category !== category) {

        this.setState(
        {
          category: queries.category,
          dateStart: null,
          dateEnd: null,
          query: null,
          client: null,
          page: 1
        },
          async () => {
          await this.resetEvents()
          await this.fetchEvents()
        })

      } else if (queries.q) {

        this.setState(
        {
          query: queries.q,
          dateStart: null,
          dateEnd: null,
          category: queries.q,
          client: null,
          page: 1
        },
          async () => {
          await this.resetEvents()
          await this.fetchEvents()
        })

      } else if (queries.client) {
          const clt = await client.findById(queries.client, this.axiosRequestSource.token)
          this.setState(
          {
            query: null,
            dateStart: null,
            dateEnd: null,
            category: clientName(clt),
            client: queries.client,
            page: 1
          },
            async () => {
            await this.resetEvents()
            await this.fetchEvents()
          })

      } else if (mounted) {
        this.setState(
        {
          query: null,
          client: null,
          category: 'All',
          page: 1
        },
          async () => {
          await this.resetEvents()
          await this.fetchEvents()
        })
      }
    } else {
      let startDate = moment(dateStart).format('LL');
      let endDate = moment(dateEnd).format('LL')
      let dateCategory;
      if (dateStart && dateEnd && startDate === endDate) {
        dateCategory = `${moment(dateStart).format('LL')} - ${moment(dateStart).format('LL')}`
      } else {
        dateCategory = `${moment(dateStart).format('LL')}`
      }
      this.setState(
      {
        category: dateCategory,
        query: null,
        client: null,
        page: 1
      },
        async () => {
        await this.resetEvents()
        await this.fetchEvents()
      })
    }
  }

  fetchEvents = async() => {
    const { page, dateStart, dateEnd, category, query, client } = this.state
    let evts;
    if (query) {
      evts = await event.find(page, query, this.axiosRequestSource.token)
    } else if (client) {
      evts = await event.findByClient(page, client, this.axiosRequestSource.token)
    } else if (dateStart) {
      evts = await event.findByDate(page, dateStart, dateEnd, this.axiosRequestSource.token)
    } else {
      evts = await event.getAll(page, category, this.axiosRequestSource.token);
    }
    if (evts) {
      await this.updateEvents(evts);
      await this.incrementPage()
    }
  }

  resetPage = () => {
    this.setState({ page: 1 })
  }

  incrementPage = () => {
    this.setState(prevState => ({
      page: prevState.page +1
    }))
  }

  addEvent = async(formData) => {
    const { calendarId } = this.state
    let events = [...this.state.events]
    const newEvent = await event.createNew(formData, this.axiosRequestSource.token)
    const newGoogleEvent = await GOOGLE.createEvent(calendarId, formatToGoogle(newEvent))
    let formatted = await formatFromGoogle(newGoogleEvent, this.axiosRequestSource.token)

    if (formatted.event_employees_attributes) {

      let update = formatted.event_employees_attributes.filter(ee => {

        if (newEvent.staff && newEvent.staff.length) {
          return newEvent.staff.find(worker => worker.info.id !== ee.employee_id)
        } else {
          return 1
        }

      })

      if (update && update.length) {
        formatted.event_employees_attributes = update
      } else {
        delete formatted.event_employees_attributes
      }

    }

    const evt = await event.update(newEvent.id, formatted, this.axiosRequestSource.token)
    events.push(evt)
    events = events.sort((evtOne, evtTwo) => {
      return moment(evtOne.start).isBefore(moment(evtTwo.start))
    })
    this.setState({ events })
    return evt
  }

  deleteEvent = async(evt) => {
    const { calendarId } = this.state
    let events = [...this.state.events]
    await event.delete(evt.id, this.axiosRequestSource.token)
    if (evt.gcId) {
      await GOOGLE.deleteEvent(calendarId, evt.gcId, this.axiosRequestSource.token)
    }
    events = events.filter( e => e.id !== evt.id)
    this.setState({ events })
  }

  updateEvent = async(e, data) => {
    const { calendarId } = this.state
    if (e) {
      let events = [...this.state.events]
      let updatedEvent;
      if (data) {
        updatedEvent = await event.update(e.id, data, this.axiosRequestSource.token)
      } else {
        updatedEvent = e
      }
      if (e.gcId) {
        await GOOGLE.patchEvent(calendarId, e.gcId, formatToGoogle(updatedEvent), null, this.axiosRequestSource.token)
      } else if (this.state.calendarId) {
        const newGoogleEvent = await GOOGLE.createEvent(calendarId, formatToGoogle(updatedEvent), this.axiosRequestSource.token)
        let formatted = await formatFromGoogle(newGoogleEvent, this.axiosRequestSource.token)

        formatted = {
          ...data,
          ...formatted,
        }

        if (formatted.event_employees_attributes) {

          let update = formatted.event_employees_attributes.filter(ee => {

            if (formatted.employee_ids && formatted.employee_ids.length) {
              return formatted.employee_ids.find(id => ee.employee_id !== id)
            } else {
              return 1
            }

          })

          formatted.event_employees_attributes = update
        }
        updatedEvent = await event.update(e.id, formatted, this.axiosRequestSource.token)
      }

      const index = events.findIndex((event) => event.id === e.id)
      events[index] = updatedEvent
      this.setState({ events })
      return updatedEvent
    }
  }

  updateEvents = async(evts) => {
    if (evts) {
      const updatedEvents = evts.map( async(e) => {
        if (!e.summary) {
          e.summary = eventTitle(e)
          await event.update(e.id, {summary: e.summary}, this.axiosRequestSource.token)
        }
        const evt = await this.synchronizeWithGoogle(e)
        if (evt) {
          return evt
        } else {
          return e
        }
      })
      const loadedEvents = await Promise.all(updatedEvents)
      const events = [...this.state.events]
      loadedEvents.forEach(e => events.push(e))

      if (loadedEvents.length < 25) {
        this.setState({
          events,
          hasMore: false
        })

      } else {

        this.setState({
          events,
          hasMore: true
        })
      }

    } else {
      this.setState({
        events: [],
      })
    }
  }

  changeCategory = (category) => {
    this.setCategory(category);
    this.resetEvents();
  }

  setCategory = (category) => {
    if (category) {
      this.setState({ category })
    }
  }

  resetEvents = async() => {
    this.setState({ events: [] })
  }

  setRefresh = (value, url) => {
    const { history } = this.props
    this.setState({ willRefresh: value }, () => {
      if (url) {
        history.push(url)
      }
    })
  }

  handleStatusChange = async (evt, name, value) => {
    await this.updateEvent(evt, { [name]: value } )
  }

  handleDateChange = async(date) => {
    this.setState({
      dateStart: moment(date).startOf('day').toISOString(true),
      dateEnd:  moment(date).startOf('day').add(1, 'days').toISOString(true)
    },
    () =>  this.setEvents())
  }

  synchronizeWithGoogle = async (evt) => {
    const { calendarId } = this.state
    if (calendarId && evt.gcId) {
      const e = await GOOGLE.getEvent(calendarId, evt.gcId, this.axiosRequestSource.token)
      const formatted = await formatFromGoogle(e, this.axiosRequestSource.token)
      const synced = await event.sync(formatted, this.axiosRequestSource.token)
      return synced
    }
  }

  List = ({ match, history }) => {
    const { events, category, categories, columnHeaders, hasMore } = this.state
    return (
      <ListPage
        title="Events"
        type="Events"
        category={category}
        categories={categories}
        columnHeaders={columnHeaders}
        data={events}
        match={match}
        history={history}
        hasMore={hasMore}
        load={this.fetchEvents}
        create={this.handleCreate}
        refresh={this.setRefresh}
        handleStatusChange={this.handleStatusChange}
        handleDateChange={this.handleDateChange}
      />
    )
  }

  Show = ({ match, history }) => {
    let view;
    if (history.location.state) {
      view = history.location.state.view
    }
    const req_id = parseInt(match.params.id)
    const events = this.state.events
    let e;
    if (events) {
      e = events.find(event => event.id === req_id)
    }

    return (
      <EventDetail
        e={e}
        evtId={req_id}
        match={match}
        history={history}
        view={view}
        handleDelete={this.deleteEvent}
        handleUpdate={this.updateEvent}
      />
    )
  }

  Create = ({ match, history }) => {
    const isNew = match.path === '/admin/events/new'
    return (
      <EventDetail
        isNew={isNew}
        match={match}
        history={history}
        handleCreate={this.addEvent}
        handleDelete={this.deleteEvent}
        handleUpdate={this.updateEvent}
      />
    )
  }

  render(){
    const { match } = this.props
    return (
      <Switch>
        <Route exact path={match.path} render={ props => this.List(props)} />
        <Route exact path={`${match.path}/new`} render={ props => this.Create(props)} />
        <Route path={`${match.path}/:id`} render={ props => this.Show(props)} />
      </Switch>
    )
  }
}
