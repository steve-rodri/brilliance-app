import { eventSandbox } from "../../sandboxes";
import { searchTitleFromParams } from "../../../helpers";

const {
  searchActions: { updateSearchTitle, setParams, clearParams },
  listActions: { reset }
} = eventSandbox.actions;

export const newEventsQueryStarted = params => {
  return dispatch => {
    dispatch(updateSearchTitle(searchTitleFromParams(params)));
    dispatch(reset());
  };
};

export const setEventListSearchTitle = title => {
  return dispatch => {
    dispatch(updateSearchTitle(title));
  };
};

export const setEventSearchParams = params => {
  return dispatch => {
    dispatch(setParams(params));
  };
};

export const clearEventSearchParams = () => {
  return dispatch => {
    dispatch(clearParams());
  };
};
