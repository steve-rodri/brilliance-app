import React from 'react'
import { statusIcon } from '../../../../../../../helpers/icons'

export default function View(props){
  const { workers } = props
  return (
    <div className="Staff--container Staff--View">
      <div className="Staff Staff--View">
      <label>Staff</label>
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

      </div>
    </div>
  )
}
