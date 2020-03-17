import * as types from "../constants";
import { GOOGLE } from "../../services/google_service";

export const authenticate = resp => {
  return async dispatch => {
    if (!resp.accessToken) return; //handle Error
    try {
      localStorage.setItem("google_access_token", resp.accessToken);
      const calendar = await findAdminCalendar(resp.data.profileObj);
      let user = {
        isAuthenticated: true,
        profile: resp.data.profileObj
      };
      if (calendar) {
        user.accessLevel = "admin";
        user.adminCalendar = calendar.id;
      } else {
        user.accessLevel = "employee";
      }

      return {
        type: types.AUTHENTICATE,
        payload: user
      };
    } catch (e) {
      console.log(e.message);
    }
  };
};

const findAdminCalendar = async () => {
  try {
    const calendars = await GOOGLE.getCalendars(this.ajaxOptions);
    const jobsCalendar = calendars.find(calendar => {
      return (
        calendar.summary === "Jobs" &&
        calendar.id.includes("bob@brilliancepro.com")
      );
    });
    if (jobsCalendar) return jobsCalendar;
  } catch (e) {
    console.log(e.message);
  }
};
