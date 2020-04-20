import moment from "moment";
import { locationName } from "../locationName";

export const summaryFormatter = summary => {
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

export const eventTitle = evt => {
  if (!evt.action) {
    return title(evt);
  } else if (title(evt)) {
    return `${evt.action} - ${title(evt)}`;
  } else {
    return evt.action;
  }
};

export const title = evt => {
  const location = () => {
    if (evt.location) {
      if (evt.location.shortName) {
        return evt.location.shortName;
      } else if (evt.location.name) {
        return evt.location.name;
      } else {
        return evt.location;
      }
    }
  };

  const client = () => {
    if (
      evt.client &&
      typeof evt.client === "object" &&
      evt.client.constructor === Object
    ) {
      if (evt.client.company) {
        if (evt.client.company.name) {
          if (!evt.client.contactInfo) {
            return evt.client.company.name;
          } else if (evt.client.contactInfo.fullName) {
            return evt.client.contactInfo.fullName;
          }
        }
      }
    } else {
      return evt.client;
    }
  };

  if (evt.confirmation === `Cancelled`) {
    return `CANCELLED`;
  } else {
    if (location()) {
      if (evt.onPremise) {
        if (!evt.kind) {
          if (!evt.package) {
            if (!client()) {
              return `${location()}`;
            } else {
              return `${location()} - ${client()}`;
            }
          } else {
            if (!client()) {
              return `${location()} - ${evt.package}`;
            } else {
              return `${location()} - ${client()}`;
            }
          }
        } else {
          return `${location()} - ${evt.kind}`;
        }
      } else {
        if (!client()) {
          if (!evt.package) {
            if (!evt.kind) {
              return location();
            } else {
              return `${evt.kind} - ${location()}`;
            }
          } else {
            if (!evt.kind) {
              return `${evt.package} - ${location()}`;
            } else {
              return `${evt.kind} - ${location()}`;
            }
          }
        } else {
          if (!evt.package) {
            if (!evt.kind) {
              return `${client()} - ${location()}`;
            } else {
              return `${client()} - ${evt.kind}`;
            }
          } else {
            if (!evt.kind) {
              return `${client()} - ${evt.package}`;
            } else {
              return `${client()} - ${evt.kind}`;
            }
          }
        }
      }
    } else {
      if (!client()) {
        if (!evt.package) {
          if (!evt.kind) {
            return null;
          } else {
            return `${evt.kind}`;
          }
        } else {
          if (!evt.kind) {
            return `${evt.package}`;
          } else {
            return `${evt.kind} - ${evt.package}`;
          }
        }
      } else {
        if (!evt.package) {
          if (!evt.kind) {
            return client();
          } else {
            return `${client()} ${evt.kind}`;
          }
        } else {
          if (!evt.kind) {
            return `${client()} - ${evt.package}`;
          } else {
            return `${client()} ${evt.kind}`;
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
