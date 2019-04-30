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
  faPlus,
  faMinus,
  faSearch,
  faSearchPlus,
  faChevronRight,
  faChevronLeft,
  faUserCircle
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
  faPlus,
  faMinus,
  faSearch,
  faSearchPlus,
  faChevronRight,
  faChevronLeft,
  faUserCircle
)

export function statusIcon(str, size){
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

export function userCircleIcon(size, style){
  return <FontAwesomeIcon className={`Icon`} icon="user-circle" size={size} style={style}/>
}

export function chevronRightIcon(size, className){
  return <FontAwesomeIcon className={`Icon ${className}`} icon="chevron-right" size={size}/>
}

export function chevronLeftIcon(size, className){
  return <FontAwesomeIcon className={`Icon ${className}`} icon="chevron-left" size={size}/>
}

export function searchIcon(size, className){
  return <FontAwesomeIcon className={`Icon ${className}`} icon="search" size={size}/>
}

export function searchPlusIcon(size, className){
  return <FontAwesomeIcon className={`Icon ${className}`} icon="search-plus" size={size}/>
}

export function plusIcon(size, className, style){
  let s = {}
  if (style) s = style;
  return <FontAwesomeIcon className={`Icon ${className}`} icon="plus" size={size} style={s}/>
}

export function minusIcon(size, className){
  return <FontAwesomeIcon className={`Icon ${className}`} icon="minus" size={size}/>
}

export function addIcon(size){
  return <FontAwesomeIcon  className="Icon" icon="plus-circle" size={size}/>
}

export function deleteIcon(size){
  return <FontAwesomeIcon className="Icon" icon="minus-circle" size={size}/>
}

export function timesIcon(size, color, className){
  return <FontAwesomeIcon  className={`Icon ${className}`} color={color} icon="times" size={size}/>
}

export function pencilIcon(size, className, color){
  return <FontAwesomeIcon  className={`Icon ${className}`} icon="pencil-alt" color={color? color : null} size={size}/>
}

export function trashIcon(size, className, color){
  return <FontAwesomeIcon  className={`Icon ${className}`} icon="trash" color={color? color : null} size={size}/>
}

export function checkIcon(size, className, color){
  return <FontAwesomeIcon  className={`Icon ${className}`} icon="check" color={color? color : null} size={size? size : '1x'}/>
}

export function squareIcon(style, size, className, color){
  return <FontAwesomeIcon className={`Icon ${className}`} icon={style} color={color? color : null} size={size? size : '1x'}/>
}
