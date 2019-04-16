import axios from 'axios'

const contact = {
  find: async function(query, cancelToken){
    try {
      const resp = await axios.get(`/api/contacts/find?q=${query}`, { cancelToken: cancelToken })
      return resp.data
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Contact Request Canceled')
      }
    }
  },
  findByEmail: async function(email, cancelToken){
    try {
      const resp = await axios.get(`/api/contacts/find?email=${email}`, { cancelToken: cancelToken })
      return resp.data
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Contact Request Canceled')
      }
    }
  }
}

export {
  contact
}
