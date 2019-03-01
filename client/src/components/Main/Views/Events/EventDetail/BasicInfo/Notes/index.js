import React from 'react'
import './index.css'

export default function Notes(props){
  const { fields, editMode } = props

  if (editMode) {
    return (
      <div className="BasicInfo--component">
        <h3 className="BasicInfo--component-title">Notes</h3>
        <div className="Notes--container">
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
      <div className="BasicInfo--component">
        <h3 className="BasicInfo--component-title">Notes</h3>
        <div className="Notes--container">
          <textarea
            className="Notes--readonly"
            readOnly
            value={fields.notes? fields.notes : ''}
          />
        </div>
      </div>
    )
  } else {
    return null
  }

}
