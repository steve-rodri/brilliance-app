import * as types from "../constants/listConstants";

export const addData = payload => ({
  type: types.ADD_DATA,
  payload
});

export const updateItem = payload => ({
  type: types.UPDATE_ITEM,
  payload
});

export const loading = () => ({
  type: types.LOADING
});

export const loaded = () => ({
  type: types.LOADED
});

export const setScrollPosition = payload => ({
  type: types.SET_SCROLL_POSITION,
  payload
});

export const reset = () => ({
  type: types.RESET
});
