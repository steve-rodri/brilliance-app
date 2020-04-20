import * as types from "../constants";

export const updateSearchTitle = title => ({
  type: types.UPDATE_SEARCH_TITLE,
  payload: title
});

export const addRecentSearchTerm = term => ({
  type: types.ADD_RECENT_SEARCH_TERM,
  payload: term
});

export const setParams = params => ({
  type: types.SET_PARAMS,
  payload: params
});

export const clearParams = () => ({
  type: types.CLEAR_PARAMS
});
