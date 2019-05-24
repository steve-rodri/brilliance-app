import React, { Fragment } from 'react'
import { statusIcon } from '../../../../../../../helpers/icons'
import { call } from '../../../../../../../helpers/eventHelpers'

export default function View(props){
  const { fields, mobile, workers, status } = props
  return (
    <div className="Staff--container Staff--View">
      {mobile? <label>Staff</label> : null}
      <div className="Staff Staff--View">
        {
          call(fields)?
          <Fragment>
            <div className="Staff--view">
              <h3>{`Call: ${call(fields)}`}</h3>
            </div>
          </Fragment>
          :
          null
        }
        {workers?
          workers.map( (worker, i) => (
            <div className="Staff--worker Staff--View" key={i}>
              <div className="Staff--worker-status Staff--View" style={status(worker.confirmation)}>{statusIcon(worker.confirmation, '1x')}</div>
              <p className="Staff--worker-name Staff--View" >{worker.info.contact.fullName}</p>
            </div>
          ))
          :
          null
        }
      </div>
    </div>
  )
}
