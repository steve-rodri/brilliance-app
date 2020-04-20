import { combineReducers } from "redux";
import { sectionList, sectionForm, sectionSearch } from "./sandboxes";

export default combineReducers({
  list: sectionList.reducer,
  form: sectionForm.reducer,
  search: sectionSearch.reducer
});
