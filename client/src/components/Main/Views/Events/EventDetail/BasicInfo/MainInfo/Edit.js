import React, { Component } from 'react'
import moment from 'moment'
import Datetime from 'react-datetime'
import SearchField from './SearchField'
import { clientName } from '../../../../../../Helpers/clientHelpers'
import { locationName } from '../../../../../../Helpers/locationName'
import './react-datetime.css'
import './Edit.css'

export default class Edit extends Component {
  render(){
    const { fields, searchFieldData } = this.props
    return (
      <div className="MainInfo">

        <label>Client</label>

          <SearchField
            searchResults={searchFieldData && searchFieldData.clients}
            formClassName='Edit--field'
            resultClassName='Edit--search-result'
            resultsClassName='Edit--results'
            formDataValue={this.props.formData && this.props.formData.client_id}
            formatResult={clientName}
            input={{
              className:'Edit--input',
              placeholder:'search clients...',
              name: 'client',
              value: fields.client? fields.client : '',
              tabIndex: 1
            }}
            handleChange={this.props.handleSearchChange}
            onEnter={this.props.onEnter}
            onSelect={this.props.onSelect}
          />

        <label>Type/Action</label>

          <div className="Edit--field">
            <input
              className="Edit--input"
              type="text"
              name='action'
              value={fields.action? fields.action : ''}
              onChange={this.props.handleChange}
              tabIndex="5"
            />
          </div>

        <label>Location</label>

          <SearchField
            searchResults={searchFieldData && searchFieldData.locations}
            formClassName='Edit--field'
            resultClassName='Edit--search-result'
            resultsClassName='Edit--results'
            formDataValue={this.props.formData && this.props.formData.location_id}
            formatResult={locationName}
            input={{
              className:'Edit--input',
              placeholder:'search locations...',
              name: 'location',
              value: fields.location? fields.location : '',
              tabIndex: 2
            }}
            handleChange={this.props.handleSearchChange}
            onEnter={this.props.onEnter}
            onSelect={this.props.onSelect}
          />

        <label>Kind</label>

          <div className="Edit--field">
            <input
              className="Edit--input"
              type="text"
              name='kind'
              value={fields.kind? fields.kind : ''}
              onChange={this.props.handleChange}
              tabIndex="6"
            />
          </div>

        <label>Start</label>

          <div className="Edit--field datetime">
            <Datetime
              className="Edit--date-input-container"
              inputProps={{ className: "Edit--input", tabIndex: "3"}}
              value={fields.start? moment(fields.start) : ''}
              viewDate={fields.start && fields.start !== ''? moment(fields.start) : moment().startOf('hour')}
              timeConstraints={{ minutes:{ step: 5 } }}
              onChange={(datetime) => this.props.handleDateChange('start', datetime)}
              closeOnSelect={false}
              closeOnTab={true}
            />
          </div>

        <label>Description</label>

          <div className="Edit--field">
            <input
              className="Edit--input"
              type="text"
              name= 'description'
              value={fields.description? fields.description : ''}
              onChange={this.props.handleChange}
              tabIndex="7"
            />
          </div>

        <label>End</label>

          <div className="Edit--field datetime">
            <Datetime
              className="Edit--date-input-container"
              inputProps={{ className:"Edit--input", tabIndex:"4" }}
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

        <label>Package</label>

          <div className="Edit--field">
            <input
              className="Edit--input"
              type="text"
              name='package'
              value={fields.package? fields.package : ''}
              onChange={this.props.handleChange}
              tabIndex="8"
            />
          </div>

      </div>
    )
  }
}
