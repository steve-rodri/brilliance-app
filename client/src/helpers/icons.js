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
  faSearch,
  faSearchPlus,
  faChevronRight,
  faChevronLeft
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
  faSearch,
  faSearchPlus,
  faChevronRight,
  faChevronLeft
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

export function plusIcon(size, className){
  return <FontAwesomeIcon className={`Icon ${className}`} icon="plus" size={size}/>
}

export function addIcon(size){
  return <FontAwesomeIcon  className="Icon" color="limegreen" icon="plus-circle" size={size}/>
}

export function deleteIcon(size){
  return <FontAwesomeIcon className="Icon" color="red" icon="minus-circle" size={size}/>
}

export function closeIcon(size, color, className){
  return <FontAwesomeIcon  className={`Icon ${className}`} color={color} icon="times" size={size}/>
}

export function pencil(size, className, color){
  return <FontAwesomeIcon  className={`Icon ${className}`} icon="pencil-alt" color={color? color : null} size={size}/>
}

export function trash(size, className, color){
  return <FontAwesomeIcon  className={`Icon ${className}`} icon="trash" color={color? color : null} size={size}/>
}

export function check(size, className, color){
  return <FontAwesomeIcon  className={`Icon ${className}`} icon="check" color={color? color : null} size={size? size : '1x'}/>
}

export function square(style, size, className, color){
  return <FontAwesomeIcon className={`Icon ${className}`} icon={style} color={color? color : null} size={size? size : '1x'}/>
}
