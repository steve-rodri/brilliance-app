import React from 'react'
import moment from 'moment'
export default function Edit (props){
  const { event, clients } = props
  return (
    <div className="MainInfo">
      <label>Client</label>
        <select name='client' className="BasicInfo--field" data={props.clientId} value={props.clientName} onChange={props.handleClientChange}>
          {clients && clients.map(client => {
            function clientName(c) {
              if (c.contactInfo) {
                return c.contactInfo.fullName
              }
            }
            return <option key={client.id} name='client'>{clientName(client)}</option>
          })}
        </select>

      <label>Type/Action</label>
        <input className="BasicInfo--field" type="text" name='action' value={event.action} onChange={props.handleChange}/>

      <label>Location</label>
        <select className="BasicInfo--field" name='location'></select>

      <label>Kind</label>
        <input className="BasicInfo--field" type="text" name='kind' value={event.kind} onChange={props.handleChange}/>

      <label>Start</label>
        <input className="BasicInfo--field" type="datetime-local" name='start' value={moment(event.start).format('YYYY-MM-DDTHH:mm')} onChange={props.handleChange}/>
      <label>Description</label>
        <input className="BasicInfo--field" type="text" name= 'description' value={event.description} onChange={props.handleChange}/>

      <label>End</label>
        <input className="BasicInfo--field" type="datetime-local" name='end'  value={moment(event.end).format('YYYY-MM-DDTHH:mm')} onChange={props.handleChange}/>

      <label>Package</label>
        <input className="BasicInfo--field" type="text" name='package' value={event.package} onChange={props.handleChange}/>

    </div>
  )
}
