import moment from 'moment'
import { locationName } from './locationName'

export function eventTitle (evt){
  if (!evt.action) {
    return title(evt)
  } else if (title(evt)) {
    return `${evt.action} - ${title(evt)}`
  } else {
    return evt.action
  }
}

export function title(evt) {

  function location(){
    if (evt.location) {
      if (evt.location.shortName) {
        return evt.location.shortName
      } else if (evt.location.name) {
        return evt.location.name
      } else {
        return evt.location
      }
    }
  }

  function client(){
    if (evt.client && typeof evt.client === 'object' && evt.client.constructor === Object) {
      if (evt.client.company) {
        if (evt.client.company.name) {
          if (!evt.client.contactInfo) {
            return evt.client.company.name
          } else if (evt.client.contactInfo.fullName) {
            return evt.client.contactInfo.fullName
          }
        }
      }
    } else {
      return evt.client
    }
  }

  if (evt.confirmation === `Cancelled`) {
    return `CANCELLED`
  } else {
    if (location()) {
      if (evt.onPremise) {
        if (!evt.kind) {
          if (!evt.package) {
            if (!client()) {
              return `${location()}`
            } else {
              return `${location()} - ${client()}`
            }
          } else {
            if (!client()) {
              return `${location()} - ${evt.package}`
            } else {
              return `${location()} - ${client()}`
            }
          }
        } else {
          return `${location()} - ${evt.kind}`
        }
      } else {
        if (!client()) {
          if (!evt.package) {
            if (!evt.kind) {
              return location()
            } else {
              return `${evt.kind} - ${location()}`
            }
          } else {
            if (!evt.kind) {
              return `${evt.package} - ${location()}`
            } else {
              return `${evt.kind} - ${location()}`
            }
          }
        } else {
          if (!evt.package) {
            if (!evt.kind) {
              return `${client()} - ${location()}`
            } else {
              return `${client()} - ${evt.kind}`
            }
          } else {
            if (!evt.kind) {
              return `${client()} - ${evt.package}`
            } else {
              return `${client()} - ${evt.kind}`
            }
          }
        }
      }
    } else {
      if (!client()) {
        if (!evt.package) {
          if (!evt.kind) {
            return null
          } else {
            return `${evt.kind}`
          }
        } else {
          if (!evt.kind) {
            return `${evt.package}`
          } else {
            return `${evt.kind} - ${evt.package}`
          }
        }
      } else {
        if (!evt.package) {
          if (!evt.kind) {
            return client()
          } else {
            return `${client()} ${evt.kind}`
          }
        } else {
          if (!evt.kind) {
            return `${client()} - ${evt.package}`
          } else {
            return `${client()} ${evt.kind}`
          }
        }
      }
    }
  }
}

export function styleConfirmation(msg){
  switch (msg) {
    case "Unconfirmed":
      return {
        backgroundColor: 'gold',
        color: 'black'
      }
    case "Confirmed":
      return {
        backgroundColor: 'limegreen',
        color: 'white'
      }
    case "Cancelled":
      return {
        backgroundColor: 'darkred',
        color: 'white'
      }
    default:
      return {}
  }
}

export function changeConfirmation(msg){
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

export function call(evt) {
  if (!evt) return;

  if (evt.callTime && evt.callLocation) {
    let callLocation = locationName(evt.callLocation)
    if (typeof evt.callLocation === 'string') callLocation = evt.callLocation
    return (
      `${moment(evt.callTime).format('LT')} @ ${callLocation}`
    )
  } else if (evt.callTime) {
    return (
      moment(evt.callTime).format('LT')
    )
  } else {
    return null
  }
}

export function styleWorkerStatus(confirmation){
  let style = {}
  switch (confirmation) {
    case 'needsAction':
      style.backgroundColor = "gold"
      style.color = "black"
    break;
    case 'Unconfirmed':
      style.backgroundColor = "gold"
      style.color = "black"
    break;
    case 'accepted':
      style.backgroundColor = "limegreen"
      style.color = "white"
    break;
    case 'Confirmed':
      style.backgroundColor = "limegreen"
      style.color = "white"
    break;
    case 'tentative':
      style.backgroundColor = "gold"
      style.color = "black"
    break;
    case 'declined':
      style.backgroundColor = "red"
      style.color = "white"
    break;
    default:
    break;
  }
  return style;
}

export function changeWorkerStatus(confirmation){
  switch (confirmation) {
    case 'needsAction':
      return 'accepted'

    case 'Unconfirmed':
      return 'accepted'

    case 'accepted':
      return 'declined'

    case 'Confirmed':
      return 'declined'

    case 'tentative':
      return 'accepted'

    case 'declined':
      return 'tentative'

    default:
    break;
  }
}
