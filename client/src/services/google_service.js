import axios from 'axios';

const GOOGLE = {
  getUser: async function(){
    const accessToken = localStorage.getItem('google_access_token');
    try {
        await axios({
        method: 'get',
        url: 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json',
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
    } catch (e) {
      localStorage.clear()
      return null
    }
  },

  getCalendars: async function (){
    const accessToken = localStorage.getItem('google_access_token');
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
  },

  getEvents: async function(calendar_id){
    const accessToken = localStorage.getItem('google_access_token');
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
  },

  createEvent: async function(calendarId, data){
    //required data properties
    // start : { dateTime }
    // end : { dateTime }
    //optional data properties
    // description
    // location
    // summary
    // transparency
    const accessToken = localStorage.getItem('google_access_token');
    try {
      const resp = await axios({
        method: 'post',
        url:`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        data: data
      })
      return resp.data;
    } catch (e) {
      console.log(e)
    }
  },

  patchEvent: async function(calendarId, eventId, data){
    //optional data properties
    // start : { dateTime }
    // end : { dateTime }
    // description
    // location
    // summary
    // transparency
    const accessToken = localStorage.getItem('google_access_token');
    try {
      const resp = await axios({
        method: 'patch',
        url:`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}?sendUpdates='none'`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        data: data
      })
      return resp.data;
    } catch (e) {
      console.log(e)
    }
  },

  importEvents: async function(calendarId, data){
    //required data properties
    // iCalUID
    // start : { dateTime }
    // end : { dateTime }
    //optional data properties
    // description
    // location
    // summary
    // transparency
    const accessToken = localStorage.getItem('google_access_token');
    try {
      const resp = await axios({
        method: 'post',
        url:`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/import`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        data: data
      })
      return resp.data;
    } catch (e) {
      console.log(e)
    }
  }
}

export {
  GOOGLE
}
