import React from 'react'
import { statusIcon } from '../../../../../../Helpers/icons'

export default function View(props){
  const { workers, iconSize } = props
  return (
    <div className="Staff--container Staff--View">
      <div className="Staff Staff--View">
      <label>Staff</label>
        {workers?
          workers.map( worker => (
            <div className="Staff--worker Staff--View" key={worker.id}>
              <p className="Staff--worker-status Staff--View">{statusIcon(worker.confirmation, iconSize)}</p>
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
