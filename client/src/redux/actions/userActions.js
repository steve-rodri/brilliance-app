import * as types from "../constants";

export const setUser = user => ({
  type: types.AUTHENTICATE,
  payload: user
});

export const userIsUnauthenticated = () => ({
  type: types.UNAUTHENTICATE
});
