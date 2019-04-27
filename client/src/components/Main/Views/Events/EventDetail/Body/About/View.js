import React, { Fragment } from 'react'
import { date, time, duration } from '../../../../../../../helpers/datetime'

export default function View (props){
  const { fields, mobile } = props
  return (
    <div className="About">

      {
        fields && fields.client?
        <Fragment>
          { mobile? <label>Client</label> : null }
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
          { mobile? <label>Location</label> : null }
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
          { mobile? <label>Date</label> : null }
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
          { mobile? <label>Time</label> : null }
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
          { mobile? <label>Duration</label> : null }
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
