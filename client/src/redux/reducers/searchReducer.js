import * as types from "../constants";

const initialState = {
  title: "",
  history: [],
  params: null
};

export default function searchReducer(
  state = initialState,
  { type, payload } = {}
) {
  switch (type) {
    case types.UPDATE_SEARCH_TITLE:
      return {
        ...state,
        title: payload
      };

    case types.ADD_RECENT_SEARCH_TERM:
      if (state.recentSearches.includes(payload)) {
        return state;
      }
      const newState = {
        ...state,
        history: [...state.recentSearches, payload]
      };
      if (newState.recentSearches.length > 8) {
        newState.recentSearches.shift();
      }
      return newState;
    case types.SET_PARAMS:
      return {
        ...state,
        params: payload
      };
    case types.CLEAR_PARAMS:
      return {
        ...state,
        params: null
      };
    default:
      return state;
  }
}
