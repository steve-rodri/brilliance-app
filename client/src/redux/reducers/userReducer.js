import * as types from "../constants";

const intitialState = {
  isAuthenticated: false,
  accessLevel: null
};

export default function reducer(state = intitialState, action) {
  switch (action.type) {
    case types.AUTHENTICATE:
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
}
