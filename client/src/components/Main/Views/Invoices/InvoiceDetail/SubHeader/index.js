import React from 'react'
import Edit from './Edit'
import Show from './Show'

export default function SubHeader(props){
  const { editMode } = props

  if (editMode) {
    return (
      <Edit {...props}/>
    )
  } else {
    return (
      <Show {...props}/>
    )
  }

}
