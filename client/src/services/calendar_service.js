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
    console.log(resp.data.items)
  } catch (e) {
    console.log(e)
  }
}

async function getGoogleEvents(){
  const accessToken = localStorage.getItem('google_access_token');
  if(!accessToken) throw new Error('Must authorize with Google');
  const resp = await axios({
    method: 'get',
    url:'https://www.googleapis.com/calendar/v3/calendars/primary/events',
    headers:{
      Authorization: `Bearer ${accessToken}`
    },
  })
  console.log(resp.data.items)
}

async function createGoogleEvent(start, end, summary){
  const accessToken = localStorage.getItem('google_access_token');
  if(!accessToken) throw new Error('Must authorize with Google');
  const resp = await axios({
    method: 'post',
    url:'https://www.googleapis.com/calendar/v3/calendars/primary/events',
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
