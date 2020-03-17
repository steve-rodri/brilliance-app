import * as types from "../constants";
import moment from "moment";

const initialState = {
  start: moment()
    .startOf("day")
    .toISOString(true),
  end: moment()
    .endOf("day")
    .toISOString(true)
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
