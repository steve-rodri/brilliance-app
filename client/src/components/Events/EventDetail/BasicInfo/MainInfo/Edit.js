import React from 'react'
import moment from 'moment'

export default function Edit(props) {
  const { event, searchFieldData, fields } = props
  function displayResults(){
    if (searchFieldData || searchFieldData !== []) {
      return {
        display: 'block'
      }
    } else {
      return {}
    }
  }

  return (
    <div className="MainInfo">
      <label>Client</label>
      <form className="BasicInfo--field" onSubmit={(e) => props.onSelect(e, 'client', 0)}>
        <input name='client' className="BasicInfo--field" value={fields.client} onChange={props.handleSearchChange}/>
        <div className="MainInfo--client-search results" style={displayResults()}>
          {searchFieldData && searchFieldData !== [] && searchFieldData.map( (client, i) => (
            <div
              key={client.id}
              className="search-result"
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
        <input className="BasicInfo--field" type="text" name='action' value={fields.action} onChange={props.handleChange}/>

      <label>Location</label>
        <input className="BasicInfo--field" name='location' value={fields.location} onChange={props.handleSearchChange}/>

      <label>Kind</label>
        <input className="BasicInfo--field" type="text" name='kind' value={fields.kind} onChange={props.handleChange}/>

      <label>Start</label>
        <input className="BasicInfo--field" type="datetime-local" name='start' value={moment(fields.start).format('YYYY-MM-DDTHH:mm')} onChange={props.handleChange}/>
      <label>Description</label>
        <input className="BasicInfo--field" type="text" name= 'description' value={fields.description} onChange={props.handleChange}/>

      <label>End</label>
        <input className="BasicInfo--field" type="datetime-local" name='end'  value={moment(fields.end).format('YYYY-MM-DDTHH:mm')} onChange={props.handleChange}/>

      <label>Package</label>
        <input className="BasicInfo--field" type="text" name='package' value={fields.package} onChange={props.handleChange}/>

    </div>
  )

}
