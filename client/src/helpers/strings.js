import moment from "moment";

export const initials = fullName => {
  if (typeof fullName !== "string")
    console.log(initials, `fullName is ${typeof fullName} not string`);
  if (!fullName || typeof fullName !== "string") return "";
  let words = fullName.split(" ");
  let letters = words.map(word => word.charAt(0).toUpperCase());
  return letters.join("");
};

export const greeting = user => {
  const username = user ? user.profile.givenName : "";
  const currentTime = moment().format();
  const morningZ = moment()
    .startOf("day")
    .add(6, "hours");
  const morning = moment(morningZ).format();
  const noonZ = moment()
    .startOf("day")
    .add(11, "hours");
  const noon = moment(noonZ).format();
  const eveningZ = moment()
    .startOf("day")
    .add(17, "hours");
  const evening = moment(eveningZ).format();

  if (moment(currentTime).isBetween(morning, noon)) {
    return `Good Morning ${username},`;
  } else if (moment(currentTime).isBetween(noon, evening)) {
    return `Good Afternoon ${username},`;
  } else if (moment(currentTime).isAfter(evening)) {
    return `Good Evening ${username},`;
  }
};

export const singularTense = value => {
  if (!value) return;
  return value
    .split("")
    .splice(0, value.length - 1)
    .join("");
};

export const isNullOrWhitespace = input => {
  if (typeof input === "undefined" || input == null) return true;
  return input.replace(/\s/g, "").length < 1;
};

export const camelToSnake = str =>
  str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

export const toSnake = str => {
  str = str.toLowerCase();
  return str.replace(/\s/g, "_");
};

export const toCamel = s => {
  return s.replace(/([-_][a-z])/gi, $1 => {
    return $1
      .toUpperCase()
      .replace("-", "")
      .replace("_", "");
  });
};

export const isArray = function(a) {
  return Array.isArray(a);
};

export const isObject = function(o) {
  return o === Object(o) && !isArray(o) && typeof o !== "function";
};

export const keysToCamel = function(o) {
  if (isObject(o)) {
    const n = {};

    Object.keys(o).forEach(k => {
      n[toCamel(k)] = keysToCamel(o[k]);
    });

    return n;
  } else if (isArray(o)) {
    return o.map(i => {
      return keysToCamel(i);
    });
  }

  return o;
};

export const keysToSnake = function(o) {
  if (isObject(o)) {
    const n = {};

    Object.keys(o).forEach(k => {
      n[camelToSnake(k)] = keysToSnake(o[k]);
    });

    return n;
  } else if (isArray(o)) {
    return o.map(i => {
      return keysToSnake(i);
    });
  }

  return o;
};
