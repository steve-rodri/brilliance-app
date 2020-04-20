const fieldNames = [
  "summary",
  "confirmation",
  "start",
  "end",
  "callTime",
  "action",
  "kind",
  "description",
  "notes",
  "package"
];

export const setFields = e => {
  let fields = {};
  fieldNames.forEach(field => (fields[field] = e ? e[field] : null));
  return fields;
};
