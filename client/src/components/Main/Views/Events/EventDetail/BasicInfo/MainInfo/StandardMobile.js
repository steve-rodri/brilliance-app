import React, { Fragment } from 'react'
import { date, time } from '../../../../../../Helpers/datetime'
import './Standard.css'

export default function Standard (props){
  const { fields } = props
  return (
    <div className="MainInfo">

      <div className="MainInfo--Area">
        {
          fields && fields.client?
          <Fragment>
            <label>Client</label>
              <div className="Standard--field">
                <p>{fields.client}</p>
              </div>
          </Fragment>
            :
            null
        }
        {
          fields && fields.location?
          <Fragment>
            <label>Location</label>
              <div className="Standard--field">
                <p>{fields && fields.location}</p>
              </div>
          </Fragment>
          :
          null
        }
      </div>


      <div className="MainInfo--Area">
        <label>Date</label>
          <div className="Standard--field">
            <p>{date(fields)}</p>
          </div>

        <label>Time</label>
          <div className="Standard--field">
            <p>{time(fields)}</p>
          </div>
      </div>


      <div className="MainInfo--Area">
        {
          fields && fields.action?
          <Fragment>
            <label>Action</label>
              <div className="Standard--field">
                <p>{fields.action}</p>
              </div>
          </Fragment>
          :
          null
        }

        {
          fields && fields.kind?
          <Fragment>
            <label>Kind</label>
              <div className="Standard--field">
                <p>{fields.kind}</p>
              </div>
          </Fragment>
          :
          null
        }

        {
          fields && fields.package?
          <Fragment>
            <label>Package</label>
              <div className="Standard--field">
                <p>{fields.package}</p>
              </div>
          </Fragment>
          :
          null
        }

        {
          fields && fields.description?
          <Fragment>
            <label>Description</label>
              <div className="Standard--field">
                <p>{fields.description}</p>
              </div>
          </Fragment>
          :
          null
        }
      </div>
    </div>
  )
}
