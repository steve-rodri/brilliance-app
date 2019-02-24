import { emailAddress } from '../../services/emailAddress'

async function formatFromGoogle(event){
  async function creator(){
    const addresses = await emailAddress.find(event.creator.email)
    if (addresses && addresses.length) {
      return addresses[0].id
    }
  }

  async function organizer(){
    const addresses = await emailAddress.find(event.organizer.email)
    if (addresses && addresses.length) {
      return addresses[0].id
    }
  }

  return {
    ...event,
    start: event.start.dateTime,
    end: event.end.dateTime,
    created_at: event.created,
    updated_at: event.updated,
    creator: await creator(),
    organizer: await organizer()
  }
}

function formatToGoogle(event){
  console.log(event)
  return {
    start: { dateTime: event.start },
    end: { dateTime: event.end },
    created: event.createdAt,
    updated: event.updatedAt,
    creator: { email: event.creator},
  }
}

export {
  formatToGoogle,
  formatFromGoogle
}
