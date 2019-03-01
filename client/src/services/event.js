import axios from 'axios'

const event = {
  getAll: async function(page, category){
    try {
      const resp = await axios.get(`/api/events?page=${page}&category=${category}`)
      return resp.data
    } catch (e) {
      console.log(e)
    }
  },
  getOne: async function(id){
    try {
      const resp = await axios.get(`/api/events/${id}`)
      return resp.data
    } catch (e) {
      return null
    }
  },
  find: async function(page, query){
    try {
      const resp = await axios.get(`/api/events/find?page=${page}&q=${query}`)
      return resp.data
    } catch (e) {
      console.log(e)
    }
  },
  findByEmail: async function(page, email){
    try {
      const resp = await axios.get(`/api/events/find?page=${page}&email=${email}`)
      return resp.data
    } catch (e) {
      console.log(e)
    }
  },
  createNew: async function(data) {
    try {
      const resp = await axios.post(`/api/events`, data)
      return resp.data
    } catch (e) {
      console.log(e)
    }
  },
  delete: async function (id){
    try {
      const resp = await axios.delete(`/api/events/${id}`)
      return resp
    } catch (e) {
      console.log(e)
    }
  },
  update: async function(id, data){
    try {
      const resp = await axios.put(`/api/events/${id}`, data)
      return resp.data
    } catch (e) {
      console.log(e)
    }
  },
  sync: async function(data){
    try {
      const resp = await axios.put('/api/events/sync', data)
      return resp.data
    } catch (e) {
      console.log(e)
    }
  }
}

export {
  event
}
