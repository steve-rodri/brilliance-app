import axios from 'axios'

const employee = {
  find: async function (query) {
    try {
      const resp = await axios.get(`/api/employees?q=${query}`)
      return resp.data
    } catch (e) {
      console.log(e)
    }
  },
  findByEmail: async function (email){
    try {
      const resp = await axios.get(`/api/employees?email='${email}'`)
      return resp.data
    } catch (e) {
      console.log(e)
    }
  }
}

export {
  employee
}
