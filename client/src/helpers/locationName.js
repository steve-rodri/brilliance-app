export function locationName(location){
  if (!location) return;

  if (location.shortName) return location.shortName
  if (location.name) return location.name
}
