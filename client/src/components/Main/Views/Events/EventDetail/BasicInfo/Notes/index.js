import React from 'react'

export default function Notes(props){
  const { fields, editMode } = props

  if (editMode) {
    return (
      <div className="BasicInfo--notes-container">
        <label>Notes</label>
        <textarea
          className="BasicInfo--notes"
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
      <div className="BasicInfo--notes-container">
        <label>Notes</label>
        <textarea
          className="BasicInfo--notes-readonly"
          readOnly
          value={fields.notes? fields.notes : ''}
        />
      </div>
    )
  } else {
    return null
  }

}
