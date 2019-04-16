import axios from 'axios'

const client = {
  getAll: async function (page, category, cancelToken) {
    try {
      const resp = await axios.get(`/api/clients?page=${page}&category=${category}`, { cancelToken: cancelToken })
      return resp.data
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Client Request Canceled')
      }
    }
  },
  getEvents: async function (page, id, cancelToken){
    try {
      const resp = await axios.get(`/api/clients/${id}/events?page=${page}`, { cancelToken: cancelToken })
      return resp.data
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Client Request Canceled')
      }
    }
  },
  create: async function (data, cancelToken) {
    try {
      const resp = await axios.post(`/api/clients/`, data, { cancelToken: cancelToken })
      return resp.data
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Client Request Canceled')
      }
    }
  },
  update: async function (id, data, cancelToken) {
    try {
      const resp = await axios.put(`/api/clients/${id}`, data, { cancelToken: cancelToken })
      return resp.data
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Client Request Canceled')
      }
    }
  },
  delete: async function (id, cancelToken) {
    try {
      const resp = await axios.delete(`/api/clients/${id}`, { cancelToken: cancelToken })
      return resp.data
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Client Request Canceled')
      }
    }
  },
  find: async function (page, query, cancelToken){
    try {
      const resp = await axios.get(`/api/clients/find?page=${page}&q=${query}`, { cancelToken: cancelToken })
      return resp.data
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Client Request Canceled')
      }
    }
  },
  findById: async function (id, cancelToken) {
    try {
      const resp = await axios.get(`/api/clients/${id}`, { cancelToken: cancelToken })
      return resp.data
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Client Request Canceled')
      }
    }
  }
}

export {
  client
}
