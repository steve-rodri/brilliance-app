import axios from 'axios'

const place = {
  getAll: async function (cancelToken){
    try {
      const resp = await axios.get('/api/places', { cancelToken: cancelToken })
      return resp.data
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Place Request Canceled')
      }
    }
  },
  find: async function (query, cancelToken){
    try {
      const resp = await axios.get(`/api/places/find?q=${query}`, { cancelToken: cancelToken })
      return resp.data
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Place Request Canceled')
      }
    }
  }
}

export {
  place
}
