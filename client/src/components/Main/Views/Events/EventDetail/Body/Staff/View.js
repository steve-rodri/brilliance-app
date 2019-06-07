import React, { Fragment } from 'react'
import { statusIcon } from '../../../../../../../helpers/icons'
import { call } from '../../../../../../../helpers/eventHelpers'

export default function View(props){
  const { fields, mobile, workers, status } = props
  return (
    <Fragment>
      {mobile? <label>Staff</label> : null}
      <div className="Staff">
        {
          call(fields)?
          <Fragment>
            <div className="Staff--call">
              <h3>{`Call: ${call(fields)}`}</h3>
            </div>
          </Fragment>
          :
          null
        }
        {
          workers?
          <div className="Staff--workers">
            {
              workers.map( (worker, i) => (
                <div className="Staff--worker" key={i}>
                  <div className="Staff--worker-status" style={status(worker.confirmation)}>{statusIcon(worker.confirmation, '1x')}</div>
                  <p className="Staff--worker-name" >{worker.info.contact.fullName}</p>
                </div>
              ))
            }
          </div>
          :
          null
        }
      </div>
    </Fragment>
  )
}
