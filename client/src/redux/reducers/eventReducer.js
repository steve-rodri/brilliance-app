import * as types from "../constants";

const initialState = {
  loading: true
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case types.FETCH_EVENTS:
      break;
    case types.FETCH_EVENTS_PENDING:
      break;
    case types.FETCH_EVENTS_REJECTED:
      break;
    case types.FETCH_EVENTS_FULFILLED:
      break;
    default:
      return state;
  }
}
