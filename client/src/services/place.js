import axios from 'axios'

const place = {
  getAll: async function (){
    try {
      const resp = await axios.get('/api/places')
      return resp.data
    } catch (e) {
      console.log(e)
    }
  },
  find: async function (query){
    try {
      const resp = await axios.get(`/api/places/find?q=${query}`)
      return resp.data
    } catch (e) {
      console.log(e)
    }
  }
}

export {
  place
}
