import { googleRequests } from "../../services";
import { setUser } from "../actions";

export const authenticate = resp => {
  return async dispatch => {
    if (!resp.accessToken) return; //handle Error
    try {
      localStorage.setItem("google_access_token", resp.accessToken);
      const calendar = await findAdminCalendar();
      let user = {
        isAuthenticated: true,
        profile: resp.profileObj
      };
      if (calendar) {
        user.accessLevel = "admin";
        user.adminCalendar = calendar.id;
      } else {
        user.accessLevel = "employee";
      }

      dispatch(setUser(user));
    } catch (e) {
      console.log(e.message);
    }
  };
};

const findAdminCalendar = async () => {
  try {
    const calendars = await googleRequests.getCalendars();
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
