import * as types from "../constants";

export const setDate = date => ({
  type: types.SET_DATE,
  payload: date
});
