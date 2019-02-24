import React, { Fragment } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPencilAlt, faCheck, faTrash } from '@fortawesome/free-solid-svg-icons'
import { styleConfirmation, changeConfirmation } from '../../../../../Helpers/eventConfirmation'

library.add(faPencilAlt)
library.add(faCheck)
library.add(faTrash)

export default function Buttons(props) {
  // Functions to Dynamically change buttons based on Mode ---------------

  const { evt, editMode} = props

  // function close(){
  //   if (!isNew && evt) {
  //     return (
  //       <div
  //         className="BasicInfo--icon left"
  //         onClick={props.close}
  //       >
  //         <FontAwesomeIcon icon="times" size="2x"/>
  //       </div>
  //     )
  //   }
  // }

  function edit(){
    return (
      <button
        className="BasicInfo--Button"
        onClick={props.edit}
      >
        <span className="BasicInfo--Button-Text">Edit</span>
        {<FontAwesomeIcon className="BasicInfo--Button-Icon" icon="pencil-alt" size="2x"/>}
      </button>
    )
  }

  function trash(){
    if (evt) {
      return (
        <button
          className="BasicInfo--Button"
          style={{backgroundColor: 'darkred'}}
        >
          <span className="BasicInfo--Button-Text">Delete</span>
          {<FontAwesomeIcon className="BasicInfo--Button-Icon" icon="trash" size="2x"/>}
        </button>
      )
    }
  }

  function submit(){
    return (
      <button
        className="BasicInfo--Button"
        onClick={props.handleSubmit}
        style={{backgroundColor: 'rgb(0, 200, 45)'}}
      >
        <span className="BasicInfo--Button-Text">Submit</span>
        {<FontAwesomeIcon className="BasicInfo--Button-Icon" icon="check" size="2x"/>}
      </button>
    )
  }

  function displayButtons(){
    if (editMode) {
      return (
        <Fragment>
          {trash()}
          {submit()}
        </Fragment>
      )
    } else {
      return (
        <Fragment>
          {edit()}
        </Fragment>
      )
    }
  }
  return (
    <div className="BasicInfo--Buttons">
      {displayButtons()}
    </div>
  )
}
