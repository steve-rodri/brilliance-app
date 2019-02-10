import React from 'react'
import moment from 'moment'
import './Standard.css'

export default function Standard (props){
  const { fields } = props
  return (
    <div className="MainInfo">

      <div className="MainInfo--Area">
        <label>Client</label>
          <div className="Standard--field">
            <p>{fields && fields.client}</p>
          </div>
      </div>


      <div className="MainInfo--Area">
        <label>Location</label>
          <div className="Standard--field">
            <p>{fields && fields.location}</p>
          </div>

        <label>Start</label>
          <div className="Standard--field">
            <p>{fields && fields.start? moment(fields.start).format('llll'): ''}</p>
          </div>

        <label>End</label>
          <div className="Standard--field">
            <p>{fields && fields.end? moment(fields.end).format('llll') : ''}</p>
          </div>
      </div>


      <div className="MainInfo--Area">
        <label>Type/Action</label>
          <div className="Standard--field">
            <p>{fields && fields.action? fields.action : ''}</p>
          </div>

        <label>Kind</label>
          <div className="Standard--field">
            <p>{fields && fields.kind? fields.kind : ''}</p>
          </div>

        <label>Description</label>
          <div className="Standard--field">
            <p>{fields && fields.description? fields.description : ''}</p>
          </div>

        <label>Package</label>
          <div className="Standard--field">
            <p>{fields && fields.package? fields.package : ''}</p>
          </div>
      </div>

    </div>
  )
}
