import React from 'react'
import './index.css'

export default function Notes(props){
  const { fields, editMode } = props

  if (editMode) {
    return (
      <div className="BasicInfo--component BasicInfo--notes">
        <div className="BasicInfo--component-title"><h3>Notes</h3></div>
        <div className="Notes--container">
          <label>Notes</label>
          <textarea
            className="Notes"
            type="text"
            name='notes'
            value={fields.notes? fields.notes : ''}
            onChange={props.handleChange}
            tabIndex="9"
          />
        </div>
      </div>
    )
  } else if (fields && fields.notes) {
    return (
      <div className="BasicInfo--component BasicInfo--notes">
        <div className="BasicInfo--component-title"><h3>Notes</h3></div>
        <div className="Notes--container">
        <label>Notes</label>
          <div className="Notes--readonly">
            {
              fields && fields.notes?
              notes(fields.notes)
              :
              null
            }
          </div>

        </div>
      </div>
    )
  } else {
    return null
  }

  function notes(text){
    const arr = text.split(`\n`)
    return arr.map((p, id) => (
      <p key={id}>{p}</p>
    ))
  }

}
