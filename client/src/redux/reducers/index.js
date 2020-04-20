import { combineReducers } from "redux";
import { eventSandbox, invoiceSandbox } from "../sandboxes";
import user from "./userReducer";
import date from "./dateReducer";
import view from "./viewReducer";
import dashboard from "./dashboardReducer";

const section = combineReducers({
  dashboard,
  events: eventSandbox.reducer,
  invoices: invoiceSandbox.reducer
});

export default combineReducers({
  user,
  date,
  view,
  section
});
