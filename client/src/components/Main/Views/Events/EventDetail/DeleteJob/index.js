import React from 'react'
import './index.css'

export default function DeleteJob(props){
  const { onDelete, close } = props
  return (
    <div className="DeleteJob">
      <div className="DeleteJob--header">
        <h2>Delete Job</h2>
      </div>

      <div className="DeleteJob--content">
        <div className="DeleteJob--dialog">
          <h3>Are you sure you want to delete this job?</h3>
          <p>By deleting this job all associated records will be destroyed...(invoice, payroll, etc..)</p>
        </div>
        <div className="DeleteJob--buttons">
          <button
            onClick={() => {
              onDelete()
              close()
            }}
          >
            Delete
          </button>
          <button onClick={() => close()}>Cancel</button>
        </div>
      </div>
    </div>
  )
}
