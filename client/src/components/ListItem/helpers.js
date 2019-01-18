function title (evt) {

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
    if (evt.client) {
      if (evt.client.company) {
        if (evt.client.company.name) {
          if (!evt.client.contactInfo) {
            return evt.client.company.name
          } else if (evt.client.contactInfo.fullName) {
            return evt.client.contactInfo.fullName
          }
        }
      }
    }
  }

  if (evt.confirmation === `Cancelled`) {
    return `CANCELLED`
  } else {
    if (evt.placeLocation) {
      if (evt.placeLocation.installation) {
        if (!evt.kind) {
          if (!evt.tags) {
            if (!client()) {
              return `${placeName()}`
            } else {
              return `${placeName()} - ${client()}`
            }
          } else {
            if (!client()) {
              return `${placeName()} - ${evt.tags}`
            } else {
              return `${placeName()} - ${client()}`
            }
          }
        } else {
          return `${placeName()} - ${evt.kind}`
        }
      } else {
        if (!client()) {
          if (!evt.tags) {
            if (!evt.kind) {
              return placeName()
            } else {
              return `${evt.kind} - ${placeName()}`
            }
          } else {
            if (!evt.kind) {
              return `${evt.tags} - ${placeName()}`
            } else {
              return `${evt.kind} - ${placeName()}`
            }
          }
        } else {
          if (!evt.tags) {
            if (!evt.kind) {
              return client()
            } else {
              return `${client()} - ${evt.kind}`
            }
          } else {
            if (!evt.kind) {
              console.log(client(), placeName())
              return `${client()} - ${evt.tags}`
            } else {
              return `${client()} - ${evt.kind}`
            }
          }
        }
      }
    } else {
      if (!client()) {
        if (!evt.tags) {
          if (!evt.kind) {
            return null
          } else {
            return `${evt.kind}`
          }
        } else {
          if (!evt.kind) {
            return `${evt.tags}`
          } else {
            return `${evt.kind} - ${evt.tags}`
          }
        }
      } else {
        if (!evt.tags) {
          if (!evt.kind) {
            return client()
          } else {
            return `${client()} ${evt.kind}`
          }
        } else {
          if (!evt.kind) {
            return `${client()} - ${evt.tags}`
          } else {
            return `${client()} ${evt.kind}`
          }
        }
      }
    }
  }
}

export {
  title
}
