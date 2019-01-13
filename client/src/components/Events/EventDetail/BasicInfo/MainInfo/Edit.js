import React from 'react'
import moment from 'moment'
import './Edit.css'

export default function Edit(props) {
  const { fields, searchFieldData } = props

  function displayResults(){
    if (searchFieldData) {
      return {
        display: 'block',
        backgroundColor: 'white',
        borderTop: '1px solid rgba(0,0,0,.5)',
        borderRight: '1px solid rgba(0,0,0,.55)',
        borderLeft: '1px solid rgba(0,0,0,.55)',
        borderBottom: '1px solid rgba(0,0,0,.55)'
      }
    } else {
      return {}
    }
  }

  return (
    <div className="MainInfo">
      <label>Client</label>
      <form className="Edit--field" onSubmit={(e) => props.onSelect(e, 'client', 0)}>
        <input name='client' className="Edit--input" value={fields.client? fields.client : ''} onChange={props.handleSearchChange}/>
        <div className="Edit--results" style={displayResults()}>
          {searchFieldData && searchFieldData !== [] && searchFieldData.map( (client, i) => (
            <div
              key={client.id}
              className="Edit--search-result"
              onClick={(e) => {
              e.stopPropagation();
              props.onSelect(e, 'client', i)
              }}
            >
            {client.contactInfo.fullName}
            </div>
          ))}
        </div>
      </form>

      <label>Type/Action</label>
        <div className="Edit--field">
          <input className="Edit--input" type="text" name='action' value={fields.action? fields.action : ''} onChange={props.handleChange}/>
        </div>

      <label>Location</label>
        <div className="Edit--field">
          <input className="Edit--input" name='location' value={fields.location? fields.location : ''} onChange={props.handleSearchChange}/>
        </div>

      <label>Kind</label>
        <div className="Edit--field">
          <input className="Edit--input" type="text" name='kind' value={fields.kind? fields.kind : ''} onChange={props.handleChange}/>
        </div>

      <label>Start</label>
        <div className="Edit--field">
          <input className="Edit--input" type="datetime-local" name='start' value={fields.start? moment(fields.start).format('YYYY-MM-DDTHH:mm') : ''} onChange={props.handleChange}/>
        </div>
      <label>Description</label>
        <div className="Edit--field">
          <input className="Edit--input" type="text" name= 'description' value={fields.description? fields.description : ''} onChange={props.handleChange}/>
        </div>

      <label>End</label>
        <div className="Edit--field">
          <input className="Edit--input" type="datetime-local" name='end'  value={fields.end? moment(fields.end).format('YYYY-MM-DDTHH:mm') : ''} onChange={props.handleChange}/>
        </div>

      <label>Package</label>
        <div className="Edit--field">
          <input className="Edit--input" type="text" name='package' value={fields.package? fields.package : ''} onChange={props.handleChange}/>
        </div>
    </div>
  )

}
