import { formatToGoogle, formatFromGoogle } from "../helpers";
import { synchronizeGoogleEvents } from "../services";
import axios from "axios";
import Qs from "qs";

export const googleRequests = {
  getUser: async function (options) {
    const accessToken = localStorage.getItem("google_access_token");
    try {
      const resp = await axios({
        method: "get",
        url: "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return resp.data;
    } catch (e) {
      if (e.response && e.response.status === 401) {
        localStorage.removeItem("google_access_token");
      }
      throw e.response;
    }
  },
  getCalendars: async function () {
    const accessToken = localStorage.getItem("google_access_token");
    try {
      const resp = await axios({
        method: "get",
        url: "https://www.googleapis.com/calendar/v3/users/me/calendarList",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return resp.data.items;
    } catch (e) {
      if (e.response && e.response.status === 401) {
        localStorage.removeItem("google_access_token");
      }
      throw e.response;
    }
  },
  getEvent: async function (calendarId, eventId) {
    const accessToken = localStorage.getItem("google_access_token");
    try {
      const resp = await axios({
        method: "get",
        url: `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const googleEvent = await formatFromGoogle(resp.data);
      return googleEvent;
    } catch (e) {
      if (e.response && e.response.status === 401) {
        localStorage.removeItem("google_access_token");
      }
      throw e.response;
    }
  },
  getEvents: async function (calendarId) {
    const accessToken = localStorage.getItem("google_access_token");
    try {
      const resp = await axios({
        method: "get",
        url: `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?alwaysIncludeEmail=true&orderby=starttime&maxResults=2500`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // return Promise.all(resp.data.items.map(async e => syncGoogleEvent(e)));
      return await synchronizeGoogleEvents(resp.data.items, calendarId);
    } catch (e) {
      if (e.response && e.response.status === 401) {
        localStorage.removeItem("google_access_token");
      }
      throw e.response;
    }
  },
  createEvent: async function (calendarId, data, sendUpdates) {
    if (!sendUpdates) sendUpdates = "none";
    const accessToken = localStorage.getItem("google_access_token");
    try {
      const resp = await axios({
        method: "post",
        url: `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
        params: {
          sendUpdates: sendUpdates,
        },
        paramsSerializer: function (params) {
          return Qs.stringify(params, { skipNulls: true });
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: formatToGoogle(data),
      });
      const googleEvent = await formatFromGoogle(resp.data);
      return googleEvent;
    } catch (e) {
      if (e.response && e.response.status === 401) {
        localStorage.removeItem("google_access_token");
      }
      throw e.response;
    }
  },
  deleteEvent: async function (calendarId, eventId) {
    const accessToken = localStorage.getItem("google_access_token");
    try {
      await axios({
        method: "delete",
        url: `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return true;
    } catch (e) {
      if (e.response && e.response.status === 401) {
        localStorage.removeItem("google_access_token");
      }
      throw e.response;
    }
  },
  patchEvent: async function (calendarId, eventId, data, sendUpdates) {
    if (!sendUpdates) sendUpdates = "none";
    const accessToken = localStorage.getItem("google_access_token");

    try {
      const resp = await axios({
        method: "patch",
        url: `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`,
        params: {
          sendUpdates: sendUpdates,
        },
        paramsSerializer: function (params) {
          return Qs.stringify(params, { skipNulls: true });
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: formatToGoogle(data),
      });
      const googleEvent = await formatFromGoogle(resp.data);
      return googleEvent;
    } catch (e) {
      if (e.response && e.response.status === 401) {
        localStorage.removeItem("google_access_token");
      }
      throw e.response;
    }
  },
  importEvents: async function (calendarId, data, options) {
    const accessToken = localStorage.getItem("google_access_token");
    try {
      const resp = await axios({
        method: "post",
        url: `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/import`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: formatToGoogle(data),
      });
      const googleEvent = await formatFromGoogle(resp.data);
      return googleEvent;
    } catch (e) {
      if (e.response && e.response.status === 401) {
        localStorage.removeItem("google_access_token");
      }
      throw e.response;
    }
  },
  createOrPatchEvent: async function (calendarId, data) {
    if (!calendarId) return data;
    let googleEvent;
    // if no google identifier found, create the event
    if (!data.gcId) {
      try {
        googleEvent = await this.createEvent(calendarId, data);
      } catch (error) {
        if (error && error.response) {
          throw error.response;
        }
      }
    } else {
      // else patch the event using the identifier
      try {
        googleEvent = await this.patchEvent(calendarId, data.gcId);
      } catch (resp) {
        if (resp) {
          // if event is not found
          if (resp.status === 404) {
            // delete old identifiers
            delete data.gcId;
            delete data.gcICalUid;
            // try to create new google event
            try {
              googleEvent = await this.createEvent(calendarId, data);
            } catch (resp) {
              console.log("error in creation from 404");
              if (resp) throw resp;
            }
          } else {
            throw resp;
          }
        }
      }
    }

    //add extra data from google
    let newData = { ...data, ...googleEvent };
    return newData;
  },
};

// if (newData.eventEmployeesAttributes) {
//   const updatedStaff = newData.eventEmployeesAttributes.filter(ee => {
//     if (newData.employeeIds && newData.employeeIds.length) {
//       return newData.employeeIds.find(id => ee.employeeId !== id);
//     }
//     return true;
//   });
//   newData.eventEmployeesAttributes = updatedStaff;
// }
