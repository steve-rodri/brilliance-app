import * as types from "../constants/listConstants";

const initialState = {
  data: [],
  totalCount: 0,
  page: 1,
  loading: false,
  hasMore: true,
  scrollPosition: 0
};

export default function listReducer(state = initialState, action) {
  switch (action.type) {
    case types.ADD_DATA:
      let {
        payload: { id, data, totalCount }
      } = action;
      let totalData = data.length + state.data.length;
      if (totalData === totalCount) {
        action.payload.hasMore = false;
      } else {
        action.payload.page = state.page + 1;
      }
      action.payload.data = [...state.data, ...data];
      if (!totalCount) delete action.payload.totalCount;
      return {
        ...state,
        ...action.payload
      };

    case types.UPDATE_ITEM:
      data = state.data.map(item =>
        item.id === id ? { ...item, ...data } : item
      );
      return {
        ...state,
        data
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

    case types.SET_SCROLL_POSITION:
      return {
        ...state,
        scrollPosition: action.payload
      };

    case types.RESET:
      return initialState;

    default:
      return state;
  }
}
