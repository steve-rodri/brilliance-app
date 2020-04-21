import { eventSandbox } from "../../sandboxes";
import { eventRequests } from "../../../services";
import { generateSummary } from "../../../helpers";
import moment from "moment";

const {
  formActions: {
    addData,
    updateData,
    deleteData,
    reset,
    loading,
    loaded,
    setError,
    toggleEdit,
    setEditMode,
  },
} = eventSandbox.actions;

export const fetchEvent = (id) => {
  return async (dispatch) => {
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

export const setEvent = (e) => {
  return (dispatch) => {
    dispatch(addData(e));
    dispatch(loaded());
  };
};

export const setNewEvent = () => {
  return (dispatch) => {
    const now = moment();
    const remainder = 5 - (now.minute() % 5);
    dispatch(reset());
    dispatch(
      addData({
        summary: "New Event",
        start: moment(now).add(remainder, "minutes").toISOString(true),
        end: moment(now)
          .add(remainder, "minutes")
          .add(1, "hours")
          .toISOString(true),
      })
    );
    dispatch(setEditMode(true));
  };
};

export const updateEventFormData = (data = {}) => {
  return (dispatch, getState) => {
    const { data: stateData } = getState().section.events.form;

    if (!data.summary) {
      const newData = { ...stateData, ...data };
      const summary = generateSummary(newData);
      if (summary) data.summary = summary;
      else if (newData.summary !== "New Event") {
        data.summary = "New Event";
      }
    }

    if (data.start) {
      if (stateData.end) {
        if (moment(data.start).isAfter(moment(stateData.end))) {
          data.end = moment(data.start).toISOString(true);
        }
      }
      if (stateData.callTime) {
        if (moment(data.start).isBefore(moment(stateData.callTime))) {
          data.callTime = moment(data.start).toISOString(true);
        }
      }
    }

    if (Object.entries(data).length) dispatch(updateData(data));
  };
};

export const deleteEventFormData = (data) => {
  return (dispatch) => {
    dispatch(deleteData(data));
    dispatch(updateEventFormData());
  };
};

export const toggleEventFormEdit = () => {
  return (dispatch) => {
    dispatch(toggleEdit());
  };
};
