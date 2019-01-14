import axios from 'axios'

const event = {
  getAll: async function(){
    try {
      const resp = await axios.get('/api/events')
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
      console.log(e)
    }
  },
  createNew: async function() {
    try {
      const resp = await axios.post(`/api/events`, {summary:"Untitled"})
      return resp
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
  bulkUpdate: async function(data){
    try {
      // const resp = await axios.put('/api/events/', data)
    } catch (e) {
      console.log(e)
    }
  }
}

export {
  event
}
