import axios from 'axios'

const client = {
  getAll: async function (){
    try {
      const resp = await axios.get('/api/clients')
      return resp.data
    } catch (e) {
      console.log(e)
    }
  }
}

export {
  client
}
