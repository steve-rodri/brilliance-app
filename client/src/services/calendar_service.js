import axios from 'axios';
const accessToken = localStorage.getItem('google_access_token');

async function getUser(){
  if (!accessToken) throw new Error('Must authorize with Google');
  try {
    const resp = await axios({
      method: 'get',
      url: 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    return resp.data
  } catch (e) {
    localStorage.clear()
    return null
  }
}

async function getGoogleCalendars(){
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
    localStorage.clear()
    return null
  }
}

async function getGoogleEvents(calendar_id){
  if(!accessToken) throw new Error('Must authorize with Google');
  try {
    const resp = await axios({
      method: 'get',
      url:`https://www.googleapis.com/calendar/v3/calendars/${calendar_id}/events?alwaysIncludeEmail=true&orderby=starttime&maxResults=2500`,
      headers:{
        Authorization: `Bearer ${accessToken}`
      },
    })
    return resp.data.items
  } catch (e) {
    localStorage.clear()
    return null
  }
}

async function createGoogleEvent(calendar_id, start, end, summary){
  if(!accessToken) throw new Error('Must authorize with Google');
  try {
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
  } catch (e) {
    localStorage.clear();
    return null
  }
}

export {
  getUser
  getGoogleCalendars,
  getGoogleEvents,
  createGoogleEvent
}
