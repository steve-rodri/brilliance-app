import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPencilAlt, faCheck, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons'

library.add(faPencilAlt)
library.add(faCheck)
library.add(faTimes)
library.add(faTrash)

export default function Header(props){
  const { evt, fields, isNew, editMode } = props
  return (
    <div className="BasicInfo--header">
      {editMode && evt?
        <input
          className="BasicInfo--event-summary"
          style={styleSummary(fields && fields.summary)}
          name="summary" value={fields.summary? fields.summary : ''}
          onChange={props.handleChange}
        />
        :
        <h1
          className="BasicInfo--event-title"
          style={styleSummary(fields && fields.summary)}
        >
          {fields && fields.summary}
        </h1>
      }
      {editMode?
        <div className="BasicInfo--buttons">
          {isNew && !evt?
            ""
            :
            <div
              className="BasicInfo--button close"
              onClick={props.close}
            >
              <FontAwesomeIcon icon="times" size="2x"/>
            </div>
          }
          <div
            className="BasicInfo--button edit"
            onClick={props.handleSubmit}
          >
            <FontAwesomeIcon icon="check" size="2x"/>
          </div>
        </div>
        :
        <div className="BasicInfo--buttons">
          <div
            className="BasicInfo--button edit"
            onClick={props.edit}
          >
            <FontAwesomeIcon icon="pencil-alt" size="2x"/>
          </div>
         {!evt?
           ""
           :
            <div
              className="BasicInfo--button delete"
              onClick={props.delete}
            >
              <FontAwesomeIcon icon="trash" size="2x"/>
            </div>
          }
        </div>
      }
    </div>
  )
}

function styleSummary(summary) {
  if (summary) {
    if (summary.length > 35) {
      if (window.innerWidth > 600) {
        return {
          fontSize: '25px'
        }
      } else {
        return {
          fontSize: '35px'
        }
      }
    } else {
      return {}
    }
  } else {
    return {}
  }
}
