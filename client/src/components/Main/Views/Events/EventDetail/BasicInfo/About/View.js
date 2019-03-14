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
            <p>{date(fields, false, true)}</p>
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

    </div>
  )
}
