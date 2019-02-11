import React from 'react'
import { date, time } from '../../../../../../Helpers/datetime'
import './Standard.css'

export default function Standard (props){
  const { fields } = props
  return (
    <div className="MainInfo">

      <label>Client</label>
        <div className="Standard--field">
          <p>{fields && fields.client}</p>
        </div>

      <label>Type/Action</label>
        <div className="Standard--field">
          <p>{fields && fields.action? fields.action : ''}</p>
        </div>

      <label>Location</label>
        <div className="Standard--field">
          <p>{fields && fields.location}</p>
        </div>

      <label>Kind</label>
        <div className="Standard--field">
          <p>{fields && fields.kind? fields.kind : ''}</p>
        </div>

      <label>Date</label>
        <div className="Standard--field">
          <p>{date(fields)}</p>
        </div>

      <label>Description</label>
        <div className="Standard--field">
          <p>{fields && fields.description? fields.description : ''}</p>
        </div>

      <label>Time</label>
        <div className="Standard--field">
          <p>{time(fields)}</p>
        </div>

      <label>Package</label>
        <div className="Standard--field">
          <p>{fields && fields.package? fields.package : ''}</p>
        </div>

    </div>
  )
}
