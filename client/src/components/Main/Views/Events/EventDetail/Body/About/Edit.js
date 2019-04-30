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
            resultClassName='Edit--search-result'
            resultsClassName='Edit--results'
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
          />

        <label>Location</label>

          <SearchField
            {...this.props}
            searchResults={searchFieldData && searchFieldData.locations}
            formClassName='Edit--Field'
            resultClassName='Edit--search-result'
            resultsClassName='Edit--results'
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

        <label>Action</label>

          <div className="Edit--Field">
            <input
              className="Input"
              type="text"
              name='action'
              value={fields.action? fields.action : ''}
              onChange={this.props.handleChange}
              tabIndex="5"
            />
          </div>

        <label>Kind</label>

          <div className="Edit--Field">
            <input
              className="Input"
              type="text"
              name='kind'
              value={fields.kind? fields.kind : ''}
              onChange={this.props.handleChange}
              tabIndex="6"
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
              tabIndex="8"
            />
          </div>

      </div>
    )
  }
}
