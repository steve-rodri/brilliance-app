import React, { Component } from 'react'
import Schedule from './Schedule/'
import Event from './Event/'
import Invoice from './Invoice/'
import Client from './Client/'
import Staff from './Staff/'
import moment from 'moment'
import { start, end, timeUntil } from '../../helpers/datetime'
import './index.css'

export default class ListItem extends Component {
  constructor(props){
    super(props)
    this.container = React.createRef()
  }

  changeScrollPosition = () => {
    if (this.container.current) {
      this.container.current.scrollIntoView()
    }
  }

  eventSummary = () => {
    const { item: e } = this.props
    if (e && e.summary) {

      let summary = e.summary;
      let slashWords = [];
      let hyphenWords = [];

      if (summary.search('/')) {
        slashWords = summary.split('/')
      }

      if (summary.search('-')) {
        hyphenWords = summary.split('-')
      }

      const words = slashWords.length > 1? slashWords : hyphenWords
      if (words.length > 1) {
        summary = words.join(' ')
        return <h4>{summary}</h4>
      } else {
        return <h4>{summary}</h4>
      }
    }
  }

  styleMobileEventSummary = () => {
    const { item: e } = this.props
    if (e && e.summary && e.summary.length > 30) {
      return { fontSize: '15px'}
    } else {
      return {}
    }
  }

  styleItem = (item) => {
    const { view, total, index, mobile, isMonth } = this.props
    const style = {}
    switch (view) {
      case 'Events':
        const event = item;
        // const past = event && event.end && moment(event.end).isBefore(moment())
        const hasInvoice = event && event.invoice
        // const inProgress = event && event.start && event.end && moment(event.start).isSameOrBefore(moment()) && moment(event.end).isSameOrAfter(moment())
        const nextEvent = event && event.isNextEvent
        // const iCalUID = event && event.iCalUid;

        // if (past) {
        //   style.color = 'rgba(0,0,0,.5)'
        //   style.backgroundColor = '#999999'
        // }

        if (hasInvoice) {
          style.borderLeft = '10px solid limegreen'
        }

        // if (inProgress) {
        //   style.color = '#eeeeee'
        //   style.backgroundColor = 'var(--light-blue)'
        // }

        if (nextEvent && isMonth()) {
          style.borderTop = '2px solid red'
        }

        // if (iCalUID) {
        //   style.backgroundColor = 'blue'
        // }

        if (mobile) {
          style.padding = '5px'
        }
      break;

      default:

      break;
    }

    if (index + 1 === total) {
      style.borderBottom = 'none'
    }

    return style;
  }

  styleCell = (position, event) => {
    const past = event && event.end && moment(event.end).isBefore(moment())
    const style = {}
    if (past) {
      switch (position) {
        case 'left':
          // style.borderRight = '1px solid #999999'
        break;
        case 'middle':
          // style.borderRight = '1px solid #999999'
        break;
        case 'right':
        break;
        default:
        break;
      }
    } else {
      switch (position) {
        case 'left':
          style.borderRight = '1px solid var(--light-gray)'
        break;
        case 'middle':
          style.borderRight = '1px solid var(--light-gray)'
        break;
        case 'right':
        break;
        default:
        break;
      }
    }

    return style
  }

  styleSummary = (summary) => {
    if (summary) {
      if (summary.length > 30) {
        return {
          fontSize: '12px'
        }
      } else {
        return {}
      }
    } else {
      return {}
    }
  }

  view = () => {
    const { item, view } = this.props
    switch (view) {
      case 'Dashboard':
        return (
          <Schedule
            {...this.props}
            start={start()}
            end={end()}
            timeUntil={timeUntil(item)}

            styleItem={this.styleItem}
            styleCell={this.styleCell}
            styleMobileEventSummary={this.styleMobileEventSummary}
            
            eventSummary={this.eventSummary}
          />
        )
      case 'Events':
        return (
          <Event
            {...this.props}
            start={start()}
            end={end()}
            styleItem={this.styleItem}
            styleCell={this.styleCell}
            styleSummary={this.styleSummary}
            styleMobileEventSummary={this.styleMobileEventSummary}
            eventSummary={this.eventSummary}
            changeScrollPosition={this.changeScrollPosition}
          />
        )
      case 'Invoices':
        return (
          <Invoice
            {...this.props}
            styleItem={this.styleItem}
            styleCell={this.styleCell}
          />
        )
      case 'Clients':
        return (
          <Client
            {...this.props}
            styleItem={this.styleItem}
            styleCell={this.styleCell}
            styleSummary={this.styleSummary}
          />
        )
      case 'Workers':
        return (
          <Staff
            {...this.props}
            styleItem={this.styleItem}
            styleCell={this.styleCell}
          />
        )
      default:
      return null
    }
  }

  render(){
    return (
      <div ref={this.container}>
        {this.view()}
      </div>
    )
  }
}
