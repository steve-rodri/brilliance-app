import { combineReducers } from "redux";
import events from "./eventReducer";
import user from "./userReducer";

export default combineReducers({
  user,
  events
});
