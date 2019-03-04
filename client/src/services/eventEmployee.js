import axios from 'axios'

const eventEmployee = {
  create: async function (data) {
    try {
      const resp = await axios.post(`/api/event_employees`, data)
      return resp.data
    } catch (e) {
      console.log(e)
    }
  },
  delete: async function (id) {
    try {
      const resp = await axios.delete(`/api/event_employees/${id}`)
      return resp.data
    } catch (e) {
      console.log(e)
    }
  }
}

export {
  eventEmployee
}
