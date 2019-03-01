import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCircle, faCheckCircle, faTimesCircle, faQuestionCircle } from '@fortawesome/free-solid-svg-icons'

library.add(faCircle)
library.add(faCheckCircle)
library.add(faTimesCircle)
library.add(faQuestionCircle)

function styleConfirmation(msg){
  switch (msg) {
    case "Unconfirmed":
      return {
        border: '2px dashed rgba(210,210,0,1)',
        color: 'rgba(210,180,0,1)',
        backgroundColor: 'inherit',
        padding: '5px 15px',
        borderRadius: '3px'
      }
    case "Confirmed":
      return {
        backgroundColor: 'limegreen',
        fontWeight: 'bold',
        padding: '5px 15px',
        color: 'white',
        borderRadius: '3px'
      }
    case "Cancelled":
      return {
        backgroundColor: 'darkred',
        fontWeight: 'bold',
        padding: '5px 15px',
        color: 'white',
        borderRadius: '3px'
      }
    default:
      return {}
  }
}

function changeConfirmation(msg){
  switch (msg) {
    case "Unconfirmed":
      return "Confirmed"
    case "Confirmed":
      return "Cancelled"
    case "Cancelled":
      return "Unconfirmed"
    default:
    break;
  }
}

function statusIcon(str){
  switch (str) {
    case 'needsAction':
      return <FontAwesomeIcon icon="circle" size="3x"/>
    case 'accepted':
      return <FontAwesomeIcon color="green" icon="check-circle" size="3x"/>
    case 'tentative':
      return <FontAwesomeIcon color="gold" icon="question-circle" size="3x"/>
    case 'declined':
      return <FontAwesomeIcon color="red" icon="times-circle" size="3x"/>
    default:
  }
}

export {
  styleConfirmation,
  changeConfirmation,
  statusIcon
}
