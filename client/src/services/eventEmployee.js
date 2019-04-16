import axios from 'axios'

const eventEmployee = {
  create: async function (data, cancelToken) {
    try {
      const resp = await axios.post(`/api/event_employees`, data, { cancelToken: cancelToken })
      return resp.data
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('EventEmployee Request Canceled')
      }
    }
  },
  delete: async function (id, cancelToken) {
    try {
      const resp = await axios.delete(`/api/event_employees/${id}`, { cancelToken: cancelToken })
      return resp.data
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('EventEmployee Request Canceled')
      }
    }
  }
}

export {
  eventEmployee
}
