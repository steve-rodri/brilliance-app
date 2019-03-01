import React from 'react'
import { statusIcon } from '../../../../../../Helpers/icons'

export default function View(props){
  const { workers, iconSize } = props
  return (
    <div className="Staff--container">
      <table className="Staff">
        <thead>
          <tr>
            <th className="Staff--worker-head">name</th>
            <th className="Staff--status-head">status</th>
          </tr>
        </thead>
        <tbody>
        {workers?
          workers.map( worker => (
            <tr className="Staff--worker" key={worker.id}>
              <td className="Staff--worker-name">{worker.info.contact.fullName}</td>
              <td className="Staff--worker-status">{statusIcon(worker.confirmation, iconSize)}</td>
            </tr>
          ))
          :
          null
        }
        </tbody>
      </table>
    </div>
  )
}
