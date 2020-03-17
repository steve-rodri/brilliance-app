import * as types from "../constants";

const intitialState = {
  loading: true,
  isAuthenticated: false,
  accessLevel: null
};

export default function reducer(state = intitialState, action) {
  switch (action.type) {
    case types.FETCH_USER:
      break;
    default:
      return state;
  }
}
