import axios from 'axios';

const emailAddress = {
  find: async function(query, cancelToken) {
    try {
      const resp = await axios.get(`/api/email_addresses/find?q=${query}`, { cancelToken: cancelToken })
      return resp.data
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Email Address Request Canceled')
      }
    }
  }
}

export {
  emailAddress
}
