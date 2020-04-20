import * as types from "../constants";

const initialState = {
  isAuthenticated: false,
  accessLevel: null,
  preferences: {
    itemsPerPage: 25
  }
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case types.AUTHENTICATE:
      return {
        ...state,
        ...action.payload
      };
    case types.UNAUTHENTICATE:
      return {
        ...state,
        isAuthenticated: false,
        accessLevel: null
      };
    default:
      return state;
  }
}
