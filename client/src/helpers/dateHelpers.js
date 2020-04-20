import moment from "moment";

export const todaysDate = {
  start: moment()
    .startOf("day")
    .toISOString(true),
  end: moment()
    .endOf("day")
    .toISOString(true)
};

export const currentMonth = {
  start: moment()
    .startOf("month")
    .toISOString(true),
  end: moment()
    .endOf("month")
    .toISOString(true)
};

export const isDay = date => {
  const isDay = moment(date.end).diff(moment(date.start), "days") <= 1;
  return isDay;
};

export const isToday = date => {
  const today = todaysDate;
  const match =
    moment(today.start).isSame(moment(date.start)) &&
    moment(today.end).isSame(moment(date.end));
  return match;
};

export const isMonth = date => {
  const { start: s, end: e } = date;
  const start = moment(s);
  const end = moment(e);
  const isMonth =
    start.month() === end.month() &&
    start.date() === 1 &&
    end.date() === start.daysInMonth();
  return isMonth;
};

export const formatDateFromQueryString = date => {
  let includesDay = date.search(/[-][0-9][0-9][-]/) > 0;
  if (includesDay) {
    date = {
      start: moment(date)
        .startOf("day")
        .toISOString(true),
      end: moment(date)
        .endOf("day")
        .toISOString(true)
    };
  } else {
    date = {
      start: moment(date)
        .startOf("month")
        .toISOString(true),
      end: moment(date)
        .endOf("month")
        .toISOString(true)
    };
  }
  return date;
};
