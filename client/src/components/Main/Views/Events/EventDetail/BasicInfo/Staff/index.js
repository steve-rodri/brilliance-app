import React from 'react'
import { statusIcon } from '../../../../../../Helpers/eventConfirmation'
import './Staff.css'

export default function Staff(props){
  const {evt } = props

  return (
    <div className="Staff--container">
      <label>Staff</label>
      <div className="Staff">
        {evt && evt.staff?
          evt.staff.map( worker => (
            <div className="Staff--worker" key={worker.id}>
              <div></div>
              <h3>{worker.info.contact.fullName}</h3>
              <div>{statusIcon(worker.confirmation)}</div>
            </div>
          ))
          :
          null
        }
      </div>
    </div>
  )
}
