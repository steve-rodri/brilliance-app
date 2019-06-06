import axios from 'axios';
import Qs from 'qs';

export const GOOGLE = {
  getUser: async function(options){
    const { cancelToken, unauthorizedCB } = options
    const accessToken = localStorage.getItem('google_access_token');
    try {
      const resp = await axios({
        method: 'get',
        url: 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json',
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        cancelToken: cancelToken
      })
      return resp.data
    } catch (e) {
      if (e.response && e.response.status === 401) {
        localStorage.clear()
        if (unauthorizedCB) unauthorizedCB()
      }
      return null
    }
  },
  getCalendars: async function (options){
    const { cancelToken, unauthorizedCB } = options
    const accessToken = localStorage.getItem('google_access_token');
    try {
      const resp = await axios({
        method: 'get',
        url: 'https://www.googleapis.com/calendar/v3/users/me/calendarList',
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        cancelToken: cancelToken
      })
      return resp.data.items
    } catch (e) {
      if (e.response && e.response.status === 401) {
        localStorage.clear()
        if (unauthorizedCB) unauthorizedCB()
      }
      return null
    }
  },
  getEvent: async function (calendarId, eventId, options) {
    const { cancelToken, unauthorizedCB } = options
    const accessToken = localStorage.getItem('google_access_token');
    try {
      const resp = await axios({
        method: 'get',
        url:`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        cancelToken: cancelToken
      })
      return resp.data
    } catch (e) {
      if (e.response && e.response.status === 401) {
        localStorage.clear()
        if (unauthorizedCB) unauthorizedCB()
      }
      return null
    }
  },
  getEvents: async function(calendar_id, options){
    const { cancelToken, unauthorizedCB } = options
    const accessToken = localStorage.getItem('google_access_token');
    try {
      const resp = await axios({
        method: 'get',
        url:`https://www.googleapis.com/calendar/v3/calendars/${calendar_id}/events?alwaysIncludeEmail=true&orderby=starttime&maxResults=2500`,
        headers:{
          Authorization: `Bearer ${accessToken}`
        },
        cancelToken: cancelToken
      })
      return resp.data.items
    } catch (e) {
      if (e.response && e.response.status === 401) {
        localStorage.clear()
        if (unauthorizedCB) unauthorizedCB()
      }
      return null
    }
  },
  createEvent: async function(calendarId, data, options){
    let { sendUpdates, cancelToken, unauthorizedCB } = options
    if (!sendUpdates) sendUpdates = 'none'
    const accessToken = localStorage.getItem('google_access_token');
    try {
      const resp = await axios({
        method: 'post',
        url:`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
        params: {
          sendUpdates: sendUpdates
        },
        paramsSerializer: function (params){
          return Qs.stringify(params, {skipNulls: true} )
        },
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        data: data,
        cancelToken: cancelToken
      })
      return resp.data;
    } catch (e) {
      if (e.response && e.response.status === 401) {
        localStorage.clear()
        if (unauthorizedCB) unauthorizedCB()
      }
      console.log(e)
    }
  },
  deleteEvent: async function(calendarId, eventId, options){
    const { cancelToken, unauthorizedCB } = options
    const accessToken = localStorage.getItem('google_access_token');
    try {
      const resp = await axios({
        method: 'delete',
        url:`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        cancelToken: cancelToken
      })
      return resp.data;
    } catch (e) {
      if (e.response && e.response.status === 401) {
        localStorage.clear()
        if (unauthorizedCB) unauthorizedCB()
      }
      return null
    }
  },
  patchEvent: async function(calendarId, eventId, data, options){
    let { sendUpdates, cancelToken, unauthorizedCB } = options
    if (!sendUpdates) sendUpdates = 'none'
    const accessToken = localStorage.getItem('google_access_token');

    try {
      const resp = await axios({
        method: 'patch',
        url:`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`,
        params: {
          sendUpdates: sendUpdates
        },
        paramsSerializer: function (params){
          return Qs.stringify(params, {skipNulls: true} )
        },
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        data: data,
        cancelToken: cancelToken
      })
      return resp.data;
    } catch (e) {
      if (e.response && e.response.status === 401) {
        localStorage.clear()
        if (unauthorizedCB) unauthorizedCB()
      }
      if (e.response && e.response.status === 404) {
        return null
      }
    }
  },
  importEvents: async function(calendarId, data, options){
    const { cancelToken, unauthorizedCB } = options
    const accessToken = localStorage.getItem('google_access_token');
    try {
      const resp = await axios({
        method: 'post',
        url:`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/import`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        data: data,
        cancelToken: cancelToken
      })
      return resp.data;
    } catch (e) {
      if (e.response && e.response.status === 401) {
        localStorage.clear()
        if (unauthorizedCB) unauthorizedCB()
      }
      console.log(e)
    }
  }
}
