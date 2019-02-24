import axios from 'axios';

const emailAddress = {
  find: async function(query) {
    try {
      const resp = await axios.get(`/api/email_addresses/find?q=${query}`)
      return resp.data
    } catch (e) {
      console.log(e)
    }
  }
}

export {
  emailAddress
}
