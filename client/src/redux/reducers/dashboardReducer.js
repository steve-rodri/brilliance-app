import { combineReducers } from "redux";
import { scheduleSandbox } from "../sandboxes";

export default combineReducers({
  schedule: scheduleSandbox.reducer
});
