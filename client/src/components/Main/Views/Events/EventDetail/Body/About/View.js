import React, { Fragment } from 'react'
import { date, time, duration } from '../../../../../../../helpers/datetime'
import { clientName } from '../../../../../../../helpers/clientHelpers'
export default function View (props){
  const { fields, mobile, evt } = props
  return (
    <div className="About">

      {
        fields && fields.client?
        <Fragment>
          { mobile? <label>Client</label> : null }
          <div>{clientName(evt.client)}</div>
        </Fragment>
          :
          null
      }

      {
        fields && fields.location?
        <Fragment>
          { mobile? <label>Location</label> : null }
          <h3>{fields.location}</h3>
        </Fragment>
          :
          null
      }

      {
        fields && date(fields)?
        <Fragment>
          { mobile? <label>Date</label> : null }
          <h3>{date(fields, false, true)}</h3>
        </Fragment>
          :
          null
      }

      {
        fields && time(fields)?
        <Fragment>
          { mobile? <label>Time</label> : null }
          <h3>{time(fields)}</h3>
        </Fragment>
          :
          null
      }

      {
        fields && duration(fields)?
        <Fragment>
          { mobile? <label>Duration</label> : null }
          <h3>{duration(fields)}</h3>
        </Fragment>
          :
          null
      }

    </div>
  )
}
