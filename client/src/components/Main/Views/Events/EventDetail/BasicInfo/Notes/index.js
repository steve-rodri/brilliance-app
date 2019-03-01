import React from 'react'
import './index.css'

export default function Notes(props){
  const { fields, editMode } = props

  if (editMode) {
    return (
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
    )
  } else if (fields && fields.notes) {
    return (
      <div className="Notes--container">
        <label>Notes</label>
        <textarea
          className="Notes--readonly"
          readOnly
          value={fields.notes? fields.notes : ''}
        />
      </div>
    )
  } else {
    return null
  }

}
