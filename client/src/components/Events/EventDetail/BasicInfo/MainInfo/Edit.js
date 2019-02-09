import React, { Component } from 'react'
import moment from 'moment'
import Datetime from 'react-datetime'
import { clientName } from '../../../../Helpers/clientHelpers'
import { locationName } from '../../../../Helpers/locationName'
import './react-datetime.css'
import './Edit.css'

export default class Edit extends Component {
  constructor(props){
    super(props)
    this.state = {
      hoveringResults: false,
      activeField: null
    }
  }

  choosingResult = (e) => {
    e.stopPropagation()
    this.setState({
      hoveringResults: true
    })
  }

  leavingResults = (e) => {
    e.stopPropagation()
    this.setState({
      hoveringResults: false
    })
  }

  handleViewResults = (e) => {
    const { name } = e.target
    this.setState({
      activeField: name
    })
  }

  handleCloseResults = (e) => {
    this.setState({
      activeField: null
    })
  }

  displayResults = (fieldName) => {
    const { searchFieldData } = this.props
    const { activeField } = this.state

    if (searchFieldData) {

      switch (fieldName) {
        case 'client':
          if (searchFieldData.clients && activeField === 'client' ) {
            return { display: 'block' }
          } else {
            return { display: 'none' }
          }
        case 'location':
          if (searchFieldData.locations && activeField === 'location') {
            return { display: 'block' }
          } else {
            return { display: 'none' }
          }
        default:
          return { display: 'none' }
      }

    } else {
      return { display: 'none' }
    }
  }

  styleSelectedResult = (i) => {
    const { hoveringResults } = this.state
    if (i === 0 && !hoveringResults ) {
      return {
        backgroundColor: 'aliceBlue'
      }
    } else {
      return {}
    }
  }

  render(){
    const { fields, searchFieldData } = this.props

    return (
      <div className="MainInfo">

        <label>Client</label>

        <form
          autoComplete="off"
          className="Edit--field"
          onSubmit={(e) => e.preventDefault()}
          onKeyDown={(e) => {
            if ( (e.key === 'Tab' || e.key === 'Enter') && searchFieldData && searchFieldData.clients) {
              this.props.onEnter(e, 'client', 0)
              this.handleCloseResults()
            }
          }}
        >
          <input
            name='client'
            placeholder= 'search clients...'
            className="Edit--input"
            value={fields.client? fields.client : ''}
            onChange={(e) => this.props.handleSearchChange(e.target.name, e.target.value)}
            onFocus={this.handleViewResults}
            onBlur={(e) => {
              if (!this.props.formData.client_id) {
                this.props.handleSearchChange('client', '')
              }
              this.handleCloseResults()
            }}
            tabIndex="1"
          />

          <div
            className="Edit--results"
            style={this.displayResults('client')}
            onMouseEnter={this.choosingResult}
            onMouseLeave={this.leavingResults}
          >
            {searchFieldData && searchFieldData.clients && searchFieldData.clients.map( (client, i) => (
              <div
                style={this.styleSelectedResult(i)}
                key={client.id}
                className="Edit--search-result"
                onClick={(e) => {
                e.stopPropagation();
                this.props.onSelect(e, 'client', i)
                }}
              >
              {clientName(client)}
              </div>
            ))}
          </div>

        </form>

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

          <form
            autoComplete="off"
            className="Edit--field"
            onSubmit={(e) => e.preventDefault()}
            onKeyDown={(e) => {
              if ( (e.key === 'Tab' || e.key === 'Enter') && searchFieldData && searchFieldData.locations) {
                this.props.onSelect(e, 'location', 0)
                this.handleCloseResults()
              }
            }}
          >
            <input
              name='location'
              placeholder= 'search locations...'
              className="Edit--input"
              value={fields.location? fields.location : ''}
              onChange={(e) => this.props.handleSearchChange(e.target.name, e.target.value)}
              onFocus={this.handleViewResults}
              onBlur={(e) => {
                console.log(this.props.formData)
                if (!this.props.formData.location_id) {
                  this.props.handleSearchChange('location', '')
                }
                this.handleCloseResults()
              }}
              tabIndex="2"
            />

            <div
              className="Edit--results"
              style={this.displayResults('location')}
              onMouseEnter={this.choosingResult}
              onMouseLeave={this.leavingResults}
            >

              {searchFieldData && searchFieldData.locations && searchFieldData.locations.map( (location, i) => (

                <div
                  style={this.styleSelectedResult(i)}
                  key={location.id}
                  className="Edit--search-result"
                  onClick={(e) => {
                  e.stopPropagation();
                  this.props.onSelect(e, 'location', i)
                  }}
                >
                  {locationName(location)}
                </div>
              ))}

            </div>

          </form>

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
              viewDate={fields.start? moment(fields.start) : ''}
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
              viewDate={fields.start? moment(fields.start) : fields.end? moment(fields.end): ''}
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
