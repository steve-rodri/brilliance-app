import { userIsUnauthenticated } from "../../actions";
import { eventSandbox } from "../../sandboxes";
import { googleRequests } from "../../../services";
import { changeConfirmationStatus, updateEvent } from "../../../helpers";

const {
  listActions: { updateItem }
} = eventSandbox.actions;

export * from "./listThunks";
export * from "./formThunks";
export * from "./searchThunks";

export const changeEventConfirmationStatus = ({ id, ...rest }) => {
  return async dispatch => {
    const newStatus = changeConfirmationStatus(rest.confirmation);
    const data = { confirmation: newStatus };
    dispatch(updateItem({ id, data }));
    try {
      const e = await updateEvent({ id }, data);
      dispatch(updateItem({ id, data: e }));
    } catch (error) {}
  };
};

export const syncAllEvents = () => {
  return async (dispatch, getState) => {
    const calendarId = getState().user.adminCalendar;
    try {
      await googleRequests.getEvents(calendarId);
    } catch (error) {
      if (error && error.status === 401) dispatch(userIsUnauthenticated());
    }
  };
};
