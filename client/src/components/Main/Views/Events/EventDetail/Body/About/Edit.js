import React, { Component } from 'react'
import SearchField from '../../../../../../SearchField/'
import { clientName } from '../../../../../../../helpers/clientHelpers'
import { locationName } from '../../../../../../../helpers/locationName'

export default class Edit extends Component {
  render(){
    const { fields, searchFieldData } = this.props
    return (
      <div className="About">

        <label>Client</label>

          <SearchField
            {...this.props}
            searchResults={searchFieldData && searchFieldData.clients}
            formClassName='Edit--Field'
            resultsClassName='Edit--results'
            resultClassName='Edit--result'
            formDataValue={this.props.formData && this.props.formData.client_id}
            formatResult={clientName}
            input={{
              className:'Input',
              name: 'client',
              value: fields.client? fields.client : '',
              tabIndex: 1
            }}
            handleChange={this.props.handleSearchChange}
            onEnter={this.props.onEnter}
            onSelect={this.props.onSelect}
            create={this.props.createClient}
          />

        <label>Location</label>

          <SearchField
            {...this.props}
            searchResults={searchFieldData && searchFieldData.locations}
            formClassName='Edit--Field'
            resultsClassName='Edit--results'
            resultClassName='Edit--result'
            formDataValue={this.props.formData && this.props.formData.location_id}
            formatResult={locationName}
            input={{
              className:'Input',
              name: 'location',
              value: fields.location? fields.location : '',
              tabIndex: 2
            }}
            handleChange={this.props.handleSearchChange}
            onEnter={this.props.onEnter}
            onSelect={this.props.onSelect}
          />

        <label>Kind</label>

          <div className="Edit--Field">
            <input
              className="Input"
              type="text"
              name='kind'
              value={fields.kind? fields.kind : ''}
              onChange={this.props.handleChange}
              tabIndex="3"
            />
          </div>

        <label>Package</label>

          <div className="Edit--Field">
            <input
              className="Input"
              type="text"
              name='package'
              value={fields.package? fields.package : ''}
              onChange={this.props.handleChange}
              tabIndex="4"
            />
          </div>

        <label>Action</label>

          <select
            className="Edit--Field"
            name="action"
            value={fields.action? fields.action : ''}
            onChange={this.props.handleChange}
            tabIndex="5"
          >
            <option></option>
            <option>Dial in Color</option>
            <option>Drive</option>
            <option>Drop Off</option>
            <option>Load In</option>
            <option>Load Out</option>
            <option>Load Truck</option>
            <option>Pick Up</option>
            <option>Rent Truck</option>
            <option>Return</option>
            <option>Run Montage</option>
            <option>Setup</option>
            <option>Site Check</option>
            <option>Strike</option>
          </select>

      </div>
    )
  }
}
