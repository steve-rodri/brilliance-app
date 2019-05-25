import React from 'react'
import './index.css'

export default function Notes(props){
  const { mobile, fields, editMode, styleComp } = props
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
    <div style={styleComp('Notes')} className="EventDetail-Body--component EventDetail-Body--notes">
      {!mobile? <div className="EventDetail-Body--component-title"><h4>Notes</h4></div> : null}
      <div className="Notes--container" style={mobile? {padding: '0 20px 20px'} : {} }>
        {mobile? <label>Notes</label> : null}
        {view()}
      </div>
    </div>
  )
}
