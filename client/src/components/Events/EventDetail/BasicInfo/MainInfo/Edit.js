import React from 'react'
import moment from 'moment'
import { clientName } from '../../../Helpers/clientName'
import { locationName } from '../../../Helpers/locationName'
import './Edit.css'

export default function Edit(props) {
  const { fields, searchFieldData } = props

  function displayResults(fieldName){
    if (searchFieldData) {
      switch (fieldName) {
        case 'client':
          if (searchFieldData.clients) {
            return { display: 'block' }
          } else {
            return { display: 'none' }
          }
        case 'location':
          if (searchFieldData.locations) {
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

  return (
    <div className="MainInfo">
      <label>Client</label>
      <form className="Edit--field" onSubmit={(e) => props.onSelect(e, 'client', 0)}>
        <input name='client' className="Edit--input" value={fields.client? fields.client : ''} onChange={props.handleSearchChange}/>
        <div className="Edit--results" style={displayResults('client')}>
          {searchFieldData && searchFieldData.clients && searchFieldData.clients.map( (client, i) => (
            <div
              key={client.id}
              className="Edit--search-result"
              onClick={(e) => {
              e.stopPropagation();
              props.onSelect(e, 'client', i)
              }}
            >
            {clientName(client)}
            </div>
          ))}
        </div>
      </form>

      <label>Type/Action</label>
        <div className="Edit--field">
          <input className="Edit--input" type="text" name='action' value={fields.action? fields.action : ''} onChange={props.handleChange}/>
        </div>

      <label>Location</label>
        <form className="Edit--field" onSubmit={(e) => props.onSelect(e, 'location', 0)}>
          <input name='location' className="Edit--input" value={fields.location? fields.location : ''} onChange={props.handleSearchChange}/>
          <div className="Edit--results" style={displayResults('location')}>
            {searchFieldData && searchFieldData.locations && searchFieldData.locations.map( (location, i) => (
              <div
                key={location.id}
                className="Edit--search-result"
                onClick={(e) => {
                e.stopPropagation();
                props.onSelect(e, 'location', i)
                }}
              >
              {locationName(location)}
              </div>
            ))}
          </div>
        </form>

      <label>Kind</label>
        <div className="Edit--field">
          <input className="Edit--input" type="text" name='kind' value={fields.kind? fields.kind : ''} onChange={props.handleChange}/>
        </div>

      <label>Start</label>
        <div className="Edit--field datetime">
          <input className="Edit--input" type="datetime-local" name='start' value={fields.start? moment(fields.start).format('YYYY-MM-DDTHH:mm') : ''} onChange={props.handleChange}/>
        </div>
      <label>Description</label>
        <div className="Edit--field">
          <input className="Edit--input" type="text" name= 'description' value={fields.description? fields.description : ''} onChange={props.handleChange}/>
        </div>

      <label>End</label>
        <div className="Edit--field datetime">
          <input className="Edit--input" type="datetime-local" name='end'  value={fields.end? moment(fields.end).format('YYYY-MM-DDTHH:mm') : ''} onChange={props.handleChange}/>
        </div>

      <label>Package</label>
        <div className="Edit--field">
          <input className="Edit--input" type="text" name='package' value={fields.package? fields.package : ''} onChange={props.handleChange}/>
        </div>
    </div>
  )

}
