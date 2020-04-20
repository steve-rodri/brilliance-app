import reducerSandbox from "reducer-sandbox";
import { combineReducers } from "redux";
import listReducer from "../reducers/listReducer";
import formReducer from "../reducers/formReducer";
import searchReducer from "../reducers/searchReducer";
import * as listActions from "../actions/listActions";
import * as formActions from "../actions/formActions";
import * as searchActions from "../actions/searchActions";

export default class Sandbox {
  constructor({ list, form, search } = {}) {
    let reducers = {};
    this.actions = {};
    if (list) {
      this.list = reducerSandbox(listReducer);
      this.actions.listActions = this.list.bindToActionCreators({
        ...listActions
      });
      reducers.list = this.list.reducer;
    }
    if (form) {
      this.form = reducerSandbox(formReducer);
      this.actions.formActions = this.form.bindToActionCreators({
        ...formActions
      });
      reducers.form = this.form.reducer;
    }
    if (search) {
      this.search = reducerSandbox(searchReducer);
      this.actions.searchActions = this.search.bindToActionCreators({
        ...searchActions
      });
      reducers.search = this.search.reducer;
    }
    this.reducer = combineReducers(reducers);
  }
}
