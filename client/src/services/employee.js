import axios from 'axios'

const employee = {
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
