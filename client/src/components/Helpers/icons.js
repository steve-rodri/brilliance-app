import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faCircle,
  faCheckCircle,
  faTimesCircle,
  faQuestionCircle,
  faMinusCircle,
  faPlusCircle,
  faTimes
} from '@fortawesome/free-solid-svg-icons'

library.add(faCircle)
library.add(faCheckCircle)
library.add(faTimesCircle)
library.add(faQuestionCircle)
library.add(faMinusCircle)
library.add(faPlusCircle)
library.add(faTimes)

function statusIcon(str, size){
  switch (str) {
    case 'needsAction':
      return <FontAwesomeIcon className="Icon" icon="circle" size={size}/>
    case 'accepted':
      return <FontAwesomeIcon className="Icon" color="green" icon="check-circle" size={size}/>
    case 'tentative':
      return <FontAwesomeIcon className="Icon" color="gold" icon="question-circle" size={size}/>
    case 'declined':
      return <FontAwesomeIcon className="Icon" color="red" icon="times-circle" size={size}/>
    default:
  }
}

function addIcon(size){
  return <FontAwesomeIcon className="Icon" color="green" icon="plus-circle" size={size}/>
}

function deleteIcon(size){
  return <FontAwesomeIcon className="Icon" color="red" icon="minus-circle" size={size}/>
}

function closeIcon(size){
  return <FontAwesomeIcon className="Icon" color="gray" icon="times" size={size}/>
}

export {
  statusIcon,
  addIcon,
  deleteIcon,
  closeIcon
}
