import axios from 'axios'

const event = {
  getAll: async function(page, category, cancelToken){
    try {
      const resp = await axios.get(`/api/events?page=${page}&category=${category}`, { cancelToken: cancelToken })
      return resp.data
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Event Request Canceled')
      }
    }
  },
  getOne: async function(id, cancelToken){
    try {
      const resp = await axios.get(`/api/events/${id}`, { cancelToken: cancelToken })
      return resp.data
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Event Request Canceled')
      }
    }
  },
  find: async function(page, query, cancelToken){
    try {
      const resp = await axios.get(`/api/events/find?page=${page}&q=${query}`, { cancelToken: cancelToken })
      return resp.data
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Event Request Canceled')
      }
    }
  },
  findByClient: async function(page, clientId, cancelToken){
    try {
      const resp = await axios.get(`/api/events/find?page=${page}&client_id=${clientId}`, { cancelToken: cancelToken })
      return resp.data
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Event Request Canceled')
      }
    }
  },
  findByEmail: async function(page, email, cancelToken){
    try {
      const resp = await axios.get(`/api/events/find?page=${page}&email=${email}`, { cancelToken: cancelToken })
      return resp.data
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Event Request Canceled')
      }
    }
  },
  findByUID: async function (iCalUID, cancelToken){
    try {
      const resp = await axios.get(`/api/events/find?iCalUID=${iCalUID}`, { cancelToken: cancelToken })
      return resp.data
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Event Request Canceled')
      }
    }
  },
  createNew: async function(data, cancelToken) {
    try {
      const resp = await axios.post(`/api/events`, data, { cancelToken: cancelToken })
      return resp.data
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Event Request Canceled')
      }
    }
  },
  delete: async function (id, cancelToken){
    try {
      const resp = await axios.delete(`/api/events/${id}`, { cancelToken: cancelToken })
      return resp
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Event Request Canceled')
      }
    }
  },
  update: async function(id, data, cancelToken){
    try {
      const resp = await axios.put(`/api/events/${id}`, data, { cancelToken: cancelToken })
      return resp.data
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Event Request Canceled')
      }
    }
  },
  sync: async function(data, cancelToken){
    try {
      const resp = await axios.put('/api/events/sync', data, { cancelToken: cancelToken })
      return resp.data
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Request canceled', e.message)
      }
    }
  }
}

export {
  event
}
