import React, { Component } from 'react'
import Datetime from 'react-datetime'
import moment from 'moment'
import './react-datetime.css'
import './index.css'

export default class DateSelector extends Component {
  constructor(props){
    super(props)
    this.state = {
      open: false
    }
    this.button = React.createRef()
  }

  open = () => this.setState({ open: true })

  close = (e) => {
    const { selecting } = this.state;
    if (!selecting) this.setState({ open: false })
  }

  switch = (e) => {
    e.preventDefault()
    e.stopPropagation()
    this.setState({ open: !this.state.open })
  }

  selecting = (e) => {
    this.setState({ selecting: true })
    this.button.current.focus()
  }

  notSelecting = (e) => {
    this.setState({ selecting: false })
    this.button.current.focus()
  }

  render(){
    const { name, value, handleDateChange, viewMode, viewDate, isValid } = this.props
    const displayValue = value && moment(value).isValid()? moment(value).format('llll') : ''
    return (
      <div className="DateSelector">
        <button
          className="Edit--Field datetime"
          onClick={this.switch}
          onBlur={this.close}
          ref={this.button}
        >
          <h3>{displayValue}</h3>
        </button>
        <div
          className="DateSelector--container"
          onMouseEnter={this.selecting}
          onMouseLeave={this.notSelecting}
          onBlur={this.close}
        >
          <Datetime
            input={false}
            open={this.state.open}
            value={moment(value).isValid()? moment(value) : ''}
            viewDate={viewDate}
            viewMode={viewMode}
            isValidDate={isValid}
            timeConstraints={{ minutes:{ step: 5 } }}
            onChange={ datetime => handleDateChange(name, datetime)}
            closeOnSelect={false}
          />
        </div>
      </div>
    )
  }
}
