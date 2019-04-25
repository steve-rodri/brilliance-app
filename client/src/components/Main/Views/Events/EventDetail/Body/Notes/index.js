import React from 'react'
import './index.css'

export default function Notes(props){
  const { mobile, fields, editMode } = props
  const view = () => {
    if (editMode) {
      return (
        <textarea
          className="Notes"
          type="text"
          name='notes'
          value={fields.notes || ''}
          onChange={props.handleChange}
          tabIndex="9"
        />
      )
    } else {
      return (
        <div className="Notes--readonly">
          {notes(fields.notes)}
        </div>
      )
    }
  }

  const notes = (text) => {
    const arr = text.split(`\n`)
    return arr.map((p, id) => (
      <p key={id}>{p}</p>
    ))
  }

  return (
    <div className="EventDetail-Body--component EventDetail-Body--notes">
      <div className="EventDetail-Body--component-title"><h3>Notes</h3></div>
      <div className="Notes--container">
        {mobile? <label>Notes</label> : null}
        {view()}
      </div>
    </div>
  )
}
