import axios from 'axios';

async function getGoogleCalendars(){
  const accessToken = localStorage.getItem('google_access_token');
  if (!accessToken) throw new Error('Must authorize with Google');
  try {
    const resp = await axios({
      method: 'get',
      url: 'https://www.googleapis.com/calendar/v3/users/me/calendarList',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    return resp.data.items
  } catch (e) {
    console.log(e)
  }
}

async function getGoogleEvents(calendar_id){
  const accessToken = localStorage.getItem('google_access_token');
  if(!accessToken) throw new Error('Must authorize with Google');
  const resp = await axios({
    method: 'get',
    url:`https://www.googleapis.com/calendar/v3/calendars/${calendar_id}/events?alwaysIncludeEmail=true&orderby=starttime&maxResults=2500`,
    headers:{
      Authorization: `Bearer ${accessToken}`
    },
  })
  return resp.data.items
}

async function createGoogleEvent(calendar_id, start, end, summary){
  const accessToken = localStorage.getItem('google_access_token');
  if(!accessToken) throw new Error('Must authorize with Google');
  const resp = await axios({
    method: 'post',
    url:`https://www.googleapis.com/calendar/v3/calendars/${calendar_id}/events`,
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    data: {
      start: {
        dateTime: start
      },
      end: {
        dateTime: end
      },
      summary: summary
    }
  })
  console.log(resp);
}

export {
  getGoogleCalendars,
  getGoogleEvents,
  createGoogleEvent
}
