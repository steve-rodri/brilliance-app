import React from 'react'
import moment from 'moment'

export default function Standard (props){
  const { event, clientName } = props
  return (
    <div className="MainInfo">

      <label>Client</label>
        <p className="BasicInfo--field">{event && clientName}</p>

      <label>Type/Action</label>
        <p className="BasicInfo--field">{event && event.action? event.action : ''}</p>

      <label>Location</label>
        <p className="BasicInfo--field">{event && event.location? event.location : ''}</p>

      <label>Kind</label>
        <p className="BasicInfo--field">{event && event.kind? event.kind : ''}</p>

      <label>Start</label>
        <p className="BasicInfo--field">{event && event.start? moment(event.start).format('LLLL'): ''}</p>

      <label>Description</label>
        <p className="BasicInfo--field">{event && event.description? event.description : ''}</p>

      <label>End</label>
        <p className="BasicInfo--field">{event && event.end? moment(event.end).format('LLLL') : ''}</p>

      <label>Package</label>
        <p className="BasicInfo--field">{event && event.package? event.package : ''}</p>

    </div>
  )
}
