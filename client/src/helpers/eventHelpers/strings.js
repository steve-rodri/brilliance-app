import moment from "moment";
import { locationName } from "../locationName";
import { clientName } from "../clientHelpers";

export const summaryFormatter = (summary) => {
  let slashWords = [];
  let hyphenWords = [];
  if (summary.search("/")) {
    slashWords = summary.split("/");
  }
  if (summary.search("-")) {
    hyphenWords = summary.split("-");
  }
  const words = slashWords.length > 1 ? slashWords : hyphenWords;
  if (words.length > 1) summary = words.join(" ");
  return summary;
};

export const generateSummary = (data) => {
  if (!data.action) {
    return title(data);
  } else if (title(data)) {
    return `${data.action} - ${title(data)}`;
  } else {
    return data.action;
  }
};

export const title = ({
  location,
  package: p,
  confirmation,
  onPremise,
  kind,
  client,
}) => {
  location = locationName(location);
  client = clientName(client);
  if (confirmation === `Cancelled`) {
    return `CANCELLED`;
  } else {
    if (location) {
      if (onPremise) {
        if (!kind) {
          if (!p) {
            if (!client) {
              return `${location}`;
            } else {
              return `${location} - ${client}`;
            }
          } else {
            if (!client) {
              return `${location} - ${p}`;
            } else {
              return `${location} - ${client}`;
            }
          }
        } else {
          return `${location} - ${kind}`;
        }
      } else {
        if (!client) {
          if (!p) {
            if (!kind) {
              return location;
            } else {
              return `${kind} - ${location}`;
            }
          } else {
            if (!kind) {
              return `${p} - ${location}`;
            } else {
              return `${kind} - ${location}`;
            }
          }
        } else {
          if (!p) {
            if (!kind) {
              return `${client} - ${location}`;
            } else {
              return `${client} - ${kind}`;
            }
          } else {
            if (!kind) {
              return `${client} - ${p}`;
            } else {
              return `${client} - ${kind}`;
            }
          }
        }
      }
    } else {
      if (!client) {
        if (!p) {
          if (!kind) {
            return null;
          } else {
            return `${kind}`;
          }
        } else {
          if (!kind) {
            return `${p}`;
          } else {
            return `${kind} - ${p}`;
          }
        }
      } else {
        if (!p) {
          if (!kind) {
            return client;
          } else {
            return `${client} ${kind}`;
          }
        } else {
          if (!kind) {
            return `${client} - ${p}`;
          } else {
            return `${client} ${kind}`;
          }
        }
      }
    }
  }
};

export const call = ({ callTime, callLocation }) => {
  if (!callTime || !callLocation) return;

  if (callTime && callLocation) {
    callLocation = locationName(callLocation);
    return `${moment(callTime).format("LT")} @ ${callLocation}`;
  } else if (callTime) return moment(callTime).format("LT");
};
