export function locationName(location) {
  if (!location || typeof location === "string") return;
  if (location.shortName) return location.shortName;
  if (location.name) return location.name;
}
