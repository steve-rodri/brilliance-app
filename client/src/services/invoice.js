import axios from 'axios'

const invoice = {
  get: async function(id){
    try {
      const resp = await axios.get(`/api/invoices/${id}`)
      return resp.data
    } catch (e) {
      console.log(e)
    }
  },
  getAll: async function (page, category){
    try {
      console.log(page, category)
      const resp = await axios.get(`/api/invoices?page=${page}&category=${category}`)
      return resp.data
    } catch (e) {
      console.log(e)
    }
  },
  find: async function (page, query){
    try {
      const resp = await axios.get(`/api/invoices?page=${page}$q=${query}`)
      return resp.data
    } catch (e) {
      console.log(e)
    }
  }
}

export {
  invoice
}
