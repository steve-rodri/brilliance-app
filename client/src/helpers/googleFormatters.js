import { contact, employee, event } from '../services/BEP_APIcalls.js'
import { start, end, time } from './datetime'
import { locationName } from './locationName'
import moment from 'moment'

const spacer = '***************************************';

//--------------Format FROM Google----------------------

export async function formatFromGoogle(evt, options){
  if (evt) {
    const workers = await attendees(evt, options);
    const eCreator = await creator(evt, options);
    const confirmation = status(evt);
    const notes = description(evt)

    let data = {};

    if (evt.id) {
      data.gc_id = evt.id
    }

    if (evt.iCalUID) {
      data.i_cal_UID = evt.iCalUID
    }

    if (evt.start) {
      data.start = moment(start(evt)).format()
    }

    if (evt.end) {
      data.end = moment(end(evt)).format()
    }

    if (evt.summary) {
      data.summary = evt.summary
    }

    if (confirmation) {
      data.confirmation = confirmation
    }

    if (notes) {
      data.notes = notes
    }

    if (workers) {
      data.event_employees_attributes = workers;
    }

    if (eCreator) {
      data.creator_id = eCreator
    }

    return data
  }
}

async function creator(e, options){
  if (e) {
    const ct = await contact.find({ email: e.creator.email }, options)
    if (ct) {
      return ct.id
    } else {
      return null
    }
  }
}

async function attendees(evt, options){
  if (!evt || !evt.attendees) return;
  let e = await event.get(null, { ...options, iCalUID: evt.iCalUID})

  // IF no Job has been found, return workers to add to new Job
  if (!e) {
    const staff = await Promise.all(evt.attendees.map(async attendee => {
      let worker = await employee.get({ email: attendee.email }, options)
      if (!worker) return null;
      if (!attendee.organizer) worker.confirmation = attendee.responseStatus
      return worker
    }))
    if (!staff && !staff.length) return;
    const trimmed = staff.filter(s => s !== null)
    const workers = trimmed.map(s => ({employee_id: s.id, confirmation: s.confirmation }))
    return workers
  }

  // IF job has no workers create new
  if (!e.staff && !e.staff.length) {
    const staff = await Promise.all(evt.attendees.map(async attendee => {
      const worker = await employee.get({ email: attendee.email }, options)
      if (!worker) return null;
      worker.confirmation = attendee.responseStatus
      return worker
    }))
    if (!staff && !staff.length) return;
    const trimmed = staff.filter(s => s !== null)
    const workers = trimmed.map(s => ({employee_id: s.id, confirmation: s.confirmation }))
    return workers
  }

  // Update Workers
  const staff = evt.attendees.map(attendee => {
    let updatedWorker;
    e.staff.forEach( worker => {
      const email = worker.info.contact.emailAddresses.find( email =>
        email.emailAddress.toLowerCase() === attendee.email.toLowerCase()
      )
      if (!email) return;
      updatedWorker = {
        id: worker.id,
        employee_id: worker.info.id,
        confirmation: attendee.responseStatus
      }
    })
    return updatedWorker
  })
  if (!staff && !staff.length) return;
  const workers = staff.filter(s => s !== null)
  return workers
}

function status (evt) {
  if (evt) {
    switch (evt.status) {
      case 'tentative':
        return 'Unconfirmed'
      case 'confirmed':
        return 'Confirmed'
      case 'cancelled':
        return 'Cancelled'
      default:
        break;
    }
  }
}

function description(evt){
  if (evt) {
    if (evt.description) {
      const subsection = evt.description.includes(spacer)
      if (subsection) {
        let length = `${spacer}\n\n`.length
        let i = evt.description.indexOf(spacer)
        let notes = evt.description.slice(i+length)
        return notes
      } else {
        return evt.description
      }
    }
  }
}


// ------------Format TO Google -----------------------

export function formatToGoogle(evt){
  if (evt) {
    const status = confirmation(evt.confirmation);
    const description = notes(evt);
    const attendees = staff(evt.staff)
    const location = place(evt)

    let data = { status }

    if (evt.summary) {
      data.summary = evt.summary
    }

    if (location) {
      data.location = location
    }

    if (evt.start && evt.callTime) {
      if (moment(evt.callTime).isBefore(moment(evt.start))) {
        data.start = { dateTime: moment(evt.callTime).format() }
      } else {
        data.start = { dateTime: moment(evt.start).format() }
      }
    } else if (evt.start) {
      data.start = { dateTime: moment(evt.start).format() }
    }

    if (evt.end) {
      data.end = { dateTime: moment(evt.end).format() }
    }

    if (attendees) {
      data.attendees = attendees
    }

    if (description) {
      data.description = description
    } else {
      data.description = ''
    }

    return data
  }
}

function confirmation (status) {
  switch (status) {
    case 'Unconfirmed':
      return 'tentative'
    case 'Confirmed':
      return 'confirmed'
    case 'Cancelled':
      return 'cancelled'
    default:
      break;
  }
}

function place (evt){
  if (evt.location) {
    if (evt.location.address) {
      return evt.location.address.address
    }
  }
}

function notes(evt){
  if (evt.notes) {
    if (notesTimeSection(evt)) {
      return notesTimeSection(evt) + `${evt.notes}`
    } else {
      return evt.notes
    }
  } else {
    if (notesTimeSection(evt)) {
      return notesTimeSection(evt)
    }
  }
}


function notesTimeSection(evt){
  if (evt.callTime && evt.callLocation) {
    return (
      `Call: ${moment(evt.callTime).format('LT')} @ ${locationName(evt.callLocation)}\nJob: ${time(evt)}\n\n${spacer}\n\n`
    )
  } else if (evt.callTime) {
    return (
      `Call: ${moment(evt.callTime).format('LT')}\nJob: ${time(evt)}\n\n${spacer}\n\n`
    )
  }
}

function staff(eventEmployees){
  if (eventEmployees) {
    const attendees = eventEmployees.map(worker => {
      return (
        {
          email: worker.info.contact.emailAddresses[0].emailAddress,
          displayName: worker.info.contact.fullName,
          organizer: false,
          responseStatus: worker.confirmation,
        }
      )
    })
    return attendees
  } else {
    return []
  }
}
