import React, { Component } from 'react'
import { Switch } from 'react-router-dom'
import { PrivateRoute } from '../../helpers/customRouters.js'
import Admin from './Admin'
import { GOOGLE } from '../../services/google_service'
import { event } from '../../services/BEP_APIcalls'
import { formatFromGoogle } from '../../helpers/googleFormatters'
import moment from 'moment'
import axios from 'axios'

export default class Main extends Component {
  constructor(props){
    super(props)
    this.state = {
      date: {
        start: moment().startOf('day').toISOString(true),
        end: moment().endOf('day').toISOString(true)
      },
      isLoading: false
    }
    this.axiosRequestSource = axios.CancelToken.source()
    this.ajaxOptions = {
      cancelToken: this.axiosRequestSource.token,
      unauthorizedCB: this.props.signout,
      sendCount: true
    }
  }

  // -----------------------------LifeCycle-------------------------------------

  async componentDidMount(){
    this.resetView()
    window.addEventListener('resize', this.resize)
    // await this.synchronizeAllEvents()
  }

  async componentWillUnmount(){
    window.removeEventListener('resize', this.resize)
    this.axiosRequestSource && this.axiosRequestSource.cancel()
  }

  componentDidUpdate(prevProps){
    const { location } = this.props;
    const { mobile } = this.state;
    if (mobile) {
      if (location && location.state) {
        this.setState( prevState => {
          const { displayNav } = prevState
          const { nav } = location.state
          if (displayNav !== nav) {
            return {
              displayNav: nav
            }
          }
        })
      }
    }
  }

  // ------------------------Getters-And-Setters--------------------------------

  setCategories = (categories) => {
    this.setState({ categories })
  }

  isDay = () => {
    const { date } = this.state
    const isDay = moment(date.end).diff(moment(date.start), 'days') <= 1
    return isDay
  }

  isMonth = () => {
    const { date: { start: s, end: e } } = this.state
    const start = moment(s);
    const end = moment(e);
    const isMonth = (
      start.month() === end.month() &&
      start.date() === 1 &&
      end.date() === start.daysInMonth()
    )
    return isMonth
  }

  handleDateChange = (date, type) => {
    if (type) {
      this.setState( prevState => ({
        date: {
          start: moment(date).startOf(type).toISOString(true),
          end:  moment(date).endOf(type).toISOString(true)
        }
      }))
      if (type === 'day') this.changeNav(false)
    }
  }


  // -------------------------------Google--------------------------------------

  synchronizeAllEvents = async() => {
    const calendarId = localStorage.getItem('google_calendar_id')
    const events = await GOOGLE.getEvents(calendarId, this.ajaxOptions)
    if (events) {
      const evts = await Promise.all( events.map( async evt => await formatFromGoogle( evt, this.ajaxOptions ) ) )
      await Promise.all( evts.map( async evt => await event.sync(evt, this.ajaxOptions ) ) )
    }
  }

  // ------------------------------View-----------------------------------------

  displayMobile = (value) => this.setState({ mobile: value })

  setView= (view) => this.setState({ view })

  resetView = () => {
    const width = window.innerWidth;
    if (width < 750) {
      this.displayMobile(true)
    } else {
      this.displayMobile(false)
    }
  }

  updateNav = (e) => {
    if (window.innerWidth > 1000) {
      this.setState({ displayNav: false })
    }
  }

  changeNav = (value) => {
    const { history, location } = this.props
    this.setState({ displayNav: value })
    history.push({pathname: `${location.pathname}`, state: { nav: value }})
  }

  resize = () => {
    this.resetView()
    this.updateNav()
  }

  setLoadingState = (value) => {
    this.setState({ loading: value })
  }

  camelToSnakeCase = str => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

  singularView = () => {
    const { view } = this.state
    if (view) return view.split('').splice(0, view.length - 1).join('')
    return ''
  }

  render(){
    return(
      <div className="App">
        <Switch>
          <PrivateRoute
            path="/admin"
            component={Admin}
            {...this.props}
            {...this.state}

            setView={this.setView}
            setCategories={this.setCategories}
            setLoadingState={this.setLoadingState}
            changeNav={this.changeNav}

            onDateChange={this.handleDateChange}
            isMonth={this.isMonth}
            isDay={this.isDay}

            syncAllEvents={this.synchronizeAllEvents}

            camelToSnake={this.camelToSnakeCase}
            singularView={this.singularView}
          />
        </Switch>
      </div>
    )
  }
}
