import { eventRequests, googleRequests } from "../../services";

export * from "./status";
export * from "./strings";
export * from "./fields";

export const updateEvent = async (id, data, googleAdminCalendar) => {
  //update on backend to return all data in event
  try {
    const { event: updatedEvent } = await eventRequests.update({ id }, data);
    //update google
    try {
      const googleData = await googleRequests.createOrPatchEvent(
        googleAdminCalendar,
        updatedEvent
      );
      try {
        //return event
        const { event: e } = await eventRequests.update({ id }, googleData);
        return e;
      } catch (resp) {
        console.log("Rails 2", resp);
        throw resp;
      }
    } catch (resp) {
      console.log("Google", resp);
      throw resp;
    }
  } catch (resp) {
    console.log("Rails 1", resp);
    throw resp;
  }
};
