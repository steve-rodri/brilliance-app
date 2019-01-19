function eventTitle (evt){
  if (!evt.action) {
    return title(evt)
  } else {
    return `${evt.action} - ${title(evt)}`
  }
}

function title(evt) {

  function placeName(){
    if (evt.placeLocation) {
      if (evt.placeLocation.shortName) {
        return evt.placeLocation.shortName
      } else {
      return evt.placeLocation.name
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
    if (evt.placeLocation) {
      if (evt.placeLocation.installation) {
        if (!evt.kind) {
          if (!evt.package) {
            if (!client()) {
              return `${placeName()}`
            } else {
              return `${placeName()} - ${client()}`
            }
          } else {
            if (!client()) {
              return `${placeName()} - ${evt.package}`
            } else {
              return `${placeName()} - ${client()}`
            }
          }
        } else {
          return `${placeName()} - ${evt.kind}`
        }
      } else {
        if (!client()) {
          if (!evt.package) {
            if (!evt.kind) {
              return placeName()
            } else {
              return `${evt.kind} - ${placeName()}`
            }
          } else {
            if (!evt.kind) {
              return `${evt.package} - ${placeName()}`
            } else {
              return `${evt.kind} - ${placeName()}`
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
              console.log(client(), placeName())
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
