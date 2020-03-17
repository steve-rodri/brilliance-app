import { combineReducers } from "redux";
import events from "./eventReducer";
import user from "./userReducer";
import date from "./dateReducer";
import view from "./viewReducer";

export default combineReducers({
  user,
  date,
  view,
  events
});
