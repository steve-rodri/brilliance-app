import axios from 'axios'

const client = {
  getAll: async function (page, category) {
    try {
      const resp = await axios.get(`/api/clients?page=${page}&category=${category}`)
      return resp.data
    } catch (e) {
      console.log(e)
    }
  },
  create: async function (data) {
    try {
      const resp = await axios.post(`/api/clients/`, data)
      return resp.data
    } catch (e) {
      console.log(e)
    }
  },
  update: async function (id, data) {
    try {
      const resp = await axios.put(`/api/clients/${id}`, data)
      return resp.data
    } catch (e) {
      console.log(e)
    }
  },
  delete: async function (id) {
    try {
      const resp = await axios.delete(`/api/clients/${id}`)
      return resp.data
    } catch (e) {
      console.log(e)
    }
  },
  find: async function (query){
    try {
      const resp = await axios.get(`/api/clients/find?q=${query}`)
      return resp.data
    } catch (e) {
      console.log(e)
    }
  },
  findById: async function (id) {
    try {
      const resp = await axios.get(`/api/clients/${id}`)
      return resp.data
    } catch (e) {
      console.log(e)
    }
  },
  getEvents: async function (page, id){
    try {
      const resp = await axios.get(`/api/clients/${id}/events?page=${page}`)
      return resp.data
    } catch (e) {
      console.log(e)
    }
  }
}

export {
  client
}
