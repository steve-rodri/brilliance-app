import axios from 'axios'

const employee = {
  getAll: async function (page, cancelToken) {
    try {
      const resp = await axios.get(`/api/employees?page=${page}`, { cancelToken: cancelToken })
      return resp.data
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Employee Request Canceled')
      }
    }
  },
  find: async function (query, cancelToken) {
    try {
      const resp = await axios.get(`/api/employees?q=${query}`, { cancelToken: cancelToken })
      return resp.data
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Employee Request Canceled')
      }
    }
  },
  findByEmail: async function (email, cancelToken){
    try {
      const resp = await axios.get(`/api/employees?email='${email}'`, { cancelToken: cancelToken })
      return resp.data
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Employee Request Canceled')
      }
    }
  }
}

export {
  employee
}
