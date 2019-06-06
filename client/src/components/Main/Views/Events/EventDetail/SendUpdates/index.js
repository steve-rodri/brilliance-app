import React from 'react'
import './index.css'

export default function SendUpdates(props){
  const { onSubmit } = props
  return (
    <div className="SendUpdates">
      <div className="SendUpdates--header">
        <h2>Send Updates</h2>
      </div>

      <div className="SendUpdates--content">
        <div className="SendUpdates--dialog">
          <h3>Would you like to notify workers of any changes made?</h3>
        </div>
        <div className="SendUpdates--buttons">
          <button onClick={() => onSubmit({ sendUpdates: true })}>Yes</button>
          <button onClick={() => onSubmit({ sendUpdates: false })}>No</button>
        </div>
      </div>
    </div>
  )
}
