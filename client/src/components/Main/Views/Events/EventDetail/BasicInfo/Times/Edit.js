import React, { Component } from 'react'
import Datetime from 'react-datetime'
import moment from 'moment'
import './react-datetime.css'

export default class Edit extends Component {
  render(){
    const { fields } = this.props
    return (
      <div className="Times">
        <label>Start</label>

          <div className="Edit--field datetime">
            <Datetime
              className="Input--container"
              inputProps={{ className: "Input", tabIndex: "3"}}
              value={fields.start? moment(fields.start) : ''}
              viewDate={fields.start && fields.start !== ''? moment(fields.start) : moment().startOf('hour')}
              timeConstraints={{ minutes:{ step: 5 } }}
              onChange={(datetime) => this.props.handleDateChange('start', datetime)}
              closeOnSelect={false}
              closeOnTab={true}
            />
          </div>

        <label>End</label>

          <div className="Edit--field datetime">
            <Datetime
              className="Input--container"
              inputProps={{ className:"Input", tabIndex:"4" }}
              value={fields.end? moment(fields.end) : ''}
              viewDate={fields.start? moment(fields.start) : fields.end? moment(fields.end): moment().startOf('hour')}
              viewMode={'time'}
              timeConstraints={{ minutes:{ step: 5 } }}
              isValidDate={(current) => current.isSameOrAfter(moment(fields.start), 'day')}
              onChange={(datetime) => this.props.handleDateChange('end', datetime)}
              closeOnSelect={true}
              closeOnTab={true}
            />
          </div>
      </div>
    )
  }
}
