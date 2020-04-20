import { eventRequests } from "../../services";
import { changeWorkerStatus, updateEvent } from "../../helpers";
import { scheduleSandbox } from "../sandboxes";
import { userIsUnauthenticated } from "../actions";

const {
  listActions: { addListData, updateItem, loading, loaded }
} = scheduleSandbox.actions;

export const fetchUpcomingUserEvents = () => {
  return async (dispatch, getState) => {
    dispatch(loading());
    const {
      user: {
        profile: { email },
        adminCalendar: calendarId
      },
      section: {
        dashboard: {
          schedule: {
            list: { page }
          }
        }
      }
    } = getState();

    try {
      const upcomingUserEvents = await eventRequests.get({
        page,
        email,
        sendCount: true,
        upcoming: true,
        inProgress: true
      });

      if (!upcomingUserEvents.length) {
        dispatch(loaded());
        return;
      }

      const events = await Promise.all(
        upcomingUserEvents.map(async ({ id, ...data }) => {
          try {
            return await updateEvent(id, data, calendarId);
          } catch (error) {
            if (error.status === 401) {
              dispatch(userIsUnauthenticated());
            }
          }
        })
      );

      dispatch(addListData(events));
      dispatch(loaded());
    } catch (error) {
      console.log(error);
    }
  };
};

export const changeWorkerConfirmationStatus = async ({
  id,
  staff,
  ...rest
}) => {
  return async (dispatch, getState) => {
    const { user } = getState();

    staff = staff.map(worker => {
      if (worker.id !== user.id) return worker;
      return {
        ...worker,
        confirmation: changeWorkerStatus(worker.confirmation)
      };
    });

    let data = { id, staff, ...rest };
    dispatch(updateItem({ id, data }));

    try {
      data = await updateEvent(id, { eventEmployeesAttributes: staff });
    } catch (e) {
      console.log(e);
    } finally {
      dispatch(updateItem({ id, data }));
    }
  };
};
