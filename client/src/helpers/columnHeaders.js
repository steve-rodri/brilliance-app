export const columnHeaders = collectionType => {
  switch (collectionType) {
    case "Events":
      return ["description", "scheduled", "status"];
    case "Scheduled Events":
      return ["event", "event", "event", "confirmation"];
    default:
      return null;
  }
};
