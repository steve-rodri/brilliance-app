import * as types from "../constants";

export const setMobile = value => ({
  type: types.SET_MOBILE,
  payload: value
});

export const setNav = value => ({
  type: types.SET_NAV,
  payload: value
});
