import React, { Fragment } from 'react'
import { statusIcon } from '../../../../../../../helpers/icons'
import { call } from '../../../../../../../helpers/eventHelpers'

export default function View(props){
  const { fields, mobile, workers } = props
  return (
    <div className="Staff--container Staff--View">
      <div className="Staff Staff--View">
      {mobile? <label>Staff</label> : null}
        {workers?
          workers.map( (worker, i) => (
            <div className="Staff--worker Staff--View" key={i}>
              <p className="Staff--worker-status Staff--View">{statusIcon(worker.confirmation, '2x')}</p>
              <p className="Staff--worker-name Staff--View">{worker.info.contact.fullName}</p>
            </div>
          ))
          :
          null
        }
        {
          call(fields)?
          <Fragment>
            <label>Call</label>
            <div className="Staff--view">
              {call()}
            </div>
          </Fragment>
          :
          null
        }
      </div>
    </div>
  )
}
