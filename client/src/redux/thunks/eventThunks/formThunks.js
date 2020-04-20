import { eventSandbox } from "../../sandboxes";
import { eventRequests } from "../../../services";
import moment from "moment";

const {
  formActions: {
    addData,
    updateData,
    setError,
    loading,
    loaded,
    toggleEdit,
    setEditMode
  }
} = eventSandbox.actions;

export const fetchEvent = id => {
  return async dispatch => {
    dispatch(loading());
    try {
      const { event: e } = await eventRequests.get({ id });
      dispatch(addData(e));
      dispatch(loaded());
    } catch (error) {
      if (error && error.response) {
        dispatch(setError(error.response));
        dispatch(loaded());
      }
    }
  };
};

export const setEvent = e => {
  return dispatch => {
    dispatch(addData(e));
    dispatch(loaded());
  };
};

export const setNewEvent = () => {
  return dispatch => {
    dispatch(
      addData({
        summary: "New Event",
        start: moment()
          .startOf("hour")
          .toISOString(true),
        end: moment()
          .startOf("hour")
          .add(1, "hours")
          .toISOString(true)
      })
    );
    dispatch(setEditMode(true));
    dispatch(loaded());
  };
};

export const updateEventFormData = data => {
  return dispatch => {
    dispatch(updateData(data));
  };
};

export const toggleEventFormEdit = () => {
  return dispatch => {
    dispatch(toggleEdit());
  };
};
