function eventTitle (evt){
  if (!evt.action) {
    return title(evt)
  } else {
    return `${evt.action} - ${title(evt)}`
  }
}

function title(evt) {

  function location(){
    if (!evt.location) {
      if (evt.placeLocation) {
        if (evt.placeLocation.shortName) {
          return evt.placeLocation.shortName
        } else {
        return evt.placeLocation.name
        }
      }
    } else {
      return evt.location
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
              return client()
            } else {
              return `${client()} - ${evt.kind}`
            }
          } else {
            if (!evt.kind) {
              console.log(client(), location())
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

export {
  eventTitle
}
