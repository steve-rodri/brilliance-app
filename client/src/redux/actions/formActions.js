import * as types from "../constants/formConstants";

export const addData = (payload) => ({
  type: types.ADD_DATA,
  payload,
});

export const updateData = (payload) => ({
  type: types.UPDATE_DATA,
  payload,
});

export const deleteData = (payload) => ({
  type: types.DELETE_DATA,
  payload,
});

export const loading = () => ({
  type: types.LOADING,
});

export const loaded = () => ({
  type: types.LOADED,
});

export const reset = () => ({
  type: types.RESET,
});

export const setError = (payload) => ({
  type: types.SET_ERROR,
  payload,
});

export const toggleEdit = () => ({
  type: types.TOGGLE_EDIT,
});

export const setEditMode = (payload) => ({
  type: types.SET_EDIT_MODE,
  payload,
});
