import axios from 'axios'

const company = {
  find: async function(query){
    try {
      const resp = await axios.get(`/api/companies/find?q=${query}`)
      return resp.data
    } catch (e) {
      console.log(e)
    }
  }
}

export {
  company
}
