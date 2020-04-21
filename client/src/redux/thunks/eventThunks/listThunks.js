import { userIsUnauthenticated } from "../../actions";
import { eventSandbox } from "../../sandboxes";
import { eventRequests } from "../../../services";
import { generateSummary, updateEvent } from "../../../helpers";

const {
  listActions: {
    addData,
    loading,
    loaded,
    setScrollPosition,
    setColumnHeaders,
  },
} = eventSandbox.actions;

export const setEventListScrollPosition = (position) => {
  return (dispatch) => {
    dispatch(setScrollPosition(position));
  };
};

export const setEventListColumnHeaders = (headers) => {
  return (dispatch) => {
    dispatch(setColumnHeaders(headers));
  };
};

export const fetchEvents = () => {
  return async (dispatch, getState) => {
    dispatch(loading());
    let {
      date: { start, end },
      section: {
        events: {
          list: { page, data, totalCount },
          search: { params },
        },
      },
    } = getState();

    //configure params
    if (!params) params = { page, start, end };
    if (params) params = { page, ...params };
    if (page === 1) params.sendCount = "true";

    //if no event data or event data length is less than total length
    if (!data.length || data.length < totalCount) {
      // fetch and update events
      const resp = await eventRequests.get(params);
      dispatch(updateEvents(resp));
    }
  };
};

export const updateEvents = ({ events, meta }) => {
  return async (dispatch, getState) => {
    const {
      user: { adminCalendar: calendarId },
    } = getState();
    try {
      //loop through events from backend
      const syncedEvents = events.map(async ({ id, ...data }) => {
        //add summary if there is none
        if (!data.summary) data.summary = generateSummary(data);
        if (meta.next && meta.next.id === id) data.isNextEvent = true;
        try {
          return await updateEvent(id, data, calendarId);
        } catch (resp) {
          if (resp.status === 401) {
            throw resp;
          } else if (resp.status > 401) {
            return { id, ...data };
          }
        }
      });
      const data = await Promise.all(syncedEvents);

      dispatch(
        addData({
          data,
          totalCount: meta.count,
        })
      );
      dispatch(loaded());
    } catch (resp) {
      if (resp.status === 401) {
        dispatch(userIsUnauthenticated());
      }
    }
  };
};
