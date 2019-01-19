function locationName(location){
  if (location) {
    if (location.shortName) {
      return location.shortName
    } else if (location.name) {
      return location.name
    }
  }
}

export {
  locationName
}
