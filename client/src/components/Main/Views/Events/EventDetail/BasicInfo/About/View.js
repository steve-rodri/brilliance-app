import React, { Fragment } from 'react'
import { date, time, duration } from '../../../../../../Helpers/datetime'

export default function View (props){
  const { fields } = props
  return (
    <div className="About">

      {
        fields && fields.client?
        <Fragment>
          <label>Client</label>
          <div className="Field">
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
          <div className="Field">
            <p>{fields.location}</p>
          </div>
        </Fragment>
          :
          null
      }

      {
        fields && date(fields)?
        <Fragment>
          <label>Date</label>
          <div className="Field">
            <p>{date(fields)}</p>
          </div>
        </Fragment>
          :
          null
      }

      {
        fields && time(fields)?
        <Fragment>
          <label>Time</label>
          <div className="Field">
            <p>{time(fields)}</p>
          </div>
        </Fragment>
          :
          null
      }

      {
        fields && duration(fields)?
        <Fragment>
          <label>Duration</label>
          <div className="Field">
            <p>{duration(fields)}</p>
          </div>
        </Fragment>
          :
          null
      }

      {/* <label>Type/Action</label>
      <div className="Field">
      <p>{fields && fields.action? fields.action : ''}</p>
      </div>

      <label>Kind</label>
      <div className="Field">
      <p>{fields && fields.kind? fields.kind : ''}</p>
      </div>

      <label>Description</label>
      <div className="Field">
      <p>{fields && fields.description? fields.description : ''}</p>
      </div>

      <label>Package</label>
      <div className="Field">
      <p>{fields && fields.package? fields.package : ''}</p>
      </div> */}

    </div>
  )
}
