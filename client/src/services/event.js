import axios from 'axios'

const event = {
  getAll: async function(){
    try {
      const resp = await axios.get('/api/events')
      console.log(resp.data)
    } catch (e) {
      console.log(e)
    }
  }
}

export {
  event
}
