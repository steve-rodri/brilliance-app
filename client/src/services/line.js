import axios from 'axios'

const line = {
  create: async function (data, cancelToken) {
    try {
      const resp = await axios.post(`/api/lines`, data, { cancelToken: cancelToken })
      return resp.data
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Line Request Canceled')
      }
    }
  },
  delete: async function (id, cancelToken){
    try {
      const resp = await axios.delete(`/api/lines/${id}`, { cancelToken: cancelToken })
      return resp.data
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Line Request Canceled')
      }
    }
  }
}

export {
  line
}
