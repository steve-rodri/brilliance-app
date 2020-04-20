import {
  isToday,
  isDay,
  isMonth,
  formatDateFromQueryString
} from "./dateHelpers";
import { date as convertDate } from "./datetime";
import { keysToCamel } from "./strings";
import queryString from "query-string";
import moment from "moment";

//input is object, output is string
export const searchTitleFromParams = params => {
  //convert ObjectKeys to camelCase
  if (!params) return "Today";
  let { start, end, q: query } = keysToCamel(params);
  if (start && end) {
    start = moment(start);
    end = moment(end);
    let dateObj = { start, end };

    let date = `${start.format("LL")} - ${end.format("LL")}`;
    if (isDay(dateObj)) date = `${convertDate(dateObj, true, true)}`;
    if (isMonth(dateObj)) date = `${start.format("MMMM YYYY")}`;
    if (isToday(dateObj)) date = "Today";

    let searchTitle = date;
    if (query) searchTitle = `${query}\n${date}`;
    return searchTitle;
  } else if (query) return query;
};

export const formatParamsFromQueryString = search => {
  if (!search) return null;
  let params = queryString.parse(search);
  if (params.date) {
    params = {
      ...params,
      ...formatDateFromQueryString(params.date)
    };
    delete params.date;
  }
  return params;
};
