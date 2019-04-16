import axios from 'axios'

const company = {
  find: async function(query, cancelToken){
    try {
      const resp = await axios.get(`/api/companies/find?q=${query}`, { cancelToken: cancelToken })
      return resp.data
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Company Request Canceled')
      }
    }
  }
}

export {
  company
}
