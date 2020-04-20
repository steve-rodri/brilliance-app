import { todaysDate, currentMonth } from "../../helpers/dateHelpers";
import { setDate } from "../actions";

export const setTodaysDate = () => {
  return dispatch => {
    dispatch(setDate(todaysDate));
  };
};

export const setCurrentMonth = () => {
  return dispatch => {
    dispatch(setDate(currentMonth));
  };
};
