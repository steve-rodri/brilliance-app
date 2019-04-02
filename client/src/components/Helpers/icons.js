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
  faTimes,
  faPencilAlt,
  faCheck,
  faTrash,
  faSquare as fasSquare,
  faPlus
} from '@fortawesome/free-solid-svg-icons'
import {
  faSquare as farSquare
} from '@fortawesome/free-regular-svg-icons'

library.add(
  faPencilAlt,
  faCheck,
  faTrash,
  faCircle,
  faCheckCircle,
  faTimesCircle,
  faQuestionCircle,
  faMinusCircle,
  faPlusCircle,
  faTimes,
  farSquare,
  fasSquare,
  faPlus
)

function statusIcon(str, size){
  switch (str) {
    case 'needsAction':
      return <FontAwesomeIcon  className="Icon" icon="circle" size={size}/>
    case 'accepted':
      return <FontAwesomeIcon  className="Icon" color="limegreen" icon="check-circle" size={size}/>
    case 'tentative':
      return <FontAwesomeIcon  className="Icon" color="gold" icon="question-circle" size={size}/>
    case 'declined':
      return <FontAwesomeIcon  className="Icon" color="red" icon="times-circle" size={size}/>
    default:
  }
}

function plusIcon(size, className){
  return <FontAwesomeIcon className={`Icon ${className}`} icon="plus" size={size}/>
}

function addIcon(size){
  return <FontAwesomeIcon  className="Icon" color="limegreen" icon="plus-circle" size={size}/>
}

function deleteIcon(size){
  return <FontAwesomeIcon className="Icon" color="red" icon="minus-circle" size={size}/>
}

function closeIcon(size, color, className){
  return <FontAwesomeIcon  className={`Icon ${className}`} color={color} icon="times" size={size}/>
}

function pencil(size, className, color){
  return <FontAwesomeIcon  className={`Icon ${className}`} icon="pencil-alt" color={color? color : null} size={size}/>
}

function trash(size, className, color){
  return <FontAwesomeIcon  className={`Icon ${className}`} icon="trash" color={color? color : null} size={size}/>
}

function check(size, className, color){
  return <FontAwesomeIcon  className={`Icon ${className}`} icon="check" color={color? color : null} size={size? size : '1x'}/>
}

function square(style, size, className, color){
  return <FontAwesomeIcon className={`Icon ${className}`} icon={style} color={color? color : null} size={size? size : '1x'}/>
}

export {
  plusIcon,
  statusIcon,
  addIcon,
  deleteIcon,
  closeIcon,
  pencil,
  trash,
  check,
  square
}
