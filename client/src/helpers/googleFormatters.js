import {
  contactRequests,
  employeeRequests,
  eventRequests
} from "../services/railsServer.js";
import { start, end, time } from "./datetime";
import { locationName } from "./locationName";
import moment from "moment";

const spacer = "***************************************";

//--------------Format FROM Google----------------------

export async function formatFromGoogle(googleEvent, dateValidation) {
  if (!googleEvent) return;
  const workers = await attendees(googleEvent);
  const eCreator = await creator(googleEvent);
  const confirmation = status(googleEvent);
  const notes = description(googleEvent);

  let data = {};

  if (googleEvent.id) {
    data.gcId = googleEvent.id;
  }

  if (googleEvent.iCalUID) {
    data.gcICalUid = googleEvent.iCalUID;
  }

  if (googleEvent.start) {
    data.start = moment(start(googleEvent)).format();
    if (dateValidation) {
      const startMatch = moment(dateValidation.start).isSame(
        moment(start(googleEvent))
      );
      if (!startMatch) data.start = dateValidation.start;
    }
  }

  if (googleEvent.end) {
    data.end = moment(end(googleEvent)).format();
    if (dateValidation) {
      const endMatch = moment(dateValidation.end).isSame(
        moment(end(googleEvent))
      );
      if (!endMatch) data.end = dateValidation.end;
    }
  }

  if (googleEvent.summary) {
    data.summary = googleEvent.summary;
  }

  if (confirmation) {
    data.confirmation = confirmation;
  }

  if (notes) {
    data.notes = notes;
  }

  if (workers) {
    data.eventEmployeesAttributes = workers;
  }

  if (eCreator) {
    data.creatorId = eCreator;
  }

  if (googleEvent.htmlLink) {
    data.htmlLink = googleEvent.htmlLink;
  }
  return data;
}

async function creator(googleEvent) {
  if (!googleEvent) return;
  try {
    const ct = await contactRequests.get({ email: googleEvent.creator.email });
    return ct.id;
  } catch (error) {
    if (error.response.status === 404) {
      return null;
    }
  }
}

async function attendees(googleEvent) {
  if (!googleEvent || !googleEvent.attendees) return;

  try {
    //Find event in database that has a google identifier
    let e = await eventRequests.get({ gcICalUid: googleEvent.iCalUID });

    // IF job has no workers create new
    if (e && !e.staff && !e.staff.length) {
      const staff = await Promise.all(
        googleEvent.attendees.filter(async attendee => {
          const worker = await employeeRequests.get({ email: attendee.email });
          //you could create a new worker in the db here, instead of returning null
          if (!worker) return null;
          worker.confirmation = attendee.responseStatus;
          return worker;
        })
      );
      if (!staff && !staff.length) return;
      const workers = staff.map(s => ({
        employeeId: s.id,
        confirmation: s.confirmation
      }));
      return workers;
    }

    // ELSE Update Workers
    const staff = googleEvent.attendees.map(attendee => {
      let updatedWorker;
      e.staff.forEach(worker => {
        const email = worker.info.contact.emailAddresses.find(
          email =>
            email.emailAddress.toLowerCase() === attendee.email.toLowerCase()
        );
        if (!email) return;
        updatedWorker = {
          id: worker.id,
          employeeId: worker.info.id,
          confirmation: attendee.responseStatus
        };
      });
      return updatedWorker;
    });
    if (!staff && !staff.length) return;
    const workers = staff.filter(s => s !== null);
    return workers;
  } catch (error) {
    // IF no pre-existing Job has been found, return workers to add to new Job
    if (error.response.status === 404) {
      const staff = await Promise.all(
        googleEvent.attendees.map(async attendee => {
          //worker should = find or create employee
          let worker = await employeeRequests.get({ email: attendee.email });
          if (!worker) return null;
          if (!attendee.organizer)
            worker.confirmation = attendee.responseStatus;
          return worker;
        })
      );
      if (!staff && !staff.length) return;
      const trimmed = staff.filter(s => s !== null);
      const workers = trimmed.map(s => ({
        employee_id: s.id,
        confirmation: s.confirmation
      }));
      return workers;
    }
  }
}

function status(googleEvent) {
  if (googleEvent) {
    switch (googleEvent.status) {
      case "tentative":
        return "Unconfirmed";
      case "confirmed":
        return "Confirmed";
      case "cancelled":
        return "Cancelled";
      default:
        break;
    }
  }
}

function description(googleEvent) {
  if (googleEvent) {
    if (googleEvent.description) {
      const subsection = googleEvent.description.includes(spacer);
      if (subsection) {
        let length = `${spacer}\n\n`.length;
        let i = googleEvent.description.indexOf(spacer);
        let notes = googleEvent.description.slice(i + length);
        return notes;
      } else {
        return googleEvent.description;
      }
    }
  }
}

// ------------Format TO Google -----------------------

export function formatToGoogle(e) {
  if (e) {
    const status = confirmation(e.confirmation);
    const description = notes(e);
    const attendees = staff(e.staff);
    const location = place(e);

    let data = { status };

    if (e.summary) {
      data.summary = e.summary;
    }

    if (location) {
      data.location = location;
    }

    if (e.start && e.callTime) {
      if (moment(e.callTime).isBefore(moment(e.start))) {
        data.start = { dateTime: moment(e.callTime).format() };
      } else {
        data.start = { dateTime: moment(e.start).format() };
      }
    } else if (e.start) {
      data.start = { dateTime: moment(e.start).format() };
    }

    if (e.end) {
      data.end = { dateTime: moment(e.end).format() };
    }

    if (attendees) {
      data.attendees = attendees;
    }

    if (description) {
      data.description = description;
    } else {
      data.description = "";
    }

    return data;
  }
}

function confirmation(status) {
  switch (status) {
    case "Unconfirmed":
      return "tentative";
    case "Confirmed":
      return "confirmed";
    case "Cancelled":
      return "cancelled";
    default:
      break;
  }
}

function place(e) {
  if (e.location) {
    if (e.location.address) {
      return e.location.address.address;
    }
  }
}

function notes(e) {
  if (e.notes) {
    if (notesTimeSection(e)) {
      return notesTimeSection(e) + `${e.notes}`;
    } else {
      return e.notes;
    }
  } else {
    if (notesTimeSection(e)) {
      return notesTimeSection(e);
    }
  }
}

function notesTimeSection(e) {
  if (e.callTime && e.callLocation) {
    return `Call: ${moment(e.callTime).format("LT")} @ ${locationName(
      e.callLocation
    )}\nJob: ${time(e)}\n\n${spacer}\n\n`;
  } else if (e.callTime) {
    return `Call: ${moment(e.callTime).format("LT")}\nJob: ${time(
      e
    )}\n\n${spacer}\n\n`;
  }
}

function staff(eventEmployees) {
  if (eventEmployees) {
    const attendees = eventEmployees.map(worker => {
      return {
        email: worker.info.contact.emailAddresses[0].emailAddress,
        displayName: worker.info.contact.fullName,
        organizer: false,
        responseStatus: worker.confirmation
      };
    });
    return attendees;
  } else {
    return [];
  }
}
