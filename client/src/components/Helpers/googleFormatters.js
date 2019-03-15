import { contact } from '../../services/contact'
import { employee } from '../../services/employee'
import { event } from '../../services/event'
import { start, end, time } from './datetime'
import { locationName } from './locationName'
import moment from 'moment'

//--------------Format FROM Google----------------------

async function formatFromGoogle(evt){
  const workers = await attendees(evt);
  const eCreator = await creator(evt);
  const confirmation = status(evt);
  const notes = description(evt)

  let data = {
    i_cal_UID: evt.iCalUID,
    gc_id: evt.id,
    start: moment(start(evt)).format(),
    end: moment(end(evt)).format(),
  };

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

async function creator(e){
  if (e) {
    const ct = await contact.findByEmail(e.creator.email)
    if (ct) {
      return ct.id
    } else {
      return null
    }
  }
}

async function attendees(evt){
  if (evt) {
    if (evt.attendees) {
      //for each attendee, find corresponding worker/staff member by contact email
      let e = await event.findByUID(evt.iCalUID)

      if (e) {
        //if event has staff update staff with google attendee info
        if (e.staff && e.staff.length) {
          const staff = evt.attendees.map(attendee => {
            let updatedWorker;
            e.staff.forEach( worker => {
              const ee = worker.info.contact.emailAddresses.find( email => email.emailAddress === attendee.email )
              if (ee) {
                updatedWorker = { id: worker.id, employee_id: worker.info.id, confirmation: attendee.responseStatus }
              }
            })
            return updatedWorker
          })
          if (staff && staff.length) {
            const workers = staff.filter(s => s !== null)
            return workers
          } else {
            return null
          }
          // else create new staff with google attendee info
        } else {
          const staff = await Promise.all(evt.attendees.map(async attendee => {
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
      } else {
        const staff = await Promise.all(evt.attendees.map(async attendee => {
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
      const subsection = evt.description.includes('******************************')
      if (subsection) {
        let length = '******************************\n\n'.length
        let i = evt.description.indexOf('******************************')
        let notes = evt.description.slice(i+length)
        return notes
      } else {
        return evt.description
      }
    }
  }
}


// ------------Format TO Google -----------------------

function formatToGoogle(evt){
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

    if (evt.start) {
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
      `Call: ${moment(evt.callTime).format('LT')} @ ${locationName(evt.callLocation)}\nEvent: ${time(evt)}\n\n******************************\n\n`
    )
  } else if (evt.callTime) {
    return (
      `Call: ${moment(evt.callTime).format('LT')}\nEvent: ${time(evt)}\n\n******************************\n\n`
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



export {
  formatToGoogle,
  formatFromGoogle
}
