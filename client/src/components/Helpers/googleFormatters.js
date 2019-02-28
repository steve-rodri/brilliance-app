import { contact } from '../../services/contact'
import { employee } from '../../services/employee'
import { start, end } from './datetime'
import moment from 'moment'

async function formatFromGoogle(evt){
  const workers = await employees(evt);
  // const creator = await creator(evt);
  let formattedEvent = await createObj(evt);
  if (employees) {
    formattedEvent.event_employees_attributes = workers;
  }
  return formattedEvent
}

function formatToGoogle(evt){
  return {
    start: { dateTime: evt.start },
    end: { dateTime: evt.end },
    created: evt.createdAt,
    updated: evt.updatedAt,
    creator: { email: evt.creator},
  }
}

async function createObj(evt){

  const obj = {
    i_cal_UID: evt.iCalUID,
    gc_id: evt.id,
    summary: evt.summary,
    notes: evt.description,
    start: moment(start(evt)).format(),
    end: moment(end(evt)).format(),
    created_at: evt.created,
    updated_at: evt.updated,
  }

  return obj
}

async function creator(e){
  const ct = await contact.findByEmail(e.creator.email)
  if (ct) {
    e.creator = ct.id
    return e
  } else {
    return e
  }

}

async function employees(evt){
  if (evt) {
    if (evt.attendees) {
      let staff = await Promise.all(evt.attendees.map(async attendee => {
        const worker = await employee.findByEmail(attendee.email)
        if (worker) {
          worker.confirmation = attendee.responseStatus
          return worker
        } else {
          return null
        }
      }))
      if (staff && staff.length) {
        const trimmed = staff.filter(s => s !== null)
        const workers = trimmed.map(s => ({employee_id: s.id, confirmation: s.confirmation }))
        return workers
      } else {
        return null
      }
    }
  }
}



export {
  formatToGoogle,
  formatFromGoogle
}
