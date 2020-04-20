import * as types from "../constants";

const initialState = {
  section: null,
  mobile: false,
  nav: false
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case types.SET_MOBILE:
      return {
        ...state,
        mobile: action.payload
      };
    case types.TOGGLE_NAV:
      return {
        ...state,
        nav: !state.nav
      };
    case types.DISPLAY_NAV:
      return {
        ...state,
        nav: true
      };
    case types.HIDE_NAV:
      return {
        ...state,
        nav: false
      };
    case types.SET_SECTION:
      return {
        ...state,
        section: action.payload
      };
    default:
      return state;
  }
}
