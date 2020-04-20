import * as types from "../constants";

export const setMobile = value => ({
  type: types.SET_MOBILE,
  payload: value
});

export const toggleNav = () => ({
  type: types.TOGGLE_NAV
});

export const displayNav = () => ({
  type: types.DISPLAY_NAV
});

export const hideNav = () => ({
  type: types.HIDE_NAV
});

export const setSection = value => ({
  type: types.SET_SECTION,
  payload: value
});
