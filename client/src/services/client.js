import axios from 'axios'

const client = {
  getAll: async function (page){
    try {
      const resp = await axios.get(`/api/clients?page=${page}`)
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
  }
}

export {
  client
}
