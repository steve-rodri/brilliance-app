import * as types from "../constants";

const initialState = {
  mobile: false,
  nav: true
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case types.SET_MOBILE:
      return {
        ...state,
        mobile: action.payload
      };
    case types.SET_NAV:
      return {
        ...state,
        nav: action.payload
      };
    default:
      return state;
  }
}
