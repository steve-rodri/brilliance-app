import * as types from "../constants";

export const resize = () => {
  return dispatch => {
    dispatch(resetView());
    dispatch(updateNav());
  };
};

const resetView = () => {
  return dispatch => {
    const width = window.innerWidth;
    if (width < 750) dispatch(setMobile(true));
    else dispatch(setMobile(false));
  };
};

const updateNav = e => {
  return dispatch => {
    if (window.innerWidth > 1000) dispatch(setNav(false));
  };
};

const setMobile = value => ({
  type: types.SET_MOBILE,
  payload: value
});

const setNav = value => ({
  type: types.SET_NAV,
  payload: value
});
