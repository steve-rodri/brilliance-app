import * as types from "../constants/formConstants";

const initialState = {
  data: {},
  edit: false,
  loading: true
};

export default function formReducer(
  state = initialState,
  { type, payload } = {}
) {
  switch (type) {
    case types.ADD_DATA:
      return {
        ...state,
        data: payload
      };
    case types.UPDATE_DATA:
      return {
        ...state,
        data: {
          ...state.data,
          ...payload
        }
      };
    case types.LOADING:
      return {
        ...state,
        loading: true
      };
    case types.LOADED:
      return {
        ...state,
        loading: false
      };
    case types.SET_ERROR:
      return {
        ...state,
        error: payload
      };
    case types.TOGGLE_EDIT:
      return {
        ...state,
        edit: !state.edit
      };

    case types.SET_EDIT_MODE:
      return {
        ...state,
        edit: payload
      };
    default:
      return state;
  }
}
