import moment from 'moment'
import { locationName } from './locationName'

function eventTitle (evt){
  if (!evt.action) {
    return title(evt)
  } else if (title(evt)) {
    return `${evt.action} - ${title(evt)}`
  } else {
    return evt.action
  }
}

function title(evt) {

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

function styleConfirmation(msg){
  switch (msg) {
    case "Unconfirmed":
      return {
        color: 'white',
        fontWeight: 'bold',
        backgroundColor: 'rgba(210,210,0,1)',
        padding: '5px 15px',
      }
    case "Confirmed":
      return {
        backgroundColor: 'limegreen',
        fontWeight: 'bold',
        padding: '5px 15px',
        color: 'white',
      }
    case "Cancelled":
      return {
        backgroundColor: 'darkred',
        fontWeight: 'bold',
        padding: '5px 15px',
        color: 'white',
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

function call(evt) {
  if (evt) {
    if (evt.callTime && evt.callLocation) {
      return (
        `${moment(evt.callTime).format('LT')} @ ${locationName(evt.callLocation)}`
      )
    } else if (evt.callTime) {
      return (
        moment(evt.callTime).format('LT')
      )
    } else {
      return null
    }
  }
}

export {
  eventTitle,
  call,
  styleConfirmation,
  changeConfirmation,
}
